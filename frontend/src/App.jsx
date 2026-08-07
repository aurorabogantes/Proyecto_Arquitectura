import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import GamificationPage from './pages/GamificationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReportsPage from './pages/ReportsPage';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
    return (
        <NotificationProvider>
            <div className='d-flex flex-column min-vh-100'>
                <Navbar />
                <main className='flex-grow-1'>
                    <Routes>
                        <Route path="/" element={<Navigate to="/courses" replace />} />

                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route path="/courses" element={
                            <ProtectedRoute rolesPermitidos={['estudiante']}><CoursesPage /></ProtectedRoute>
                        } />
                        <Route path="/courses/:id" element={
                            <ProtectedRoute rolesPermitidos={['estudiante']}><CourseDetailPage /></ProtectedRoute>
                        } />
                        <Route path="/gamification" element={
                            <ProtectedRoute rolesPermitidos={['estudiante']}><GamificationPage /></ProtectedRoute>
                        } />

                        <Route path="/reports" element={
                            <ProtectedRoute rolesPermitidos={['docente', 'administrador']}><ReportsPage /></ProtectedRoute>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </NotificationProvider>
    );
}
