import Icon from './Icon';

export default function Footer() {
    return (
        <footer className="text-white py-4 mt-5" style={{ background: 'linear-gradient(135deg, #2C3E50, #3D5A80)' }}>
            <div className="container text-center">
                <p className="mb-1 fw-bold fs-5"><i className="bi bi-rocket-fill me-2" /> KodKids</p>
                <p className="mb-0 text-white-50 small">
                    Portal de cursos interactivos de programación infantil
                </p>
            </div>
        </footer>
    );
}
