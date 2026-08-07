const BASE = '/api';
const TOKEN_KEY = 'kodkids_token';

function authHeaders() {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
}

const get  = url => fetch(BASE + url, { headers: { ...authHeaders() } }).then(r => r.json());
const post = (url, body = {}) =>
    fetch(BASE + url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body:    JSON.stringify(body)
    }).then(r => r.json());

// --- Autenticación ---
export const loginRequest    = (email, password) => post('/auth/login', { email, password });
export const registerRequest = ({ nombre, email, password, rol }) => post('/auth/register', { nombre, email, password, rol });
export const fetchMe         = ()                 => get('/auth/me');

// --- Estudiante / cursos / progreso / gamificación / media ---
export const fetchStudentProgress = estudianteId    => get(`/progress/student/${estudianteId}`);
export const fetchLessonsProgress = (estudianteId, cursoId) => get(`/progress/student/${estudianteId}/course/${cursoId}/lessons`);
export const fetchUser         = ()                  => get('/user/current');
export const fetchStudents     = ()                  => get('/user/students');
export const fetchCourses      = (params = {})       => get('/courses?' + new URLSearchParams(params));
export const fetchCourse       = id                  => get(`/courses/${id}`);
export const enrollCourse      = (id, estudianteId)  => post(`/courses/${id}/enroll`, { estudianteId });
export const fetchDashboard    = estudianteId        => get(`/gamification/dashboard?estudianteId=${estudianteId}`);
export const fetchTrivia       = ()                  => get('/gamification/trivia');
export const triviaResultado   = (estudianteId, aciertos) => post('/gamification/trivia-resultado', { estudianteId, aciertos });
export const addPoints         = (estudianteId, puntos)   => post('/gamification/points', { estudianteId, puntos });
export const fetchMediaLibrary = type => get('/media/library' + (type ? `?type=${type}` : ''));
export const trackTime         = (estudianteId, minutos) => post('/progress/time', { estudianteId, minutos });
export const completeLesson    = (estudianteId, leccionId, puntuacion) => post('/progress/complete-lesson', { estudianteId, leccionId, puntuacion });

// --- IA: editor de código ---
export const executeCode = (code, language)                                    => post('/ai/execute', { code, language });
export const aiAssist    = (code, language, projectTitle, projectDescription)  => post('/ai/assist',  { code, language, projectTitle, projectDescription });

// --- Reportes (docente / administrador / el propio estudiante) ---
export const fetchStudentReport = estudianteId => get(`/reports/student/${estudianteId}`);
export const fetchCourseReport  = cursoId      => get(`/reports/course/${cursoId}`);

export async function downloadStudentReportPdf(estudianteId) {
    const res = await fetch(`${BASE}/reports/student/${estudianteId}/pdf`, {
        headers: { ...authHeaders() }
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo generar el PDF');
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_estudiante_${estudianteId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

export async function downloadCourseReportPdf(cursoId) {
    const res = await fetch(`${BASE}/reports/course/${cursoId}/pdf`, {
        headers: { ...authHeaders() }
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo generar el PDF');
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_curso_${cursoId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}
