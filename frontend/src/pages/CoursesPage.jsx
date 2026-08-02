import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCourses, fetchStudentProgress } from '../services/api';
import { useUser } from '../context/UserContext';

const LEVEL_COLORS = {
    Principiante: { bg: '#d4edda', text: '#155724', icon: '🌱' },
    Intermedio:   { bg: '#fff3cd', text: '#856404', icon: '⚡' },
    Avanzado:     { bg: '#f8d7da', text: '#721c24', icon: '🔥' }
};

const TABS = [
    { id: 'todos',       label: '📚 Todos' },
    { id: 'mis-cursos',  label: '🎓 Mis cursos' },
    { id: 'en-progreso', label: '⏳ En progreso' },
    { id: 'completados', label: '✅ Completados' }
];

export default function CoursesPage() {
    const { studentId }                 = useUser();
    const [courses, setCourses]         = useState([]);
    const [progressMap, setProgressMap] = useState({});
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState('');
    const [levelFilter, setLevel]       = useState('');
    const [catFilter, setCategory]      = useState('');
    const [activeTab, setTab]           = useState('todos');

    useEffect(() => {
        Promise.all([fetchCourses(), fetchStudentProgress(studentId)])
            .then(([coursesData, progressData]) => {
                setCourses(Array.isArray(coursesData) ? coursesData : []);
                const map = {};
                (Array.isArray(progressData) ? progressData : []).forEach(p => {
                    map[p.cursoId] = { porcentaje: Number(p.porcentaje) || 0, completado: !!p.completado };
                });
                setProgressMap(map);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [studentId]);

    const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];
    const levels     = [...new Set(courses.map(c => c.level).filter(Boolean))];

    const counts = {
        'todos':       courses.length,
        'mis-cursos':  Object.keys(progressMap).length,
        'en-progreso': Object.values(progressMap).filter(v => !v.completado && v.porcentaje > 0).length,
        'completados': Object.values(progressMap).filter(v => v.completado).length
    };

    const filtered = courses.filter(c => {
        const q = search.toLowerCase();
        if (!(!q || c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))) return false;
        if (levelFilter && c.level !== levelFilter) return false;
        if (catFilter && c.category !== catFilter) return false;
        const prog = progressMap[c.id];
        if (activeTab === 'mis-cursos')  return !!prog;
        if (activeTab === 'en-progreso') return !!prog && !prog.completado;
        if (activeTab === 'completados') return !!prog && prog.completado;
        return true;
    });

    return (
        <>
            <div className="hero-banner">
                <div className="container text-center">
                    <h1 className="display-5 fw-black mb-2">🎓 Aprende a Programar</h1>
                    <p className="lead mb-0 opacity-90">
                        Explora cursos de programación divertidos diseñados para niños
                    </p>
                </div>
            </div>

            <div className="container pb-5">

                {/* Tabs de sección */}
                <div className="d-flex gap-2 flex-wrap mb-4">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            className={`btn rounded-pill fw-semibold px-4 ${activeTab === t.id ? 'btn-primary-custom' : 'btn-outline-secondary'}`}
                            onClick={() => setTab(t.id)}
                        >
                            {t.label}
                            <span className={`ms-2 badge rounded-pill ${activeTab === t.id ? 'bg-white text-danger' : 'bg-secondary'}`}>
                                {counts[t.id]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Filtros */}
                <div className="filter-bar d-flex flex-wrap gap-3 align-items-center">
                    <div className="flex-grow-1" style={{ minWidth: 200 }}>
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="🔍 Buscar cursos..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="form-select rounded-pill" style={{ maxWidth: 180 }}
                        value={levelFilter} onChange={e => setLevel(e.target.value)}>
                        <option value="">Todos los niveles</option>
                        {levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select className="form-select rounded-pill" style={{ maxWidth: 180 }}
                        value={catFilter} onChange={e => setCategory(e.target.value)}>
                        <option value="">Todas las categorías</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {(search || levelFilter || catFilter) && (
                        <button className="btn btn-outline-secondary rounded-pill"
                            onClick={() => { setSearch(''); setLevel(''); setCategory(''); }}>
                            ✕ Limpiar
                        </button>
                    )}
                </div>

                {!loading && <p className="text-muted mb-3">{filtered.length} curso{filtered.length !== 1 ? 's' : ''}</p>}

                {loading ? (
                    <div className="spinner-overlay">
                        <div className="spinner-border text-danger" role="status" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">
                            {activeTab === 'mis-cursos' ? '📋' : activeTab === 'completados' ? '🏆' : '🔭'}
                        </div>
                        <p className="fs-5 fw-semibold">
                            {activeTab === 'mis-cursos'  ? 'Aún no estás inscrito en ningún curso' :
                             activeTab === 'en-progreso' ? 'No tienes cursos en progreso' :
                             activeTab === 'completados' ? 'Todavía no has completado ningún curso' :
                             'No se encontraron cursos'}
                        </p>
                        {activeTab !== 'todos' && (
                            <button className="btn btn-primary-custom mt-2" onClick={() => setTab('todos')}>
                                Ver todos los cursos
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="row g-4">
                        {filtered.map(course => (
                            <CourseCard key={course.id} course={course} progress={progressMap[course.id]} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function CourseCard({ course, progress }) {
    const lvl       = LEVEL_COLORS[course.level] || { bg: '#e9ecef', text: '#495057', icon: '📘' };
    const enrolled  = !!progress;
    const completed = enrolled && progress.completado;
    const pct       = enrolled ? Math.round(progress.porcentaje) : 0;

    return (
        <div className="col-12 col-sm-6 col-lg-4">
            <div className="course-card h-100 d-flex flex-column position-relative">
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title}
                        className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
                ) : (
                    <div className="d-flex align-items-center justify-content-center"
                        style={{ height: 180, background: '#f0f4ff', fontSize: '3rem' }}>📚</div>
                )}

                {/* Badge de estado sobre imagen */}
                {completed && (
                    <span className="position-absolute top-0 end-0 m-2 badge fw-bold px-3 py-2"
                        style={{ background: '#28a745', color: '#fff', borderRadius: 99 }}>
                        ✅ Completado
                    </span>
                )}
                {enrolled && !completed && (
                    <span className="position-absolute top-0 end-0 m-2 badge fw-bold px-3 py-2"
                        style={{ background: '#FF6B6B', color: '#fff', borderRadius: 99 }}>
                        📖 Inscrito
                    </span>
                )}

                <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge rounded-pill fw-semibold small px-3 py-2"
                            style={{ background: lvl.bg, color: lvl.text }}>
                            {lvl.icon} {course.level}
                        </span>
                        <span className="text-warning fw-bold">⭐ {course.points} pts</span>
                    </div>

                    <h5 className="fw-bold mb-1">{course.title}</h5>
                    <p className="text-muted small mb-3 flex-grow-1">{course.description}</p>

                    {/* Barra de progreso */}
                    {enrolled && (
                        <div className="mb-3">
                            <div className="d-flex justify-content-between small mb-1">
                                <span className="text-muted">Progreso</span>
                                <span className="fw-bold" style={{ color: completed ? '#28a745' : '#FF6B6B' }}>
                                    {pct}%
                                </span>
                            </div>
                            <div className="progress" style={{ height: 8, borderRadius: 99 }}>
                                <div className="progress-bar" style={{
                                    width: `${pct}%`, borderRadius: 99,
                                    background: completed ? '#28a745' : 'linear-gradient(90deg,#FF6B6B,#FFD93D)'
                                }} />
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-between text-muted small mb-3">
                        <span>👶 {course.ageRange}</span>
                        <span>⏱ {course.duration}</span>
                    </div>

                    <Link to={`/courses/${course.id}`} className="btn btn-primary-custom w-100">
                        {completed ? 'Ver detalles 🏆' : enrolled ? 'Continuar →' : 'Ver curso →'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
