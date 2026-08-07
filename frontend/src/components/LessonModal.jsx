import { useState } from 'react';
import Editor from '@monaco-editor/react';
import Icon from './Icon';
import { executeCode, aiAssist } from '../services/api';

// Course category → Monaco language + Piston language id
const COURSE_LANGUAGE = {
    'Bloques':      'javascript',
    'Código':       'python',
    'Web':          'html',
    'Juegos':       'javascript',
    'Robótica':     'python',
    'Pensamiento':  'python',
};

const DEFAULT_CODE = {
    python:      '# Escribe tu código aquí\nprint("¡Hola, mundo!")\n',
    javascript:  '// Escribe tu código aquí\nconsole.log("¡Hola, mundo!");\n',
    html:        '<!DOCTYPE html>\n<html>\n<head><title>Mi página</title></head>\n<body>\n  <h1>¡Hola, mundo!</h1>\n</body>\n</html>\n',
};

// Curated YouTube embed URLs keyed by lesson title (all IDs verified via oEmbed)
const LESSON_VIDEOS = {
  // Scratch (Curso 1)
  'Conoce la interfaz':       'https://www.youtube.com/embed/jXUZaf5D12A', // "What is Scratch?" – Scratch Team
  'Movimiento básico':        'https://www.youtube.com/embed/jXUZaf5D12A', // reuse Scratch Team official intro
  // Python (Curso 2)
  '¿Qué es Python?':          'https://www.youtube.com/embed/rfscVS0vtbw', // "Learn Python" – freeCodeCamp
  'Condicionales':             'https://www.youtube.com/embed/f4KOjWS_KZs', // "If, Then, Else in Python" – Socratica
  // HTML & CSS (Curso 3)
  'Estructura HTML':           'https://www.youtube.com/embed/UB1O30fR-EE', // "HTML Crash Course" – Traversy Media
  'Colores y fuentes':         'https://www.youtube.com/embed/1PnVor36_40', // "Learn CSS in 20 Minutes" – Web Dev Simplified
  // Minecraft / bloques (Curso 4)
  'Comandos básicos':          'https://www.youtube.com/embed/zOjov-2OZ0E', // "Intro to Programming & CS" – freeCodeCamp
  // Robótica (Curso 5)
  'Componentes electrónicos':  'https://www.youtube.com/embed/O5nskjZ_GoI', // "Early Computing" – CrashCourse CS #1
  // Lógica y algoritmos (Curso 6)
  '¿Qué es un algoritmo?':     'https://www.youtube.com/embed/6hfOvs8pY1k', // "What's an algorithm?" – TED-Ed
};

const ACTIVITIES = {
  'Tu primer sprite': {
    steps: [
      {
        title: '¿Qué es un Sprite?',
        explanation: 'Un sprite es un personaje u objeto programable en Scratch.',
        question: '¿Qué es un sprite en Scratch?',
        options: ['Un tipo de error', 'Un personaje u objeto', 'El fondo', 'Un bloque'],
        correct: 1
      },
      {
        title: 'Elige tu Sprite',
        explanation: 'Selecciona un sprite de la biblioteca para comenzar.',
        question: '¿Dónde está el selector de sprites?',
        options: ['Archivo → Nuevo', 'Barra superior', 'Esquina inferior derecha', 'Pestaña Sonidos'],
        correct: 2
      }
    ]
  }
};

const CHALLENGE_CONTENT = {
  'Reto: Crea tu animación': {
    title: '¡Crea tu primera animación en Scratch!',
    description: 'Sigue estos pasos y márcalos cuando los completes.',
    tasks: [
      'Abre Scratch y crea un proyecto nuevo',
      'Elige un sprite',
      'Agrega un bloque de movimiento',
      'Haz clic en la bandera verde'
    ]
  }
};

function getGenericActivity(lesson) {
  return ACTIVITIES[lesson.title] || {
    steps: [
      {
        title: `Introducción: ${lesson.title}`,
        explanation: 'Lee la explicación y responde la pregunta.',
        question: `¿Cuál es el objetivo de ${lesson.title}?`,
        options: ['Memorizar', 'Comprender y aplicar', 'Solo ver', 'Copiar'],
        correct: 1
      }
    ]
  };
}

function getGenericChallenge(lesson) {
  return CHALLENGE_CONTENT[lesson.title] || {
    title: `Reto: ${lesson.title}`,
    description: `Completa las tareas del reto ${lesson.title}`,
    tasks: ['Lee el reto', 'Planifica', 'Implementa', 'Prueba']
  };
}

export default function LessonModal({ lesson, course = {}, onClose, onComplete, onEnroll, isEnrolled }) {
  const videoUrl = LESSON_VIDEOS[lesson.title] || null;
  const language = COURSE_LANGUAGE[course.category] || 'python';

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,.7)', zIndex: 1055 }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header border-0 text-white rounded-top-4" style={{ background: 'linear-gradient(135deg,#FF6B6B,#4ECDC4)' }}>
            <div>
              <h5 className="modal-title fw-bold mb-0">{lesson.title}</h5>
              <small className="opacity-75">{typeLabel(lesson.type)} · ⏱ {lesson.duration}</small>
            </div>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          <div className="modal-body p-0">
            {!isEnrolled ? (
              <LockedPreview course={course} lesson={lesson} onEnroll={onEnroll} onClose={onClose} />
            ) : (
              <div className="p-4">
                {lesson.type === 'video' && (
                  <VideoContent videoUrl={videoUrl} lesson={lesson} onComplete={onComplete} isEnrolled={isEnrolled} />
                )}
                {lesson.type === 'interactive' && (
                  <InteractiveContent lesson={lesson} onComplete={onComplete} isEnrolled={isEnrolled} />
                )}
                {(lesson.type === 'challenge') && (
                  <ChallengeContent lesson={lesson} onComplete={onComplete} isEnrolled={isEnrolled} />
                )}
                {(lesson.type === 'project') && (
                  <CodeProjectContent lesson={lesson} course={course} language={language} onComplete={onComplete} isEnrolled={isEnrolled} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LockedPreview({ course, lesson, onEnroll, onClose }) {
  const [enrolling, setEnrolling] = useState(false);
  const handle = async () => {
    setEnrolling(true);
    await onEnroll();
    setEnrolling(false);
    onClose();
  };
  return (
    <div>
      <div className="position-relative" style={{ height: 220, overflow: 'hidden' }}>
        {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-100 h-100" style={{ objectFit: 'cover', filter: 'blur(3px) brightness(.5)' }} />}
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white">
          <div style={{ fontSize: '3.5rem' }}><i className="bi bi-lock-fill" style={{fontSize:'3.5rem'}} /></div>
          <p className="fw-bold fs-5 mb-0">Lección bloqueada</p>
        </div>
      </div>
      <div className="p-4 text-center">
        <span className="badge rounded-pill px-3 py-2 mb-3 d-inline-block" style={{ background: '#fff3cd', color: '#856404' }}>{typeLabel(lesson.type)} · ⏱ {lesson.duration}</span>
        <h5 className="fw-bold mb-1">{lesson.title}</h5>
        <p className="text-muted mb-4">Inscríbete en <strong>{course.title}</strong> para acceder a esta lección y ganar <strong>{course.points} puntos</strong>.</p>
        <button className="btn btn-primary-custom px-5 py-2 fw-bold" onClick={handle} disabled={enrolling}>{enrolling ? 'Inscribiendo...' : '¡Inscribirme!'}</button>
      </div>
    </div>
  );
}

function VideoContent({ videoUrl, lesson, onComplete, isEnrolled }) {
  return (
    <div>
      {videoUrl ? (
        <div className="ratio ratio-16x9 mb-3">
          <iframe
            src={videoUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="empty-state mb-3"><div className="icon"><i className="bi bi-camera-reels" /></div><p>No hay video disponible</p></div>
      )}
      {isEnrolled && (
        <div className="text-center">
          <button className="btn btn-primary-custom" onClick={onComplete}><i className="bi bi-check-lg me-1" /> Marcar lección como completada (+10 pts)</button>
        </div>
      )}
    </div>
  );
}

function InteractiveContent({ lesson, onComplete, isEnrolled }) {
  const activity = getGenericActivity(lesson);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = activity.steps[step];

  const handleAnswer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const ok = i === current.correct;
    setFeedback(ok ? 'correct' : 'wrong');
    if (ok) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (step + 1 >= activity.steps.length) setDone(true);
    else { setStep(s => s + 1); setSelected(null); setFeedback(null); }
  };

  if (done) {
    const total = activity.steps.length;
    const perfect = score === total;
    return (
      <div className="text-center py-4">
        <div className="display-4 mb-2">{perfect ? <i className="bi bi-trophy-fill" /> : <i className="bi bi-hand-thumbs-up" />}</div>
        <h4 className="fw-bold">{score}/{total} respuestas correctas</h4>
        {perfect ? (
          isEnrolled && <button className="btn btn-primary-custom mt-3" onClick={onComplete}><i className="bi bi-check-lg me-1" /> Completar lección (+10 pts)</button>
        ) : (
          <button className="btn btn-secondary-custom mt-3" onClick={() => { setStep(0); setScore(0); setSelected(null); setFeedback(null); setDone(false); }}><i className="bi bi-arrow-repeat me-2" /> Intentar de nuevo</button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="badge bg-secondary rounded-pill">Paso {step + 1} / {activity.steps.length}</span>
        <span className="text-muted small"><i className="bi bi-star-fill me-1" /> {score} correctas</span>
      </div>
      <div className="rounded-3 p-3 mb-3" style={{ background: '#f0f4ff', borderLeft: '4px solid #4ECDC4' }}>
        <h6 className="fw-bold mb-1">{current.title}</h6>
        <p className="mb-0 small">{current.explanation}</p>
      </div>
      <p className="fw-semibold mb-3"><i className="bi bi-question-circle-fill me-1" /> {current.question}</p>
      <div className="d-flex flex-column gap-2 mb-3">
        {current.options.map((opt, i) => {
          let cls = 'trivia-option p-3 text-start fw-semibold';
          if (selected !== null) {
            if (i === current.correct) cls += ' correct';
            else if (i === selected && i !== current.correct) cls += ' wrong';
          }
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={selected !== null}>
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>
      {feedback && (
        <div className={`alert rounded-3 ${feedback === 'correct' ? 'alert-success' : 'alert-danger'} mb-3`}>
          {feedback === 'correct' ? <><i className="bi bi-check-lg me-2" /> ¡Correcto!</> : <><i className="bi bi-x-lg me-2" /> La respuesta correcta es: "{current.options[current.correct]}"</>}
        </div>
      )}
      {selected !== null && (
        <button className="btn btn-secondary-custom w-100" onClick={handleNext}>{step + 1 < activity.steps.length ? 'Siguiente paso →' : <>Ver resultado <i className="bi bi-trophy-fill ms-2" /></>}</button>
      )}
    </div>
  );
}

function ChallengeContent({ lesson, onComplete, isEnrolled }) {
  const content = getGenericChallenge(lesson);
  const [checked, setChecked] = useState(() => new Array(content.tasks.length).fill(false));
  const toggle = (i) => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));
  const allDone = checked.every(Boolean);

  return (
    <div>
      <h5 className="fw-bold mb-1">{content.title}</h5>
      <p className="text-muted small mb-4">{content.description}</p>
      <div className="d-flex flex-column gap-2 mb-4">
        {content.tasks.map((task, i) => (
          <div key={i} className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: checked[i] ? '#d4edda' : '#f8f9fa', border: `2px solid ${checked[i] ? '#28a745' : '#dee2e6'}` }} onClick={() => toggle(i)}>
            <div className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle fw-bold" style={{ width:28, height:28, background: checked[i] ? '#28a745' : '#dee2e6', color: checked[i] ? '#fff' : '#999', fontSize:'.8rem' }}>{checked[i] ? <i className="bi bi-check-lg" /> : i + 1}</div>
            <span className={`small fw-semibold ${checked[i] ? 'text-success' : ''}`} style={{ textDecoration: checked[i] ? 'line-through' : 'none' }}>{task}</span>
          </div>
        ))}
      </div>
      {allDone && isEnrolled && (
        <div className="text-center">
          <div className="display-4 mb-2"><i className="bi bi-balloon" style={{fontSize:'2.5rem'}} /></div>
          <p className="fw-bold text-success mb-3">¡Completaste todas las tareas!</p>
          <button className="btn btn-primary-custom px-4" onClick={onComplete}><i className="bi bi-check-lg me-1" /> Marcar lección como completada (+10 pts)</button>
        </div>
      )}
      {!isEnrolled && allDone && (
        <div className="alert alert-info text-center rounded-3">Inscríbete en el curso para registrar tu progreso!</div>
      )}
    </div>
  );
}

function typeLabel(type) {
  if (type === 'video') return 'Video';
  if (type === 'interactive') return 'Interactivo';
  if (type === 'challenge') return 'Reto';
  if (type === 'project') return 'Proyecto';
  return 'Lección';
}

function CodeProjectContent({ lesson, course, language, onComplete, isEnrolled }) {
  const [code, setCode]           = useState(DEFAULT_CODE[language] || DEFAULT_CODE.python);
  const [output, setOutput]       = useState(null);
  const [aiText, setAiText]       = useState(null);
  const [running, setRunning]     = useState(false);
  const [asking, setAsking]       = useState(false);
  const [htmlPreview, setPreview] = useState(null);

  const handleRun = async () => {
    setRunning(true); setOutput(null); setPreview(null);
    try {
      // JavaScript runs entirely in the browser by capturing console.log
      if (language === 'javascript') {
        const logs = [];
        const sandbox = { console: { log: (...a) => logs.push(a.map(String).join(' ')), error: (...a) => logs.push('Error: ' + a.join(' ')), warn: (...a) => logs.push('Warn: ' + a.join(' ')) } };
        try {
          // eslint-disable-next-line no-new-func
          new Function(...Object.keys(sandbox), code)(...Object.values(sandbox));
          setOutput(logs.join('\n') || '(sin salida)');
        } catch (e) { setOutput('Error: ' + e.message); }
        setRunning(false);
        return;
      }
      const res = await executeCode(code, language);
      if (res.html) setPreview(res.html);
      else setOutput(res.output || res.error || '(sin salida)');
    } catch { setOutput('Error al conectar con el servidor.'); }
    finally { setRunning(false); }
  };

  const handleAsk = async () => {
    setAsking(true); setAiText(null);
    try {
      const res = await aiAssist(code, language, lesson.title, course?.description);
      setAiText(res.suggestion || res.error);
    } catch { setAiText('No se pudo conectar con el asistente.'); }
    finally { setAsking(false); }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div>
          <span className="badge rounded-pill px-3 py-1 me-2" style={{ background: '#e0d4f7', color: '#6c3fc5' }}>{language}</span>
          <span className="text-muted small">{lesson.title}</span>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-success rounded-pill px-3" onClick={handleRun} disabled={running}>
            {running ? <><span className="spinner-border spinner-border-sm me-1" />Ejecutando…</> : <><i className="bi bi-play-fill me-1" />Ejecutar</>}
          </button>
          <button className="btn btn-sm rounded-pill px-3" style={{ background: 'linear-gradient(135deg,#9B59B6,#4ECDC4)', color: '#fff', border: 'none' }} onClick={handleAsk} disabled={asking}>
            {asking ? <><span className="spinner-border spinner-border-sm me-1" />Preguntando…</> : <><i className="bi bi-stars me-1" />Pedir ayuda a la IA</>}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="rounded-3 overflow-hidden mb-3" style={{ border: '2px solid #dee2e6' }}>
        <Editor
          height="280px"
          language={language === 'html' ? 'html' : language}
          value={code}
          onChange={v => setCode(v || '')}
          theme="vs-dark"
          options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on' }}
        />
      </div>

      {/* Output panel */}
      {output !== null && (
        <div className="rounded-3 p-3 mb-3" style={{ background: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', fontSize: '.85rem', whiteSpace: 'pre-wrap', maxHeight: 180, overflowY: 'auto' }}>
          <span className="text-success fw-bold me-2">▶ Salida:</span>{output}
        </div>
      )}

      {/* HTML preview */}
      {htmlPreview && (
        <div className="rounded-3 overflow-hidden mb-3" style={{ border: '2px solid #dee2e6', height: 200 }}>
          <iframe srcDoc={htmlPreview} title="preview" style={{ width: '100%', height: '100%', border: 0 }} sandbox="allow-scripts" />
        </div>
      )}

      {/* AI suggestion */}
      {aiText && (
        <div className="rounded-3 p-3 mb-3" style={{ background: 'linear-gradient(135deg,#f3e8ff,#e8f9f9)', border: '2px solid #d0b3f5' }}>
          <div className="fw-bold mb-1" style={{ color: '#6c3fc5' }}><i className="bi bi-stars me-1" />Asistente IA</div>
          <div className="small" style={{ whiteSpace: 'pre-wrap' }}>{aiText}</div>
        </div>
      )}

      {isEnrolled && (
        <div className="text-center mt-2">
          <button className="btn btn-primary-custom px-4" onClick={onComplete}>
            <i className="bi bi-check-lg me-1" />Marcar proyecto como completado (+10 pts)
          </button>
        </div>
      )}
    </div>
  );
}
