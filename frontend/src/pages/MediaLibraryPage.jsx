import { useState, useEffect } from 'react';
import { fetchMediaLibrary } from '../services/api';
import Icon from '../components/Icon';

const TYPE_FILTERS = [
    { value: '',       label: 'Todo' },
    { value: 'video',  label: <><Icon name="video" /> Videos</> },
    { value: 'image',  label: <><Icon name="image" /> Imágenes</> }
];

export default function MediaLibraryPage() {
    const [items, setItems]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [typeFilter, setType]   = useState('');
    const [modal, setModal]       = useState(null);   // item to show in lightbox

    useEffect(() => {
        setLoading(true);
        fetchMediaLibrary(typeFilter)
            .then(data => setItems(data.mediaItems || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [typeFilter]);

    return (
        <>
            {/* Hero */}
            <div
                className="text-white py-4 mb-4"
                style={{ background: 'linear-gradient(135deg, #45B7D1, #96CEB4)', borderRadius: '0 0 32px 32px' }}
            >
                <div className="container text-center">
                    <h2 className="fw-black mb-1"><Icon name="video" /> Biblioteca Multimedia</h2>
                    <p className="mb-0 opacity-90">Videos, animaciones e imágenes educativas</p>
                </div>
            </div>

            <div className="container pb-5">
                {/* Filter pills */}
                <div className="d-flex gap-2 mb-4 flex-wrap">
                    {TYPE_FILTERS.map(f => (
                        <button
                            key={f.value}
                            className={`btn rounded-pill fw-semibold px-4 ${typeFilter === f.value ? 'btn-primary-custom' : 'btn-outline-secondary'}`}
                            onClick={() => setType(f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="spinner-overlay">
                        <div className="spinner-border text-info" role="status" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon"><Icon name="image" /></div>
                        <p className="fs-5">No hay recursos en esta categoría</p>
                    </div>
                ) : (
                    <>
                        <p className="text-muted mb-3">{items.length} recurso{items.length !== 1 ? 's' : ''}</p>
                        <div className="row g-4">
                            {items.map(item => (
                                <MediaCard key={item.MediaId} item={item} onOpen={setModal} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Lightbox for images */}
            {modal && modal.Tipo === 'image' && (
                <div
                    className="modal d-block"
                    style={{ background: 'rgba(0,0,0,.75)' }}
                    onClick={() => setModal(null)}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-content border-0 rounded-4 overflow-hidden">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">{modal.Titulo}</h5>
                                <button className="btn-close" onClick={() => setModal(null)} />
                            </div>
                            <div className="modal-body p-3">
                                <img src={modal.Url} alt={modal.Titulo} className="img-fluid rounded-3 w-100" />
                                {modal.TituloCurso && (
                                    <p className="text-muted small mt-2 mb-0"><i className="bi bi-journal-bookmark me-1" /> Curso: {modal.TituloCurso}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function MediaCard({ item, onOpen }) {
    const isVideo = item.Tipo === 'video';

    return (
        <div className="col-12 col-sm-6 col-lg-4">
            <div className="media-card card h-100">
                {isVideo ? (
                    <div className="video-wrapper">
                        <iframe
                            src={item.Url}
                            title={item.Titulo}
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div
                        className="position-relative"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onOpen(item)}
                    >
                        <img
                            src={item.Url}
                            alt={item.Titulo}
                            className="w-100"
                            style={{ height: 200, objectFit: 'cover' }}
                        />
                            <div className="position-absolute top-0 end-0 m-2 badge bg-primary rounded-pill small">
                            Ver
                        </div>
                    </div>
                )}

                <div className="card-body p-3">
                    <div className="d-flex align-items-start justify-content-between gap-2">
                        <div>
                                <span
                                className="media-type-badge badge me-1"
                                style={{
                                    position: 'static',
                                    background: isVideo ? '#ff6b6b22' : '#4ECDC422',
                                    color: isVideo ? '#FF6B6B' : '#4ECDC4'
                                }}
                            >
                                {isVideo ? <><Icon name="video" /> Video</> : <><Icon name="image" /> Imagen</>}
                            </span>
                            <h6 className="fw-bold mt-2 mb-1">{item.Titulo}</h6>
                            {item.TituloCurso && (
                                <p className="text-muted small mb-0"><i className="bi bi-journal-bookmark me-1" /> {item.TituloCurso}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
