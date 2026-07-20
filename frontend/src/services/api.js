const BASE = '/api';

const get = url => fetch(BASE + url).then(r => r.json());
const post = (url, body = {}) =>
    fetch(BASE + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(r => r.json());

export const fetchUser = () => get('/user');
export const fetchCourses = params => get('/courses?' + new URLSearchParams(params));
export const fetchCourse = id => get(`/courses/${id}`);
export const enrollCourse = id => post(`/courses/${id}/enroll`);
export const fetchDashboard = () => get('/gamification/dashboard');
export const fetchMediaLibrary = type => get('/media/library' + (type ? `?type=${type}` : ''));