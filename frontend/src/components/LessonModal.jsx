import { useState } from 'react';

/* ─────────────────────────────────────────────────────────────
   Contenido de actividades interactivas por título de lección
   ───────────────────────────────────────────────────────────── */
const ACTIVITIES = {
    /* ── Scratch ── */
    'Tu primer sprite': {
        steps: [
            {
                title: '¿Qué es un Sprite?',
                explanation: 'Un sprite es cualquier personaje u objeto que puedes programar en Scratch. Puede ser un gato, una pelota o ¡incluso tú mismo con la cámara!',
                question: '¿Qué es un sprite en Scratch?',
                options: ['Un tipo de error de código', 'Un personaje u objeto programable', 'El fondo de escena', 'Un bloque de movimiento'],
                correct: 1
            },
            {
                title: 'Elige tu Sprite',
                explanation: 'Para añadir un sprite haz clic en el ícono 🐱 de la esquina inferior derecha del panel de sprites y elige uno de la biblioteca.',
                question: '¿Dónde se encuentra el botón para agregar un sprite nuevo?',
                options: ['En el menú Archivo → Nuevo', 'En la barra superior de herramientas', 'Esquina inferior derecha del panel de sprites', 'Pestaña "Sonidos"'],
                correct: 2
            },
            {
                title: 'Dale nombre a tu Sprite',
                explanation: 'Con el sprite seleccionado, puedes cambiar su nombre en el campo de texto del panel de sprites. Dar nombres claros ayuda a organizarte.',
                question: '¿Por qué es importante nombrar los sprites?',
                options: ['Para que se muevan más rápido', 'Para identificarlos y referenciarlos en el código', 'Para cambiar su color automáticamente', 'Para hacerlos invisibles'],
                correct: 1
            }
        ]
    },
    'Variables y tipos': {
        steps: [
            {
                title: '¿Qué es una variable?',
                explanation: 'Una variable es como una caja con nombre donde guardamos información. En Python: `nombre = "Ana"` guarda el texto "Ana" en la caja llamada "nombre".',
                question: '¿Qué almacena una variable?',
                options: ['Solo números', 'Solo texto', 'Cualquier tipo de dato: número, texto, booleano…', 'Únicamente listas'],
                correct: 2
            },
            {
                title: 'Tipos de datos',
                explanation: 'Python tiene varios tipos: `int` (entero), `float` (decimal), `str` (texto) y `bool` (Verdadero/Falso). Python los detecta automáticamente.',
                question: '¿Qué tipo de dato es `edad = 10` en Python?',
                options: ['str', 'float', 'int', 'bool'],
                correct: 2
            },
            {
                title: 'Operaciones con variables',
                explanation: 'Puedes combinar variables: `suma = 3 + 5` da como resultado `8`. También puedes concatenar texto: `saludo = "Hola " + nombre`.',
                question: '¿Cuál es el resultado de `x = 4 + 3`?',
                options: ['43', '7', '"4+3"', 'Error'],
                correct: 1
            }
        ]
    },
    'Bucles': {
        steps: [
            {
                title: '¿Para qué sirven los bucles?',
                explanation: 'Los bucles repiten acciones sin escribir el mismo código muchas veces. `for i in range(5): print(i)` imprime 0, 1, 2, 3, 4.',
                question: '¿Cuántas veces ejecuta el cuerpo `for i in range(3):`?',
                options: ['2 veces', '3 veces', '4 veces', '1 vez'],
                correct: 1
            },
            {
                title: 'Bucle while',
                explanation: '`while condicion:` repite mientras la condición sea verdadera. ¡Cuidado con los bucles infinitos! Siempre asegúrate de que la condición cambie.',
                question: '¿Cuándo se detiene un `while`?',
                options: ['Después de 10 repeticiones', 'Cuando la condición se vuelve Falsa', 'Cuando el programa termina', 'Nunca se detiene'],
                correct: 1
            },
            {
                title: 'break y continue',
                explanation: '`break` sale del bucle inmediatamente. `continue` salta a la siguiente iteración. Son muy útiles para controlar el flujo.',
                question: '¿Qué hace `break` dentro de un bucle?',
                options: ['Pausa el bucle 1 segundo', 'Salta a la siguiente vuelta', 'Termina el bucle de inmediato', 'Reinicia el contador'],
                correct: 2
            }
        ]
    },
    'Estilos con CSS': {
        steps: [
            {
                title: '¿Qué hace CSS?',
                explanation: 'CSS (Cascading Style Sheets) le da estilo a tu HTML: colores, tamaños, posiciones. Sin CSS, todo sería texto negro sobre fondo blanco.',
                question: '¿Para qué sirve CSS?',
                options: ['Agregar contenido a la página', 'Dar estilo visual al HTML', 'Conectar con bases de datos', 'Animar videos'],
                correct: 1
            },
            {
                title: 'Selectores básicos',
                explanation: 'Con `p { color: red; }` pintamos todos los párrafos de rojo. Con `.clase { }` y `#id { }` apuntamos a elementos específicos.',
                question: '¿Qué selector aplica estilos a todos los elementos `<h1>`?',
                options: ['.h1 { }', '#h1 { }', 'h1 { }', '*h1 { }'],
                correct: 2
            },
            {
                title: 'Box Model',
                explanation: 'Cada elemento tiene: `content` (contenido), `padding` (relleno interior), `border` (borde) y `margin` (espacio exterior). ¡Dibuja el modelo en tu cabeza!',
                question: '¿Cuál propiedad CSS controla el espacio exterior alrededor de un elemento?',
                options: ['padding', 'border', 'margin', 'spacing'],
                correct: 2
            }
        ]
    },
    'Automatización con bloques': {
        steps: [
            {
                title: 'Bloques de código en Minecraft',
                explanation: 'En Code Builder (Minecraft Education), los bloques de código se conectan como LEGO. Cada bloque es una instrucción que el agente ejecuta en el mundo.',
                question: '¿Qué hace el bloque "mover adelante 1 paso"?',
                options: ['Gira al agente', 'Mueve al agente 1 bloque hacia adelante', 'Coloca un bloque en el suelo', 'Teletransporta al jugador'],
                correct: 1
            },
            {
                title: 'Repetir acciones',
                explanation: 'El bloque "repetir X veces" dentro de Code Builder ejecuta todo lo que esté dentro esa cantidad de veces, ¡igual que un bucle for!',
                question: 'Para construir una pared de 5 bloques de largo, ¿qué bloque usarías?',
                options: ['si/entonces', 'repetir 5 veces', 'esperar 5 segundos', 'teletransportar'],
                correct: 1
            },
            {
                title: 'Condiciones en el mundo',
                explanation: 'Puedes usar "si hay bloque delante → girar" para que el agente navegue sin chocar. Las condiciones hacen que tu código sea inteligente.',
                question: '¿Cómo se llama el bloque que toma decisiones según una condición?',
                options: ['repetir', 'mover', 'si/entonces', 'detener'],
                correct: 2
            }
        ]
    },
    'Circuitos simples': {
        steps: [
            {
                title: 'Componentes básicos',
                explanation: 'Un circuito necesita: fuente de energía (batería), conductor (cable), carga (LED o motor) y un interruptor. Sin todos estos elementos, el circuito no funciona.',
                question: '¿Qué componente proporciona la energía en un circuito?',
                options: ['El LED', 'El cable', 'La batería', 'El resistor'],
                correct: 2
            },
            {
                title: 'Serie vs. Paralelo',
                explanation: 'En serie los componentes van uno tras otro (si uno falla, todos fallan). En paralelo van en ramas (si uno falla, los demás siguen).',
                question: '¿En qué tipo de circuito si un LED se quema, los demás siguen encendidos?',
                options: ['Serie', 'Paralelo', 'Mixto', 'Ninguno'],
                correct: 1
            },
            {
                title: 'Resistencias',
                explanation: 'Las resistencias limitan la corriente para no quemar los LEDs. La ley de Ohm dice: V = I × R (Voltaje = Corriente × Resistencia).',
                question: '¿Para qué se usa una resistencia junto a un LED?',
                options: ['Para que brille más', 'Para limitar la corriente y proteger el LED', 'Para cambiar el color', 'Para almacenar energía'],
                correct: 1
            }
        ]
    },
    'Secuencias paso a paso': {
        steps: [
            {
                title: '¿Qué es una secuencia?',
                explanation: 'Una secuencia es una serie de instrucciones en orden. Las computadoras ejecutan instrucciones una por una, de arriba hacia abajo.',
                question: '¿En qué orden ejecuta una computadora las instrucciones?',
                options: ['Al azar', 'De abajo hacia arriba', 'De arriba hacia abajo en orden', 'Solo las pares'],
                correct: 2
            },
            {
                title: 'Importancia del orden',
                explanation: 'El orden importa. "Poner zapatos → poner calcetines" da un resultado diferente a "poner calcetines → poner zapatos". ¡Lo mismo pasa en programación!',
                question: '¿Por qué es importante el orden en una secuencia de instrucciones?',
                options: ['No importa el orden', 'Cambia el resultado final', 'Solo importa en matemáticas', 'Para decoración'],
                correct: 1
            },
            {
                title: 'Detectar errores de secuencia',
                explanation: 'Un "bug" de secuencia ocurre cuando las instrucciones están en el orden incorrecto. Revisar paso a paso ayuda a encontrar y corregir estos errores.',
                question: '¿Cómo se llama un error en el código de un programa?',
                options: ['Virus', 'Bug', 'Crash', 'Glitch'],
                correct: 1
            }
        ]
    }
};

/* Fallback genérico cuando no hay contenido específico */
function getGenericActivity(lesson) {
    return {
        steps: [
            {
                title: `Introducción: ${lesson.title}`,
                explanation: `En esta lección aprenderás los conceptos fundamentales de "${lesson.title}". Lee con atención y responde la pregunta.`,
                question: `¿Cuál es el objetivo principal de la lección "${lesson.title}"?`,
                options: ['Memorizar datos sin entender', 'Comprender y aplicar el concepto', 'Solo ver el video', 'Tomar apuntes copiando'],
                correct: 1
            },
            {
                title: 'Practica lo aprendido',
                explanation: 'La mejor forma de aprender programación es practicando. Cada error que cometes es una oportunidad de aprender algo nuevo.',
                question: '¿Cuál es la mejor manera de aprender programación?',
                options: ['Solo leer libros', 'Practicar escribiendo código', 'Ver videos sin pausar', 'Memorizar comandos'],
                correct: 1
            },
            {
                title: '¡Lo lograste!',
                explanation: 'Has llegado al final de esta actividad. Recuerda que la constancia es clave. ¡Sigue practicando y se irá volviendo más fácil!',
                question: '¿Qué actitud es más importante para aprender a programar?',
                options: ['Rendirse cuando algo es difícil', 'Esperar a que alguien lo resuelva', 'Persistir y buscar soluciones', 'Solo hacer las partes fáciles'],
                correct: 2
            }
        ]
    };
}

/* Actividad de challenge / project (checklist) */
const CHALLENGE_CONTENT = {
    'Reto: Crea tu animación': {
        title: '¡Crea tu primera animación en Scratch!',
        description: 'Sigue estos pasos para crear una animación completa. Marca cada paso cuando lo completes.',
        tasks: [
            'Abre Scratch en scratch.mit.edu y crea un proyecto nuevo',
            'Elige un sprite de la biblioteca (puedes usar el gato por defecto)',
            'Agrega el bloque "al presionar bandera verde" desde la categoría Eventos',
            'Agrega "mover 10 pasos" y "rebota si toca un borde" desde Movimiento',
            'Haz clic en la bandera verde y observa a tu sprite moverse',
            'Agrega un sonido con el bloque "tocar sonido" desde la categoría Sonido',
            '¡Guarda tu proyecto con Archivo → Guardar ahora!'
        ]
    },
    'Reto: El laberinto': {
        title: '¡Resuelve el laberinto algorítmico!',
        description: 'Diseña los pasos para guiar al personaje por el laberinto. Marca cada tarea cuando la hayas pensado y resuelto.',
        tasks: [
            'Dibuja en papel el mapa del laberinto con su inicio y salida',
            'Identifica las intersecciones donde se debe tomar una decisión (izquierda/derecha/adelante)',
            'Escribe la secuencia de movimientos: adelante, girar, adelante…',
            'Verifica tu secuencia: ¿llega a la salida sin chocar con muros?',
            'Simplifica tu secuencia usando repetición cuando sea posible',
            'Explica tu solución a alguien y verifica si la entiende'
        ]
    },
    'Proyecto: Construcción automática': {
        title: '¡Construye automáticamente en Minecraft!',
        description: 'Usa Code Builder para automatizar una construcción. Completa cada paso del proyecto.',
        tasks: [
            'Abre Minecraft Education Edition y crea un mundo nuevo',
            'Activa Code Builder (tecla C) y elige "Make Code"',
            'Crea un bloque "al iniciar" y conecta "mover adelante 1"',
            'Agrega "colocar bloque debajo" para que el agente construya mientras camina',
            'Usa "repetir 5 veces" para construir una fila de 5 bloques',
            'Agrega un giro de 90° y otra fila para hacer una L o un cuadrado',
            '¡Ejecuta el programa y observa la construcción automática!'
        ]
    },
    'Tu primer robot': {
        title: '¡Construye y programa tu primer robot!',
        description: 'Sigue estas etapas para ensamblar y programar el robot básico.',
        tasks: [
            'Identifica todos los componentes: motor, placa Arduino/micro:bit, cables, batería',
            'Conecta el motor al controlador siguiendo el diagrama del circuito',
            'Conecta la batería y verifica que no haya cortocircuitos',
            'Abre el entorno de programación (Arduino IDE o MakeCode)',
            'Escribe el código para encender el motor por 2 segundos y apagarlo',
            'Carga el código al microcontrolador y prueba el movimiento',
            'Agrega una condición: si detecta un obstáculo, el robot se detiene'
        ]
    }
};

function getGenericChallenge(lesson) {
    return {
        title: `Reto: ${lesson.title}`,
        description: `Completa las tareas del reto "${lesson.title}". Marca cada una cuando la hayas terminado.`,
        tasks: [
            'Lee detenidamente las instrucciones del reto',
            'Identifica qué conceptos de las lecciones anteriores necesitas aplicar',
            'Escribe o planifica tu solución antes de empezar',
            'Implementa tu solución paso a paso',
            'Prueba tu solución y corrígela si es necesario',
            '¡Celebra haber completado el reto!'
        ]
    };
}

/* ══════════════════════════════════════════════════════════════
   Componente principal: LessonModal
   ══════════════════════════════════════════════════════════════ */
export default function LessonModal({ lesson, course, onClose, onComplete, onEnroll, isEnrolled }) {

    const videoItems = (course.mediaItems || []).filter(m => m.type === 'video');
    const videoLessons = (course.lessons || []).filter(l => l.type === 'video');
    const videoIndex = videoLessons.findIndex(l => l.id === lesson.id);
    const matchedVideo = videoItems[videoIndex] || videoItems[0] || null;

    return (
        <div
            className="modal d-block"
            style={{ background: 'rgba(0,0,0,.7)', zIndex: 1055 }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-content border-0 rounded-4">
                    <div
                        className="modal-header border-0 text-white rounded-top-4"
                        style={{ background: 'linear-gradient(135deg,#FF6B6B,#4ECDC4)' }}
                    >
                        <div>
                            <h5 className="modal-title fw-bold mb-0">{lesson.title}</h5>
                            <small className="opacity-75">
                                {typeLabel(lesson.type)} · ⏱ {lesson.duration}
                            </small>
                        </div>
                        <button className="btn-close btn-close-white" onClick={onClose} />
                    </div>

                    <div className="modal-body p-0">
                        {/* ── Bloqueado: no inscrito ── */}
                        {!isEnrolled ? (
                            <LockedPreview course={course} lesson={lesson} onEnroll={onEnroll} onClose={onClose} />
                        ) : (
                            <div className="p-4">
                                {lesson.type === 'video' && (
                                    <VideoContent
                                        video={matchedVideo}
                                        lesson={lesson}
                                        onComplete={onComplete}
                                        isEnrolled={isEnrolled}
                                    />
                                )}
                                {lesson.type === 'interactive' && (
                                    <InteractiveContent
                                        lesson={lesson}
                                        onComplete={onComplete}
                                        isEnrolled={isEnrolled}
                                    />
                                )}
                                {(lesson.type === 'challenge' || lesson.type === 'project') && (
                                    <ChallengeContent
                                        lesson={lesson}
                                        onComplete={onComplete}
                                        isEnrolled={isEnrolled}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Locked preview (not enrolled) ─────────────────────── */
function LockedPreview({ course, lesson, onEnroll, onClose }) {
    const [enrolling, setEnrolling] = useState(false);

    const handleEnroll = async () => {
        setEnrolling(true);
        await onEnroll();
        setEnrolling(false);
        onClose();
    };

    return (
        <div>
            {/* Thumbnail con overlay de candado */}
            <div className="position-relative" style={{ height: 220, overflow: 'hidden' }}>
                {course.thumbnail && (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', filter: 'blur(3px) brightness(.5)' }}
                    />
                )}
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white"
                >
                    <div style={{ fontSize: '3.5rem' }}>🔒</div>
                    <p className="fw-bold fs-5 mb-0">Lección bloqueada</p>
                </div>
            </div>

            {/* Info + botón de inscripción */}
            <div className="p-4 text-center">
                <span
                    className="badge rounded-pill px-3 py-2 mb-3 d-inline-block"
                    style={{ background: '#fff3cd', color: '#856404' }}
                >
                    {typeLabel(lesson.type)} · ⏱ {lesson.duration}
                </span>
                <h5 className="fw-bold mb-1">{lesson.title}</h5>
                <p className="text-muted mb-4">
                    Inscríbete en <strong>{course.title}</strong> para acceder a esta lección y ganar <strong>{course.points} puntos</strong>.
                </p>
                <button
                    className="btn btn-primary-custom px-5 py-2 fw-bold"
                    onClick={handleEnroll}
                    disabled={enrolling}
                >
                    {enrolling ? 'Inscribiendo...' : '¡Inscribirme y desbloquear!'}
                </button>
            </div>
        </div>
    );
}

function typeLabel(type) {
    return { video: '🎬 Video', interactive: '🖱️ Actividad interactiva', challenge: '⚔️ Reto', project: '🛠️ Proyecto' }[type] || type;
}

/* ── Video ─────────────────────────────────────────────────── */
function VideoContent({ video, lesson, onComplete, isEnrolled }) {
    const [watched, setWatched] = useState(false);

    if (!video) {
        return (
            <div className="text-center py-5 text-muted">
                <div className="fs-1 mb-2">🎬</div>
                <p>Video no disponible aún. ¡Vuelve pronto!</p>
            </div>
        );
    }
    return (
        <div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                    src={video.url + '?rel=0'}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: 12 }}
                    loading="lazy"
                />
            </div>
            <p className="text-muted small mt-2 mb-3">📹 {video.title}</p>

            {isEnrolled && !watched && (
                <button
                    className="btn btn-secondary-custom w-100"
                    onClick={() => setWatched(true)}
                >
                    ✅ He visto el video
                </button>
            )}
            {isEnrolled && watched && (
                <div className="text-center mt-2">
                    <div className="fs-4 mb-1">🎉</div>
                    <p className="fw-semibold text-success mb-2">¡Video completado!</p>
                    <button className="btn btn-primary-custom px-4" onClick={onComplete}>
                        ✓ Completar lección (+10 pts)
                    </button>
                </div>
            )}
        </div>
    );
}

/* ── Interactive (mini-quiz por pasos) ─────────────────────── */
function InteractiveContent({ lesson, onComplete, isEnrolled }) {
    const activity = ACTIVITIES[lesson.title] || getGenericActivity(lesson);
    const [step, setStep]         = useState(0);
    const [selected, setSelected] = useState(null);
    const [feedback, setFeedback] = useState(null);   // 'correct' | 'wrong'
    const [score, setScore]       = useState(0);
    const [done, setDone]         = useState(false);

    const current = activity.steps[step];

    const handleAnswer = (idx) => {
        if (selected !== null) return;
        setSelected(idx);
        const isCorrect = idx === current.correct;
        setFeedback(isCorrect ? 'correct' : 'wrong');
        if (isCorrect) setScore(s => s + 1);
    };

    const handleNext = () => {
        if (step + 1 >= activity.steps.length) {
            setDone(true);
        } else {
            setStep(s => s + 1);
            setSelected(null);
            setFeedback(null);
        }
    };

    if (done) {
        const total = activity.steps.length;
        const perfect = score === total;
        return (
            <div className="text-center py-4">
                <div className="display-4 mb-2">{perfect ? '🏆' : '💪'}</div>
                <h4 className="fw-bold">{score}/{total} respuestas correctas</h4>
                {perfect ? (
                    <>
                        <p className="text-success fw-semibold mb-3">¡Perfecto! Respondiste todo correctamente.</p>
                        {isEnrolled && (
                            <button className="btn btn-primary-custom px-4" onClick={onComplete}>
                                ✓ Completar lección (+10 pts)
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <p className="text-muted mb-3">
                            Necesitas responder <strong>todas</strong> las preguntas correctamente para completar la lección.
                        </p>
                        <button
                            className="btn btn-secondary-custom px-4"
                            onClick={() => { setStep(0); setScore(0); setSelected(null); setFeedback(null); setDone(false); }}
                        >
                            🔄 Intentar de nuevo
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        <div>
            {/* Progreso */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-secondary rounded-pill">
                    Paso {step + 1} / {activity.steps.length}
                </span>
                <span className="text-muted small">⭐ {score} correctas</span>
            </div>
            <div className="progress mb-4" style={{ height: 6, borderRadius: 99 }}>
                <div
                    className="progress-bar"
                    style={{
                        width: `${(step / activity.steps.length) * 100}%`,
                        background: 'linear-gradient(90deg,#FF6B6B,#4ECDC4)',
                        borderRadius: 99
                    }}
                />
            </div>

            {/* Explicación */}
            <div
                className="rounded-3 p-3 mb-4"
                style={{ background: '#f0f4ff', borderLeft: '4px solid #4ECDC4' }}
            >
                <h6 className="fw-bold mb-1">{current.title}</h6>
                <p className="mb-0 small">{current.explanation}</p>
            </div>

            {/* Pregunta */}
            <p className="fw-semibold mb-3">❓ {current.question}</p>
            <div className="d-flex flex-column gap-2 mb-3">
                {current.options.map((opt, i) => {
                    let cls = 'trivia-option p-3 text-start fw-semibold';
                    if (selected !== null) {
                        if (i === current.correct) cls += ' correct';
                        else if (i === selected && i !== current.correct) cls += ' wrong';
                    }
                    return (
                        <button
                            key={i}
                            className={cls}
                            onClick={() => handleAnswer(i)}
                            disabled={selected !== null}
                        >
                            {String.fromCharCode(65 + i)}. {opt}
                        </button>
                    );
                })}
            </div>

            {/* Feedback + siguiente */}
            {feedback && (
                <div className={`alert rounded-3 ${feedback === 'correct' ? 'alert-success' : 'alert-danger'} mb-3`}>
                    {feedback === 'correct' ? '✅ ¡Correcto!' : `❌ La respuesta correcta es: "${current.options[current.correct]}"`}
                </div>
            )}
            {selected !== null && (
                <button className="btn btn-secondary-custom w-100" onClick={handleNext}>
                    {step + 1 < activity.steps.length ? 'Siguiente paso →' : 'Ver resultado 🏆'}
                </button>
            )}
        </div>
    );
}

/* ── Challenge / Project (checklist) ──────────────────────── */
function ChallengeContent({ lesson, onComplete, isEnrolled }) {
    const content = CHALLENGE_CONTENT[lesson.title] || getGenericChallenge(lesson);
    const [checked, setChecked] = useState(() => new Array(content.tasks.length).fill(false));

    const toggle = (i) => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));
    const allDone = checked.every(Boolean);

    return (
        <div>
            <h5 className="fw-bold mb-1">{content.title}</h5>
            <p className="text-muted small mb-4">{content.description}</p>

            <div className="d-flex flex-column gap-2 mb-4">
                {content.tasks.map((task, i) => (
                    <div
                        key={i}
                        className="d-flex align-items-start gap-3 p-3 rounded-3 cursor-pointer"
                        style={{
                            background: checked[i] ? '#d4edda' : '#f8f9fa',
                            border: `2px solid ${checked[i] ? '#28a745' : '#dee2e6'}`,
                            cursor: 'pointer',
                            transition: 'all .2s'
                        }}
                        onClick={() => toggle(i)}
                    >
                        <div
                            className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle fw-bold"
                            style={{
                                width: 28, height: 28,
                                background: checked[i] ? '#28a745' : '#dee2e6',
                                color: checked[i] ? '#fff' : '#999',
                                fontSize: '.8rem'
                            }}
                        >
                            {checked[i] ? '✓' : i + 1}
                        </div>
                        <span
                            className={`small fw-semibold ${checked[i] ? 'text-success' : ''}`}
                            style={{ textDecoration: checked[i] ? 'line-through' : 'none' }}
                        >
                            {task}
                        </span>
                    </div>
                ))}
            </div>

            {allDone && isEnrolled && (
                <div className="text-center">
                    <div className="display-4 mb-2">🎉</div>
                    <p className="fw-bold text-success mb-3">¡Completaste todas las tareas!</p>
                    <button className="btn btn-primary-custom px-4" onClick={onComplete}>
                        ✓ Marcar lección como completada (+10 pts)
                    </button>
                </div>
            )}
            {!isEnrolled && allDone && (
                <div className="alert alert-info text-center rounded-3">
                    ¡Inscríbete en el curso para registrar tu progreso!
                </div>
            )}
        </div>
    );
}
