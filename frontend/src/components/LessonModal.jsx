import { useState } from 'react';
import Icon from './Icon';

/* Sample interactive activities mapped by lesson title */
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
  const videoItems = (course.mediaItems || []).filter(m => m.type === 'video');
  const videoLessons = (course.lessons || []).filter(l => l.type === 'video');
  const videoIndex = videoLessons.findIndex(l => l.id === lesson.id);
  const matchedVideo = videoItems[videoIndex] || videoItems[0] || null;

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
                  <VideoContent video={matchedVideo} lesson={lesson} onComplete={onComplete} isEnrolled={isEnrolled} />
                )}
                {lesson.type === 'interactive' && (
                  <InteractiveContent lesson={lesson} onComplete={onComplete} isEnrolled={isEnrolled} />
                )}
                {(lesson.type === 'challenge' || lesson.type === 'project') && (
                  <ChallengeContent lesson={lesson} onComplete={onComplete} isEnrolled={isEnrolled} />
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

function VideoContent({ video, lesson, onComplete, isEnrolled }) {
  return (
    <div>
      {video ? (
        <div className="ratio ratio-16x9 mb-3">
          <iframe src={video.Url} title={video.Titulo} allowFullScreen />
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
