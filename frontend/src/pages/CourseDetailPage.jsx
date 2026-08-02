import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourse, enrollCourse, completeLesson, addPoints } from '../services/api';
import { useUser } from '../context/UserContext';
import LessonModal from '../components/LessonModal';
import { useNotification } from '../context/NotificationContext';

const LESSON_ICONS = {
    video:       '🎬',
    interactive: '🖱️',
    challenge:   '⚔️',
    project:     '🛠️'
};

const LEVEL_COLORS = {
    Principiante: { bg: '#d4edda', text: '#155724' },
    Intermedio:   { bg: '#fff3cd', text: '#856404' },
    Avanzado:     { bg: '#f8d7da', text: '#721c24' }
};

export default function CourseDetailPage() {
    const { id } = useParams();
    const { studentId } = useUser();

    const [course, setCourse]           = useState(null);
    const [loading, setLoading]         = useState(true);
    const [enrolling, setEnrolling]     = useState(false);
    const [enrolled, setEnrolled]       = useState(false);
    const [activeMedia, setMedia]       = useState(null);
    const [activeLesson, setLesson]     = useState(null);
    const [completedIds, setCompleted]  = useState(new Set());
    const { addNotification }           = useNotification();

    useEffect(() => {
        fetchCourse(id)
            .then(data => {
                setCourse(data);
                if (data?.mediaItems?.length > 0) setMedia(data.mediaItems[0]);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            const res = await enrollCourse(id, studentId);
            if (res.success) {
                setEnrolled(true);
                if (res.alreadyEnrolled) {
                    addNotification({ type: 'info', message: '¡Ya estabas inscrito en este curso!' });
                } else {
                    addNotification({ type: 'success', message: `¡Inscripción exitosa! 🎓 Ahora puedes acceder a las lecciones de "${course?.title}"` });
                }
            }
        } catch {
            addNotification({ type: 'warning', message: 'Error al inscribirse. Intenta de nuevo.' });
        } finally {
            setEnrolling(false);
        }
    };

    const handleCompleteLesson = async (lessonId) => {
        try {
            await completeLesson(studentId, lessonId, 100);
            setCompleted(prev => new Set([...prev, lessonId]));
            const res = await addPoints(studentId, 0); // solo para verificar insignias tras la lección
            addNotification({ type: 'points', message: '¡Lección completada! +10 pts ⭐' });
            (res?.nuevasInsignias || []).forEach(ins => addNotification({
                type: 'badge',
                message: `¡Insignia desbloqueada! ${ins.icono} ${ins.nombre}`
            }));
            setLesson(null);
        } catch {
            // silent
        }
    };

    // Abre el modal de la lección; si es video e inscrito, también marca el sidebar
    const handleOpenLesson = (lesson) => setLesson(lesson);

    if (loading) {
        return (
            <div className="spinner-overlay">
                <div className="spinner-border text-danger" role="status" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container py-5 text-center">
                <p className="fs-4">Curso no encontrado 😕</p>
                <Link to="/courses" className="btn btn-primary-custom mt-3">← Volver a cursos</Link>
            </div>
        );
    }

    const lvl = LEVEL_COLORS[course.level] || { bg: '#e9ecef', text: '#495057' };

    return (
        <>
        <div className="container py-5">
            {/* Back */}
            <Link to="/courses" className="btn btn-outline-secondary rounded-pill mb-4">
                ← Volver a cursos
            </Link>

            <div className="row g-4">
                {/* Left: course info */}
                <div className="col-lg-8">
                    {/* Header card */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                        {course.thumbnail && (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-100"
                                style={{ height: 260, objectFit: 'cover' }}
                            />
                        )}
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <span
                                    className="badge rounded-pill px-3 py-2 fw-semibold"
                                    style={{ background: lvl.bg, color: lvl.text }}
                                >
                                    {course.level}
                                </span>
                                {course.category && (
                                    <span className="badge bg-light text-dark rounded-pill px-3 py-2">
                                        🏷 {course.category}
                                    </span>
                                )}
                            </div>
                            <h2 className="fw-black mb-2">{course.title}</h2>
                            <p className="text-muted mb-3">{course.description}</p>
                            <div className="d-flex flex-wrap gap-3 text-muted small">
                                <span>👶 {course.ageRange}</span>
                                <span>⏱ {course.duration}</span>
                                <span className="text-warning fw-bold">⭐ {course.points} puntos</span>
                                <span>📖 {course.lessons?.length || 0} lecciones</span>
                            </div>
                        </div>
                    </div>

                    {/* Lessons */}
                    {course.lessons?.length > 0 && (
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h4 className="section-title">Contenido del curso</h4>
                                <div className="d-flex flex-column gap-2">
                                    {course.lessons.map((lesson, i) => {
                                        const isDone = completedIds.has(lesson.id);
                                        return (
                                            <div
                                                key={lesson.id}
                                                className="lesson-item d-flex align-items-center gap-3 p-3"
                                                style={{ cursor: 'pointer', opacity: isDone ? .7 : 1 }}
                                                onClick={() => handleOpenLesson(lesson)}
                                            >
                                                <span className="lesson-type-icon">
                                                    {isDone ? '✅' : (LESSON_ICONS[lesson.type] || '📄')}
                                                </span>
                                                <div className="flex-grow-1">
                                                    <div className={`fw-semibold ${isDone ? 'text-success text-decoration-line-through' : ''}`}>
                                                        {i + 1}. {lesson.title}
                                                    </div>
                                                    <div className="text-muted small">
                                                        ⏱ {lesson.duration}
                                                        {' · '}
                                                        <span className="text-capitalize">{lesson.type}</span>
                                                    </div>
                                                </div>
                                                <span className={`badge rounded-pill small ${
                                                    isDone ? 'bg-success' :
                                                    enrolled ? 'bg-light text-dark border' :
                                                    'bg-secondary text-white'
                                                }`}>
                                                    {isDone ? '✓ Hecho' : enrolled ? 'Abrir →' : '🔒'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: enroll + media */}
                <div className="col-lg-4">
                    {/* Enroll card */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4 p-4 text-center">
                        <div className="display-4 mb-2">🎯</div>
                        <h5 className="fw-bold mb-1">¿Listo para aprender?</h5>
                        <p className="text-muted small mb-3">
                            Inscríbete y gana <strong>{course.points} puntos</strong> al completarlo
                        </p>
                        <button
                            className={`btn w-100 ${enrolled ? 'btn-success' : 'btn-primary-custom'}`}
                            onClick={handleEnroll}
                            disabled={enrolling}
                        >
                            {enrolling
                                ? 'Inscribiendo...'
                                : enrolled
                                    ? '✓ Inscrito'
                                    : '¡Inscribirme ahora!'}
                        </button>
                    </div>

                    {/* Media player */}
                    {course.mediaItems?.length > 0 && (
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="section-title">Material multimedia</h5>

                            {/* Tabs */}
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {course.mediaItems.map(m => (
                                    <button
                                        key={m.id}
                                        className={`btn btn-sm rounded-pill ${activeMedia?.id === m.id ? 'btn-secondary-custom' : 'btn-outline-secondary'}`}
                                        onClick={() => setMedia(m)}
                                    >
                                        {m.type === 'video' ? '🎬' : '🖼️'} {m.title}
                                    </button>
                                ))}
                            </div>

                            {activeMedia && (
                                <div>
                                    {activeMedia.type === 'video' ? (
                                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                            <iframe
                                                src={activeMedia.url}
                                                title={activeMedia.title}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <img
                                            src={activeMedia.url}
                                            alt={activeMedia.title}
                                            className="img-fluid rounded-3"
                                        />
                                    )}
                                    <p className="text-muted small mt-2 mb-0">{activeMedia.title}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Lesson modal */}
        {activeLesson && (
            <LessonModal
                lesson={activeLesson}
                course={course}
                onClose={() => setLesson(null)}
                onComplete={() => handleCompleteLesson(activeLesson.id)}
                onEnroll={handleEnroll}
                isEnrolled={enrolled}
            />
        )}
        </>
    );
}
