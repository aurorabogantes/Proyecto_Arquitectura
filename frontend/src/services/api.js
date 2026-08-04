const BASE = '/api';

const get  = url => fetch(BASE + url).then(r => r.json());
const post = (url, body = {}) =>
    fetch(BASE + url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body)
    }).then(r => r.json());

export const fetchStudentProgress = (estudianteId = 1) => get(`/progress/student/${estudianteId}`);
export const fetchUser         = (estudianteId = 1) => get(`/user/current?estudianteId=${estudianteId}`);
export const fetchCourses      = (params = {})       => get('/courses?' + new URLSearchParams(params));
export const fetchCourse       = id                  => get(`/courses/${id}`);
export const enrollCourse      = (id, estudianteId = 1) => post(`/courses/${id}/enroll`, { estudianteId });
export const fetchDashboard    = (estudianteId = 1)  => get(`/gamification/dashboard?estudianteId=${estudianteId}`);
export const fetchTrivia       = ()                  => get('/gamification/trivia');
export const triviaResultado   = (estudianteId, aciertos) => post('/gamification/trivia-resultado', { estudianteId, aciertos });
export const addPoints         = (estudianteId, puntos) => post('/gamification/points', { estudianteId, puntos });
export const fetchMediaLibrary = type => get('/media/library' + (type ? `?type=${type}` : ''));
export const trackTime         = (estudianteId, minutos) => post('/progress/time', { estudianteId, minutos });
export const completeLesson    = (estudianteId, leccionId, puntuacion) => post('/progress/complete-lesson', { estudianteId, leccionId, puntuacion });
