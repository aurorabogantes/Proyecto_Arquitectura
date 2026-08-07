const https = require('https');

// Language → Wandbox compiler name (Python only; JS runs client-side)
const WANDBOX_COMPILER = {
    python: 'cpython-3.12.7',
    c:      'gcc-head',
};

function wandboxRequest(compiler, code) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({ compiler, code, stdin: '' });
        const req  = https.request(
            { hostname: 'wandbox.org', path: '/api/compile.json', method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
            res => {
                let raw = '';
                res.on('data', c => { raw += c; });
                res.on('end', () => resolve(JSON.parse(raw)));
            }
        );
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

function geminiRequest(prompt) {
    return new Promise((resolve, reject) => {
        const key  = process.env.GEMINI_API_KEY;
        const body = JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        });
        const path = `/v1beta/models/gemini-flash-lite-latest:generateContent?key=${key}`;
        const req  = https.request(
            { hostname: 'generativelanguage.googleapis.com', path, method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
            res => {
                let raw = '';
                res.on('data', c => { raw += c; });
                res.on('end', () => {
                    const parsed = JSON.parse(raw);
                    const text   = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    resolve(text);
                });
            }
        );
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

const aiController = {

    // POST /api/ai/execute  { code, language }
    async execute(req, res) {
        try {
            const { code, language = 'python' } = req.body;
            if (!code) return res.status(400).json({ error: 'code es requerido' });

            // HTML returns preview; JS executes client-side
            if (language === 'html')       return res.json({ success: true, output: '', html: code });
            if (language === 'javascript') return res.json({ success: true, clientSide: true });

            const compiler = WANDBOX_COMPILER[language];
            if (!compiler) return res.status(400).json({ error: `Lenguaje '${language}' no soportado` });

            const result = await wandboxRequest(compiler, code);
            const output = (result.program_output || '') + (result.program_error || '') + (result.compiler_error || '');
            res.json({ success: true, output: output.trim() || '(sin salida)', exitCode: Number(result.status) });
        } catch (err) {
            res.status(500).json({ error: 'Error al ejecutar el código: ' + err.message });
        }
    },

    // POST /api/ai/assist  { code, language, projectTitle, projectDescription }
    async assist(req, res) {
        try {
            const { code, language = 'python', projectTitle, projectDescription } = req.body;
            if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'TU_API_KEY_AQUI') {
                return res.status(503).json({ error: 'GEMINI_API_KEY no configurada. Agrégala en el archivo .env del backend.' });
            }

            const prompt = `Eres un tutor de programación amigable para niños (8-15 años). 
El estudiante está trabajando en el proyecto: "${projectTitle}".
Descripción del proyecto: ${projectDescription || 'Sin descripción'}
Lenguaje: ${language}

Código actual del estudiante:
\`\`\`${language}
${code || '(sin código aún)'}
\`\`\`

Ayúdale de forma clara y motivadora. Si el código tiene errores, explica qué está mal y cómo corregirlo.
Si está bien, da el siguiente paso o mejora. Usa emojis y un tono entusiasta.
Responde en español. Máximo 200 palabras.`;

            const text = await geminiRequest(prompt);
            res.json({ success: true, suggestion: text });
        } catch (err) {
            res.status(500).json({ error: 'Error al consultar el asistente: ' + err.message });
        }
    }
};

module.exports = aiController;
