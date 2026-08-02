import { useState, useEffect, useCallback } from 'react';
import { fetchDashboard, fetchTrivia, updateProgress, addPoints, triviaResultado } from '../services/api';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';

// Decode HTML entities returned by Open Trivia DB
function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

export default function GamificationPage() {
    const { studentId, setUser } = useUser();
    const [data, setData]           = useState(null);
    const [loading, setLoading]     = useState(true);
    const [activeTab, setTab]       = useState('overview');

    const loadDashboard = useCallback(() => {
        setLoading(true);
        fetchDashboard(studentId)
            .then(d => setData(d))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [studentId]);

    useEffect(() => { loadDashboard(); }, [loadDashboard]);

    if (loading) {
        return (
            <div className="spinner-overlay">
                <div className="spinner-border text-warning" role="status" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="empty-state">
                <div className="icon">⚠️</div>
                <p className="fs-5">No se pudo cargar el panel de gamificación.</p>
            </div>
        );
    }

    const { user, badges, challenges, levels, currentLevel, progress } = data;

    return (
        <>
            {/* Hero */}
            <div
                className="text-white py-4 mb-4"
                style={{ background: 'linear-gradient(135deg, #9B59B6, #4ECDC4)', borderRadius: '0 0 32px 32px' }}
            >
                <div className="container d-flex flex-wrap align-items-center gap-4">
                    <div className="fs-1">🏆</div>
                    <div>
                        <h2 className="fw-black mb-0">¡Hola, {user?.name}!</h2>
                        <p className="mb-0 opacity-90">Tu panel de gamificación</p>
                    </div>
                    <div className="ms-auto d-flex gap-3">
                        <StatPill icon="⭐" value={user?.points ?? 0} label="puntos" color="#FFD93D" />
                        <StatPill icon="🔥" value={user?.streak ?? 0} label="días" color="#FF6B6B" />
                    </div>
                </div>
            </div>

            <div className="container pb-5">
                {/* Level progress */}
                <LevelCard currentLevel={currentLevel} progress={progress} levels={levels} user={user} />

                {/* Tabs */}
                <ul className="nav nav-pills mb-4 gap-2">
                    {[
                        { id: 'overview',    label: '📊 Resumen' },
                        { id: 'badges',      label: '🏅 Insignias' },
                        { id: 'challenges',  label: '⚔️ Retos' },
                        { id: 'trivia',      label: '🧠 Trivia' }
                    ].map(tab => (
                        <li key={tab.id} className="nav-item">
                            <button
                                className={`nav-link fw-semibold ${activeTab === tab.id ? 'active' : 'text-dark'}`}
                                style={activeTab === tab.id
                                    ? { background: 'linear-gradient(135deg,#9B59B6,#4ECDC4)', border: 'none' }
                                    : { background: '#fff', border: '1px solid #dee2e6' }
                                }
                                onClick={() => setTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>

                {activeTab === 'overview'   && <OverviewTab user={user} badges={badges} challenges={challenges} />}
                {activeTab === 'badges'     && <BadgesTab badges={badges} />}
                {activeTab === 'challenges' && (
                    <ChallengesTab
                        challenges={challenges}
                        studentId={studentId}
                        onRefresh={loadDashboard}
                    />
                )}
                {activeTab === 'trivia'     && (
                    <TriviaTab studentId={studentId} onRefresh={loadDashboard} />
                )}
            </div>
        </>
    );
}

/* ─────────────────── Sub-components ─────────────────── */

function StatPill({ icon, value, label, color }) {
    return (
        <div
            className="text-center px-3 py-2 rounded-3"
            style={{ background: 'rgba(255,255,255,.2)', minWidth: 80 }}
        >
            <div className="fw-black fs-5" style={{ color }}>{icon} {value}</div>
            <div className="small opacity-75">{label}</div>
        </div>
    );
}

function LevelCard({ currentLevel, progress, levels, user }) {
    if (!currentLevel) return null;
    const nextLevel = levels.find(l => l.level === (currentLevel.level + 1));

    return (
        <div
            className="card border-0 rounded-4 mb-4 text-white p-4"
            style={{ background: `linear-gradient(135deg, ${currentLevel.color || '#9B59B6'}, ${nextLevel?.color || '#4ECDC4'})` }}
        >
            <div className="d-flex align-items-center gap-3 mb-3">
                <span style={{ fontSize: '2.5rem' }}>{currentLevel.icon}</span>
                <div>
                    <h4 className="fw-black mb-0">Nivel {currentLevel.level}: {currentLevel.name}</h4>
                    <p className="mb-0 opacity-75 small">{currentLevel.description}</p>
                </div>
                <div className="ms-auto text-end">
                    <div className="fw-bold fs-5">{user?.points ?? 0} pts</div>
                    {nextLevel && (
                        <div className="small opacity-75">
                            {currentLevel.maxPoints - (user?.points ?? 0)} para nivel {nextLevel.level}
                        </div>
                    )}
                </div>
            </div>
            <div className="level-bar">
                <div
                    className="progress-bar h-100"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="d-flex justify-content-between small opacity-75 mt-1">
                <span>{currentLevel.minPoints} pts</span>
                {nextLevel && <span>{currentLevel.maxPoints} pts</span>}
            </div>
        </div>
    );
}

function OverviewTab({ user, badges, challenges }) {
    const earned    = badges.filter(b => b.isEarned).length;
    const completed = challenges.filter(c => c.isCompleted).length;

    return (
        <div className="row g-4">
            <div className="col-6 col-md-3">
                <StatCard icon="⭐" value={user?.points ?? 0} label="Puntos totales" color="#FFD93D" />
            </div>
            <div className="col-6 col-md-3">
                <StatCard icon="🔥" value={user?.streak ?? 0} label="Días seguidos" color="#FF6B6B" />
            </div>
            <div className="col-6 col-md-3">
                <StatCard icon="🏅" value={`${earned}/${badges.length}`} label="Insignias" color="#9B59B6" />
            </div>
            <div className="col-6 col-md-3">
                <StatCard icon="✅" value={`${completed}/${challenges.length}`} label="Retos completados" color="#4ECDC4" />
            </div>

            {/* Recent badges */}
            {earned > 0 && (
                <div className="col-12">
                    <h5 className="section-title">Últimas insignias obtenidas</h5>
                    <div className="d-flex flex-wrap gap-3">
                        {badges.filter(b => b.isEarned).slice(0, 4).map(b => (
                            <BadgeChip key={b.id} badge={b} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, value, label, color }) {
    return (
        <div className="stat-card card text-center p-3 h-100">
            <div style={{ fontSize: '2rem' }}>{icon}</div>
            <div className="fw-black fs-3" style={{ color }}>{value}</div>
            <div className="text-muted small">{label}</div>
        </div>
    );
}

function BadgesTab({ badges }) {
    return (
        <div>
            <h5 className="section-title">Todas las insignias</h5>
            <div className="d-flex flex-wrap gap-3">
                {badges.map(b => <BadgeChip key={b.id} badge={b} showLocked />)}
            </div>
        </div>
    );
}

function BadgeChip({ badge, showLocked = false }) {
    if (!badge.isEarned && !showLocked) return null;
    return (
        <div
            className={`badge-item ${badge.isEarned ? '' : 'locked'}`}
            style={{ background: badge.isEarned ? (badge.color + '22') : '#f8f9fa', border: `2px solid ${badge.isEarned ? badge.color : '#dee2e6'}` }}
            title={badge.description}
        >
            <div className="badge-icon">{badge.icon}</div>
            <div className="fw-semibold small mt-1" style={{ fontSize: '.7rem', lineHeight: 1.2 }}>
                {badge.name}
            </div>
        </div>
    );
}

function ChallengesTab({ challenges: initialChallenges, studentId, onRefresh }) {
    const [challenges, setChallenges] = useState(initialChallenges);
    const [updating, setUpdating]     = useState(null);
    const { addNotification }         = useNotification();

    useEffect(() => { setChallenges(initialChallenges); }, [initialChallenges]);

    const handleProgress = async (challenge) => {
        if (challenge.isCompleted || updating) return;
        setUpdating(challenge.id);

        const newProg = Math.min((challenge.userProgress || 0) + 1, challenge.target);
        const nowDone = newProg >= challenge.target;

        setChallenges(prev => prev.map(c => c.id === challenge.id ? {
            ...c,
            userProgress: newProg,
            progressPct: Math.min(Math.round((newProg / c.target) * 100), 100),
            isCompleted: nowDone
        } : c));

        try {
            await updateProgress(studentId, challenge.id, newProg);
            if (nowDone) {
                const res = await addPoints(studentId, challenge.reward);
                addNotification({
                    type: 'success',
                    message: `¡Reto completado! ${challenge.icon} "${challenge.title}" +${challenge.reward} pts`
                });
                (res?.nuevasInsignias || []).forEach(ins => addNotification({
                    type: 'badge',
                    message: `¡Insignia desbloqueada! ${ins.icono} ${ins.nombre}`
                }));
            }
            onRefresh();
        } catch {
            setChallenges(initialChallenges);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div>

            <h5 className="section-title">Retos activos</h5>
            <div className="row g-3">
                {challenges.map(c => (
                    <div key={c.id} className="col-12 col-md-6">
                        <div
                            className={`card border-0 rounded-4 p-3 h-100 ${c.isCompleted ? 'bg-success bg-opacity-10' : ''}`}
                            style={{ boxShadow: '0 2px 12px rgba(0,0,0,.06)', transition: 'all .2s' }}
                        >
                            <div className="d-flex align-items-center gap-3 mb-2">
                                <span style={{ fontSize: '2rem' }}>{c.icon}</span>
                                <div className="flex-grow-1">
                                    <div className="fw-bold">{c.title}</div>
                                    <div className="text-muted small">{c.description}</div>
                                </div>
                                <span className="badge bg-warning text-dark rounded-pill">+{c.reward} pts</span>
                            </div>

                            <div className="progress mb-2" style={{ height: 10, borderRadius: 99 }}>
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${c.progressPct}%`,
                                        borderRadius: 99,
                                        background: c.isCompleted
                                            ? '#28a745'
                                            : 'linear-gradient(90deg,#9B59B6,#4ECDC4)',
                                        transition: 'width .4s ease'
                                    }}
                                />
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted small">
                                    <strong>{c.userProgress}</strong>/{c.target}
                                    {' · '}⏰ {c.expiresIn}
                                </span>
                                {c.isCompleted ? (
                                    <span className="badge bg-success rounded-pill px-3 py-2">✓ Completado</span>
                                ) : (
                                    <button
                                        className="btn btn-sm btn-secondary-custom rounded-pill px-3"
                                        onClick={() => handleProgress(c)}
                                        disabled={!!updating}
                                    >
                                        {updating === c.id ? (
                                            <span className="spinner-border spinner-border-sm" />
                                        ) : '+ Avanzar'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TriviaTab({ studentId, onRefresh }) {
    const [questions, setQuestions]   = useState([]);
    const [current, setCurrent]       = useState(0);
    const [selected, setSelected]     = useState(null);
    const [score, setScore]           = useState(0);
    const [finished, setFinished]     = useState(false);
    const [loading, setLoading]       = useState(false);
    const [started, setStarted]       = useState(false);
    const { addNotification }         = useNotification();

    const startTrivia = async () => {
        setLoading(true);
        setStarted(true);
        setScore(0);
        setCurrent(0);
        setSelected(null);
        setFinished(false);
        try {
            const res = await fetch('/api/gamification/trivia').then(r => r.json());
            setQuestions(res.questions || []);
        } catch {
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (option) => {
        if (selected !== null) return;
        setSelected(option);
        const correct = option === questions[current].correctAnswer;
        if (correct) setScore(s => s + 1);

        setTimeout(async () => {
            if (current + 1 >= questions.length) {
                const totalAciertos = score + (correct ? 1 : 0);
                setFinished(true);
                // Registra puntos + progreso en desafío "Quiz Master" en el backend
                if (totalAciertos > 0) {
                    try {
                        const res = await triviaResultado(studentId, totalAciertos);
                        addNotification({ type: 'points', message: `¡Trivia completada! +${res.puntosGanados || 0} pts` });
                        (res?.nuevasInsignias || []).forEach(ins => addNotification({
                            type: 'badge',
                            message: `¡Insignia desbloqueada! ${ins.icono} ${ins.nombre}`
                        }));
                        onRefresh();
                    } catch { /* silent */ }
                }
            } else {
                setCurrent(c => c + 1);
                setSelected(null);
            }
        }, 1200);
    };

    if (!started) {
        return (
            <div className="text-center py-5">
                <div className="display-3 mb-3">🧠</div>
                <h4 className="fw-bold mb-2">Quiz de Programación</h4>
                <p className="text-muted mb-4">
                    Responde 5 preguntas sobre tecnología y gana <strong>hasta 75 puntos</strong>.<br />
                    Preguntas obtenidas en tiempo real desde <em>Open Trivia DB</em>.
                </p>
                <button className="btn btn-primary-custom px-5 py-2 fs-5" onClick={startTrivia}>
                    ¡Iniciar Trivia! 🚀
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="spinner-overlay">
                <div className="spinner-border text-warning" role="status" />
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No se pudieron cargar preguntas. Verifica tu conexión.</p>
                <button className="btn btn-primary-custom mt-3" onClick={startTrivia}>Reintentar</button>
            </div>
        );
    }

    if (finished) {
        const total = questions.length;
        const ptsEarned = score * 15;
        return (
            <div className="text-center py-5">
                <div className="display-3 mb-3">{score === total ? '🏆' : score >= total / 2 ? '🎉' : '💪'}</div>
                <h3 className="fw-black mb-2">{score}/{total} respuestas correctas</h3>
                <p className="text-muted mb-2">
                    {score === total ? '¡Puntuación perfecta!' : score >= total / 2 ? '¡Buen trabajo!' : 'Sigue practicando'}
                </p>
                {ptsEarned > 0 && (
                    <div className="alert alert-warning d-inline-block px-4 py-2 rounded-pill fw-bold mb-4">
                        +{ptsEarned} puntos ganados ⭐
                    </div>
                )}
                <br />
                <button className="btn btn-primary-custom px-5 py-2" onClick={startTrivia}>
                    Jugar otra vez 🔄
                </button>
            </div>
        );
    }

    const q = questions[current];

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-8">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-secondary rounded-pill px-3 py-2">
                        Pregunta {current + 1} / {questions.length}
                    </span>
                    <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                        ⭐ {score} correctas
                    </span>
                </div>

                <div className="progress mb-4" style={{ height: 8, borderRadius: 99 }}>
                    <div
                        className="progress-bar"
                        style={{
                            width: `${((current) / questions.length) * 100}%`,
                            background: 'linear-gradient(90deg,#9B59B6,#4ECDC4)',
                            borderRadius: 99
                        }}
                    />
                </div>

                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h5 className="fw-bold text-center">{decodeHtml(q.question)}</h5>
                </div>

                <div className="d-flex flex-column gap-3">
                    {q.options.map((opt, i) => {
                        let cls = 'trivia-option p-3 fw-semibold';
                        if (selected !== null) {
                            if (opt === q.correctAnswer) cls += ' correct';
                            else if (opt === selected && opt !== q.correctAnswer) cls += ' wrong';
                        }
                        return (
                            <button
                                key={i}
                                className={cls}
                                onClick={() => handleAnswer(opt)}
                                disabled={selected !== null}
                            >
                                {String.fromCharCode(65 + i)}. {decodeHtml(opt)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
