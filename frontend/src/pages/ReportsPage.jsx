import { useState, useEffect } from 'react';
import {
    fetchStudents,
    fetchCourses,
    fetchStudentReport,
    fetchCourseReport,
    downloadStudentReportPdf,
    downloadCourseReportPdf
} from '../services/api';
import Icon from '../components/Icon';

export default function ReportsPage() {
    const [tab, setTab]                 = useState('estudiante');
    const [estudiantes, setEstudiantes] = useState([]);
    const [cursos, setCursos]           = useState([]);
    const [estudianteId, setEstudianteId] = useState('');
    const [cursoId, setCursoId]         = useState('');
    const [reporte, setReporte]         = useState(null);
    const [cargando, setCargando]       = useState(false);
    const [descargando, setDescargando] = useState(false);
    const [error, setError]             = useState('');

    useEffect(() => {
        fetchStudents().then(d => setEstudiantes(d.estudiantes || [])).catch(() => {});
        fetchCourses().then(d => setCursos(Array.isArray(d) ? d : [])).catch(() => {});
    }, []);

    const cambiarTab = (nuevaTab) => {
        setTab(nuevaTab);
        setReporte(null);
        setError('');
    };

    const verReporteEstudiante = async () => {
        if (!estudianteId) return;
        setCargando(true); setError(''); setReporte(null);
        try {
            const data = await fetchStudentReport(estudianteId);
            if (data.error) throw new Error(data.error);
            setReporte(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const verReporteCurso = async () => {
        if (!cursoId) return;
        setCargando(true); setError(''); setReporte(null);
        try {
            const data = await fetchCourseReport(cursoId);
            if (data.error) throw new Error(data.error);
            setReporte(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const descargarPdf = async () => {
        setDescargando(true); setError('');
        try {
            await downloadStudentReportPdf(estudianteId);
        } catch (err) {
            setError(err.message);
        } finally {
            setDescargando(false);
        }
    };

    const descargarPdfCurso = async () => {
        setDescargando(true); setError('');
        try {
            await downloadCourseReportPdf(cursoId);
        } catch (err) {
            setError(err.message);
        } finally {
            setDescargando(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4"><Icon name="trophy" /> Reportes de desempeño</h2>

            <ul className="nav nav-pills mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${tab === 'estudiante' ? 'active' : ''}`}
                        onClick={() => cambiarTab('estudiante')}
                    >
                        Por estudiante
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${tab === 'curso' ? 'active' : ''}`}
                        onClick={() => cambiarTab('curso')}
                    >
                        Por curso
                    </button>
                </li>
            </ul>

            {tab === 'estudiante' && (
                <div className="d-flex gap-2 mb-4 flex-wrap align-items-end">
                    <div>
                        <label className="form-label">Estudiante</label>
                        <select
                            className="form-select"
                            value={estudianteId}
                            onChange={e => { setEstudianteId(e.target.value); setReporte(null); }}
                        >
                            <option value="">Selecciona un estudiante</option>
                            {estudiantes.map(e => (
                                <option key={e.EstudianteId} value={e.EstudianteId}>{e.Nombre}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={verReporteEstudiante} disabled={!estudianteId || cargando}>
                        Ver reporte
                    </button>
                    {reporte && (
                        <button className="btn btn-outline-secondary" onClick={descargarPdf} disabled={descargando}>
                            {descargando ? 'Generando PDF...' : 'Descargar PDF'}
                        </button>
                    )}
                </div>
            )}

            {tab === 'curso' && (
                <div className="d-flex gap-2 mb-4 flex-wrap align-items-end">
                    <div>
                        <label className="form-label">Curso</label>
                        <select
                            className="form-select"
                            value={cursoId}
                            onChange={e => { setCursoId(e.target.value); setReporte(null); }}
                        >
                            <option value="">Selecciona un curso</option>
                            {cursos.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={verReporteCurso} disabled={!cursoId || cargando}>
                        Ver reporte
                    </button>
                    {reporte && (
                        <button className="btn btn-outline-secondary" onClick={descargarPdfCurso} disabled={descargando}>
                            {descargando ? 'Generando PDF...' : 'Descargar PDF'}
                        </button>
                    )}
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}
            {cargando && <p>Cargando reporte...</p>}

            {reporte && tab === 'estudiante' && (
                <div className="card p-4 shadow-sm">
                    <h4>{reporte.nombre || 'Estudiante'}</h4>
                    <p className="text-muted">
                        Generado el {new Date(reporte.generadoEl).toLocaleDateString('es-CR')}
                    </p>

                    <div className="row text-center mb-4">
                        <div className="col"><strong className="fs-4">{reporte.resumen.cursosInscritos}</strong><br />Cursos inscritos</div>
                        <div className="col"><strong className="fs-4">{reporte.resumen.cursosCompletados}</strong><br />Completados</div>
                        <div className="col"><strong className="fs-4">{reporte.resumen.promedioAvance}%</strong><br />Avance promedio</div>
                        <div className="col"><strong className="fs-4">{reporte.resumen.minutosUso}</strong><br />Minutos de uso</div>
                    </div>

                    <h5>Cursos</h5>
                    {reporte.cursos.length === 0 && <p className="text-muted">Sin cursos inscritos.</p>}
                    <ul className="list-group mb-4">
                        {reporte.cursos.map((c, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{c.tituloCurso}</span>
                                <span className="badge bg-primary rounded-pill">{c.porcentaje}%</span>
                            </li>
                        ))}
                    </ul>

                    <h5>Actividad reciente</h5>
                    {reporte.actividadesRecientes.length === 0 && <p className="text-muted">Sin actividad registrada.</p>}
                    <ul className="list-group">
                        {reporte.actividadesRecientes.map((a, i) => (
                            <li key={i} className="list-group-item">
                                {a.FechaCompletado && (
                                    <span className="text-muted me-2">
                                        [{new Date(a.FechaCompletado).toLocaleDateString('es-CR')}]
                                    </span>
                                )}
                                {a.Curso} · {a.Leccion} ({a.Puntuacion ?? '-'} pts)
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {reporte && tab === 'curso' && (
                <div className="card p-4 shadow-sm">
                    <h4>{reporte.tituloCurso || 'Curso'}</h4>
                    <p className="text-muted">
                        Generado el {new Date(reporte.generadoEl).toLocaleDateString('es-CR')}
                    </p>

                    <div className="row text-center mb-4">
                        <div className="col"><strong className="fs-4">{reporte.resumen.totalEstudiantes}</strong><br />Estudiantes</div>
                        <div className="col"><strong className="fs-4">{reporte.resumen.completados}</strong><br />Completados</div>
                        <div className="col"><strong className="fs-4">{reporte.resumen.sinAvance}</strong><br />Sin avance</div>
                        <div className="col"><strong className="fs-4">{reporte.resumen.promedioAvance}%</strong><br />Avance promedio</div>
                    </div>

                    {reporte.estudiantes.length === 0 ? (
                        <p className="text-muted">No hay estudiantes inscritos en este curso.</p>
                    ) : (
                        <table className="table align-middle">
                            <thead>
                                <tr><th>Estudiante</th><th>Avance</th><th>Estado</th></tr>
                            </thead>
                            <tbody>
                                {reporte.estudiantes.map((e, i) => (
                                    <tr key={i}>
                                        <td>{e.nombre}</td>
                                        <td>{e.porcentaje}%</td>
                                        <td>
                                            <span className={`badge ${e.completado ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {e.completado ? 'Completado' : 'En progreso'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
