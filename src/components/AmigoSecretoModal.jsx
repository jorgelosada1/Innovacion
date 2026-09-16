import { useState, useEffect, useRef, useMemo } from 'react';
import './AmigoSecretoModal.css';

import fernanImg from '../assets/images/Fernan.png';
import wilsonImg from '../assets/images/wilson.png';
import johannaImg from '../assets/images/Johanna.JPG';
import mariaImg from '../assets/images/Maria.png';
import erikaImg from '../assets/images/johan.JPG'; // Erika's photo
import paulaImg from '../assets/images/paula.JPG';
import johanImg from '../assets/images/erika.JPG'; // Johan's photo

const STORAGE_KEY = 'innovacion_amigo_secreto_data';

// Default participants
const DEFAULT_PARTICIPANTS = [
  { id: '1', name: 'Fernan', role: 'Gerente General', photo: fernanImg },
  { id: '2', name: 'Wilson', role: 'Gestión Humana', photo: wilsonImg },
  { id: '3', name: 'Johanna', role: 'Gerente Comercial', photo: johannaImg },
  { id: '4', name: 'María del Socorro', role: 'Nuevos Proyectos', photo: mariaImg },
  { id: '5', name: 'Johan', role: 'Equipo Comercial', photo: johanImg },
  { id: '6', name: 'Paula', role: 'Área de Gestión', photo: paulaImg },
  { id: '7', name: 'Erika', role: 'Liderazgo Comercial', photo: erikaImg },
];

// Algoritmo de Derangement (nadie se saca a sí mismo)
const generateDerangement = (participants) => {
  if (participants.length < 2) return {};
  const receivers = [...participants];
  let isValid = false;
  let pairs = {};

  let attempts = 0;
  while (!isValid && attempts < 1000) {
    attempts++;
    // Shuffle receivers
    for (let i = receivers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
    }

    isValid = true;
    for (let i = 0; i < participants.length; i++) {
      if (participants[i].id === receivers[i].id) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      for (let i = 0; i < participants.length; i++) {
        pairs[participants[i].id] = receivers[i].id;
      }
    }
  }

  // Fallback if shuffle took too long: simple cyclic shift
  if (!isValid) {
    pairs = {};
    for (let i = 0; i < participants.length; i++) {
      const nextIdx = (i + 1) % participants.length;
      pairs[participants[i].id] = participants[nextIdx].id;
    }
  }

  return pairs;
};

// Simple Web Audio API magical chime
const playCelebrationSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.65);
    });
  } catch {
    // AudioContext blocked or not supported, ignore gracefully
  }
};

const AmigoSecretoModal = ({ isOpen, onClose }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [stage, setStage] = useState('select'); // 'select' | 'animating' | 'revealed'
  const [cyclingName, setCyclingName] = useState('');
  const [revealedFriend, setRevealedFriend] = useState(null);
  const [isSecretBlurred, setIsSecretBlurred] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantRole, setNewParticipantRole] = useState('');

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Load or initialize pairs & participants from storage
  const [participants, setParticipants] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.participants && parsed.participants.length > 0) {
          // Re-attach photos from defaults if matching id
          return parsed.participants.map(p => {
            const def = DEFAULT_PARTICIPANTS.find(d => d.name.toLowerCase() === p.name.toLowerCase());
            return def ? { ...p, photo: def.photo } : p;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PARTICIPANTS;
  });

  const [pairs, setPairs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pairs && Object.keys(parsed.pairs).length > 0) {
          return parsed.pairs;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return generateDerangement(DEFAULT_PARTICIPANTS);
  });

  // Save to localStorage
  useEffect(() => {
    try {
      const cleanParticipants = participants.map(({ id, name, role }) => ({ id, name, role }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        participants: cleanParticipants,
        pairs
      }));
    } catch (e) {
      console.error(e);
    }
  }, [participants, pairs]);

  // Handle Confetti on Reveal
  useEffect(() => {
    if (stage !== 'revealed' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const colors = ['#2E86C1', '#F5A623', '#27AE60', '#E74C3C', '#9B59B6', '#F1C40F', '#3498DB'];
    const particles = [];
    const particleCount = 75;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 30,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16 - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 60 + 90
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // friction
        p.rotation += p.vRot;
        p.life++;

        if (p.life > p.maxLife * 0.7) {
          p.alpha = Math.max(0, 1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3));
        }

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [stage]);

  // Reset state on modal open/close
  useEffect(() => {
    if (!isOpen) {
      setStage('select');
      setSelectedUser('');
      setRevealedFriend(null);
      setIsSecretBlurred(false);
      setShowAdmin(false);
    }
  }, [isOpen]);

  const handleStartDraw = () => {
    if (!selectedUser) return;

    const targetFriendId = pairs[selectedUser];
    const friend = participants.find(p => p.id === targetFriendId);
    if (!friend) return;

    setStage('animating');

    // Cycle names rapidly for suspense
    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * participants.length);
      setCyclingName(participants[randomIdx].name);
      count++;

      if (count > 22) {
        clearInterval(interval);
        setRevealedFriend(friend);
        setStage('revealed');
        playCelebrationSound();
      }
    }, 90);
  };

  const handleResetDraw = () => {
    if (window.confirm('¿Estás seguro de reiniciar el sorteo? Se generarán nuevas parejas para todo el equipo.')) {
      const newPairs = generateDerangement(participants);
      setPairs(newPairs);
      setStage('select');
      setSelectedUser('');
      setRevealedFriend(null);
      alert('¡Nuevo sorteo generado exitosamente!');
    }
  };

  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (!newParticipantName.trim()) return;

    const newP = {
      id: Date.now().toString(),
      name: newParticipantName.trim(),
      role: newParticipantRole.trim() || 'Colaborador',
      photo: null
    };

    const updated = [...participants, newP];
    setParticipants(updated);
    setPairs(generateDerangement(updated));
    setNewParticipantName('');
    setNewParticipantRole('');
  };

  const selectedUserData = useMemo(() => {
    return participants.find(p => p.id === selectedUser);
  }, [participants, selectedUser]);

  if (!isOpen) return null;

  return (
    <div className="amigo-modal__backdrop" onClick={onClose}>
      <div className="amigo-modal__container" onClick={(e) => e.stopPropagation()}>
        <canvas ref={canvasRef} className="amigo-modal__canvas" />

        {/* Close button */}
        <button className="amigo-modal__close-btn" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>

        {/* Modal Header */}
        <div className="amigo-modal__header">
          <div className="amigo-modal__tag">
            <span className="amigo-modal__sparkle">✨</span> Amor & Amistad 2025
          </div>
          <h2 className="amigo-modal__title">
            Sorteo de <span className="amigo-modal__accent">Amigo Secreto</span>
          </h2>
          <p className="amigo-modal__subtitle">
            Innovación e-Learning • Descubre a quién vas a sorprender
          </p>
        </div>

        {/* STAGE 1: Selection */}
        {stage === 'select' && (
          <div className="amigo-modal__body amigo-modal__fade-in">
            <div className="amigo-modal__gift-preview">
              <div className="amigo-gift amigo-gift--idle">
                <div className="amigo-gift__lid">
                  <div className="amigo-gift__bow"></div>
                </div>
                <div className="amigo-gift__box"></div>
              </div>
            </div>

            <div className="amigo-modal__select-box">
              <label htmlFor="amigo-user-select" className="amigo-modal__label">
                ¿Quién eres tú?
              </label>
              <select
                id="amigo-user-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="amigo-modal__select"
              >
                <option value="">-- Selecciona tu nombre en la lista --</option>
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>

            {selectedUserData && (
              <div className="amigo-modal__user-greeting">
                <div className="amigo-modal__greeting-avatar">
                  {selectedUserData.photo ? (
                    <img src={selectedUserData.photo} alt={selectedUserData.name} />
                  ) : (
                    <span>{selectedUserData.name[0]}</span>
                  )}
                </div>
                <p>
                  ¡Hola <strong>{selectedUserData.name}</strong>! ¿Listo para descubrir tu amigo secreto?
                </p>
              </div>
            )}

            <button
              className="amigo-modal__draw-btn"
              disabled={!selectedUser}
              onClick={handleStartDraw}
            >
              <span className="amigo-modal__btn-gift">🎁</span>
              <span>¡Abrir Mi Regalo Secreto!</span>
            </button>

            <div className="amigo-modal__footer-tools">
              <button
                type="button"
                className="amigo-modal__admin-toggle"
                onClick={() => setShowAdmin(!showAdmin)}
              >
                {showAdmin ? '▲ Ocultar Configuración' : '⚙️ Administrar Participantes / Reiniciar'}
              </button>
            </div>

            {/* Admin Panel */}
            {showAdmin && (
              <div className="amigo-modal__admin-box">
                <div className="amigo-modal__admin-header">
                  <h4>Participantes ({participants.length})</h4>
                  <button
                    className="amigo-modal__reset-btn"
                    onClick={handleResetDraw}
                    title="Generar nuevas parejas para todos"
                  >
                    🔄 Sortear de Nuevo
                  </button>
                </div>
                <ul className="amigo-modal__participants-list">
                  {participants.map(p => (
                    <li key={p.id}>
                      <span>{p.name} <small>({p.role})</small></span>
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleAddParticipant} className="amigo-modal__add-form">
                  <input
                    type="text"
                    placeholder="Nuevo nombre..."
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Cargo..."
                    value={newParticipantRole}
                    onChange={(e) => setNewParticipantRole(e.target.value)}
                  />
                  <button type="submit">+ Añadir</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* STAGE 2: Suspense Animation */}
        {stage === 'animating' && (
          <div className="amigo-modal__body amigo-modal__animating-stage">
            <div className="amigo-gift amigo-gift--shaking">
              <div className="amigo-gift__lid">
                <div className="amigo-gift__bow"></div>
              </div>
              <div className="amigo-gift__box"></div>
              <div className="amigo-gift__glow"></div>
            </div>

            <div className="amigo-modal__roulette">
              <p className="amigo-modal__roulette-text">Consultando la tómbola mágica...</p>
              <div className="amigo-modal__roulette-name">
                {cyclingName || 'Buscando...'}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: Revealed Friend */}
        {stage === 'revealed' && revealedFriend && (
          <div className="amigo-modal__body amigo-modal__revealed-stage">
            <div className="amigo-card">
              <div className="amigo-card__sparkle-bar">
                <span>✨</span>
                <span>🤫 TOP SECRET</span>
                <span>✨</span>
              </div>

              <div className={`amigo-card__content ${isSecretBlurred ? 'amigo-card__content--blurred' : ''}`}>
                <div className="amigo-card__avatar-wrap">
                  {revealedFriend.photo ? (
                    <img src={revealedFriend.photo} alt={revealedFriend.name} className="amigo-card__avatar" />
                  ) : (
                    <div className="amigo-card__avatar-placeholder">{revealedFriend.name[0]}</div>
                  )}
                  <div className="amigo-card__badge-ribbon">🎁</div>
                </div>

                <div className="amigo-card__text-block">
                  <span className="amigo-card__caption">¡Tu Amigo Secreto es!</span>
                  <h3 className="amigo-card__friend-name">{revealedFriend.name}</h3>
                  <span className="amigo-card__friend-role">{revealedFriend.role}</span>
                </div>
              </div>

              {isSecretBlurred && (
                <div className="amigo-card__blur-notice">
                  <span>🔒 Nombre Oculto por Privacidad</span>
                </div>
              )}

              <div className="amigo-card__ideas">
                <span className="amigo-card__ideas-title">💡 Ideas para sorprender a {revealedFriend.name}:</span>
                <div className="amigo-card__ideas-chips">
                  <span className="amigo-card__chip">🍬 Endulzada favorita</span>
                  <span className="amigo-card__chip">☕ Café o Té</span>
                  <span className="amigo-card__chip">🎁 Detalle sorpresa</span>
                </div>
              </div>

              <div className="amigo-card__actions">
                <button
                  className="amigo-card__btn amigo-card__btn--toggle"
                  onClick={() => setIsSecretBlurred(!isSecretBlurred)}
                >
                  {isSecretBlurred ? '👁️ Revelar Nombre' : '🙈 Ocultar (Si hay alguien cerca)'}
                </button>
                <button
                  className="amigo-card__btn amigo-card__btn--done"
                  onClick={onClose}
                >
                  ¡Listo, guardar secreto! 🤫
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmigoSecretoModal;
