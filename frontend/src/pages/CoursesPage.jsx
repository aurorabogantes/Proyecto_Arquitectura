import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCourses } from '../services/api';

const LEVEL_COLORS = {
    Principiante: { bg: '#d4edda', text: '#155724', icon: '🌱' },
    Intermedio:   { bg: '#fff3cd', text: '#856404', icon: '⚡' },
    Avanzado:     { bg: '#f8d7da', text: '#721c24', icon: '🔥' }
};

export default function CoursesPage() {
    const [courses, setCourses]     = useState([]);
    const [loading, setLoading]     = useState(true);
    const [search, setSearch]       = useState('');
    const [levelFilter, setLevel]   = useState('');
    const [catFilter, setCategory]  = useState('');

    useEffect(() => {
        fetchCourses()
            .then(data => setCourses(Array.isArray(data) ? data : []))
            .catch(() => setCourses([]))
            .finally(() => setLoading(false));
    }, []);

    const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];
    const levels     = [...new Set(courses.map(c => c.level).filter(Boolean))];

    const filtered = courses.filter(c => {
        const q = search.toLowerCase();
        const matchSearch = !q || c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
        const matchLevel  = !levelFilter || c.level === levelFilter;
        const matchCat    = !catFilter   || c.category === catFilter;
        return matchSearch && matchLevel && matchCat;
    });

    return (
        <>
            {/* Hero */}
            <div className="hero-banner">
                <div className="container text-center">
                    <h1 className="display-5 fw-black mb-2">🎓 Aprende a Programar</h1>
                    <p className="lead mb-0 opacity-90">
                        Explora cursos de programación divertidos diseñados para niños
                    </p>
                </div>
            </div>

            <div className="container pb-5">
                {/* Filters */}
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
                    <select
                        className="form-select rounded-pill"
                        style={{ maxWidth: 180 }}
                        value={levelFilter}
                        onChange={e => setLevel(e.target.value)}
                    >
                        <option value="">Todos los niveles</option>
                        {levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select
                        className="form-select rounded-pill"
                        style={{ maxWidth: 180 }}
                        value={catFilter}
                        onChange={e => setCategory(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {(search || levelFilter || catFilter) && (
                        <button
                            className="btn btn-outline-secondary rounded-pill"
                            onClick={() => { setSearch(''); setLevel(''); setCategory(''); }}
                        >
                            ✕ Limpiar
                        </button>
                    )}
                </div>

                {/* Results count */}
                {!loading && (
                    <p className="text-muted mb-3">
                        {filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                    </p>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="spinner-overlay">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🔭</div>
                        <p className="fs-5 fw-semibold">No se encontraron cursos</p>
                        <p className="text-muted">Intenta con otros filtros</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filtered.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function CourseCard({ course }) {
    const lvl = LEVEL_COLORS[course.level] || { bg: '#e9ecef', text: '#495057', icon: '📘' };

    return (
        <div className="col-12 col-sm-6 col-lg-4">
            <div className="course-card h-100 d-flex flex-column">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="card-img-top"
                        style={{ height: 180, objectFit: 'cover' }}
                    />
                ) : (
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ height: 180, background: '#f0f4ff', fontSize: '3rem' }}
                    >
                        📚
                    </div>
                )}
                <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <span
                            className="badge rounded-pill fw-semibold small px-3 py-2"
                            style={{ background: lvl.bg, color: lvl.text }}
                        >
                            {lvl.icon} {course.level}
                        </span>
                        <span className="text-warning fw-bold">⭐ {course.points} pts</span>
                    </div>
                    <h5 className="fw-bold mb-1">{course.title}</h5>
                    <p className="text-muted small mb-3 flex-grow-1">{course.description}</p>
                    <div className="d-flex justify-content-between text-muted small mb-3">
                        <span>👶 {course.ageRange}</span>
                        <span>⏱ {course.duration}</span>
                        {course.category && <span>🏷 {course.category}</span>}
                    </div>
                    <Link
                        to={`/courses/${course.id}`}
                        className="btn btn-primary-custom w-100"
                    >
                        Ver Curso →
                    </Link>
                </div>
            </div>
        </div>
    );
}
