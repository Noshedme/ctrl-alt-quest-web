import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Download, Bell, Send, ThumbsUp, User, LogOut, Shield, Trophy, ShoppingCart, Coins, CreditCard, MessageCircle, X, Check, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// IMPORTAMOS EL EFECTO 3D (Asegúrate de tener este componente src/components/TiltCard.jsx)
import TiltCard from '../components/TiltCard';
import bgVideo from '../assets/videos/background.mp4';

// --- CONFIGURACIÓN Y DATOS ---

const BAD_WORDS = ['basura', 'idiota', 'estupido', 'malo', 'mierda', 'tonto', 'noob', 'asco'];

const SHOP_ITEMS = [
    { id: 1, name: 'Marco Dorado', price: 500, type: 'frame', color: '#ffd700', desc: 'Destaca tu avatar en el ranking.' },
    { id: 2, name: 'Skin Cyberpunk', price: 1200, type: 'skin', color: '#00f3ff', desc: 'Estética neón para tu perfil.' },
    { id: 3, name: 'Título: "Leyenda"', price: 3000, type: 'title', color: '#ff0055', desc: 'Muestra tu estatus a todos.' },
    { id: 4, name: 'Boost XP (1h)', price: 250, type: 'consumable', color: '#4caf50', desc: 'Gana doble experiencia.' },
];

const COIN_PACKS = [
    { id: 1, amount: 500, price: 4.99, label: 'Bolsa de Monedas', bonus: '' },
    { id: 2, amount: 1200, price: 9.99, label: 'Cofre del Tesoro', bonus: '+10% EXTRA' },
    { id: 3, amount: 3000, price: 19.99, label: 'Bóveda Real', bonus: '+25% EXTRA' },
];

const INITIAL_POSTS = [
  { 
      id: 1, author: 'CodeWizard', role: 'ADMIN', content: '¡Bienvenidos a la Beta Abierta! Reporten bugs en este hilo.', likes: 45, time: 'Hace 2h',
      comments: [{ id: 101, author: 'PlayerOne', text: '¡El sistema de XP se ve genial!' }]
  },
  { 
      id: 2, author: 'NoobMaster69', role: 'USER', content: '¿Alguien sabe cómo desbloquear la skin de Java?', likes: 12, time: 'Hace 5h',
      comments: []
  },
];

const PATCH_NOTES = [
  { version: 'v1.0.4', date: '27/01/2026', title: 'Hotfix de Rendimiento', desc: 'Se redujo el consumo de RAM en un 15%.' },
  { version: 'v1.0.3', date: '25/01/2026', title: 'Clase Analista', desc: 'Nueva clase disponible con bonificaciones en Excel.' },
];

const LEADERBOARD_DATA = [
    { rank: 1, username: 'SysAdmin', lvl: 99, xp: '9,999,999', class: 'Game Master' },
    { rank: 2, username: 'GrindLord', lvl: 54, xp: '450,200', class: 'DevOps' },
    { rank: 3, username: 'PythonQueen', lvl: 48, xp: '380,150', class: 'Data Scientist' },
    { rank: 4, username: 'DesignGod', lvl: 42, xp: '310,000', class: 'Designer' },
    { rank: 5, username: 'PlayerOne', lvl: 12, xp: '15,400', class: 'Novice' },
    { rank: 6, username: 'BugFinder', lvl: 10, xp: '12,000', class: 'QA Tester' },
];

// --- COMPONENTE: MODAL DE PAGO ---
const PaymentModal = ({ pack, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvc: '' });

    const handlePay = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onConfirm();
        }, 2500);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(8px)' }}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="rpg-panel"
                style={{ width: '100%', maxWidth: '400px', padding: '30px', background: 'linear-gradient(135deg, #1a1a2e 0%, #0d0915 100%)', border: '1px solid var(--gold-primary)', boxShadow: '0 0 50px rgba(247, 210, 122, 0.15)' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#fff', fontFamily: 'var(--font-rpg)' }}>Pasarela Segura</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#e94560', cursor: 'pointer' }}><X /></button>
                </div>

                <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>Producto:</p>
                        <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--gold-primary)' }}>{pack.amount} Monedas</p>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>${pack.price}</div>
                </div>

                <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="input-group">
                        <CreditCard size={18} color="#888" />
                        <input required type="text" placeholder="0000 0000 0000 0000" maxLength="19" className="rpg-input" value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <User size={18} color="#888" />
                        <input required type="text" placeholder="Nombre en la tarjeta" className="rpg-input" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <input required type="text" placeholder="MM/YY" maxLength="5" className="rpg-input" style={{ flex: 1 }} value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} />
                        <input required type="text" placeholder="CVC" maxLength="3" className="rpg-input" style={{ width: '80px' }} value={cardData.cvc} onChange={e => setCardData({...cardData, cvc: e.target.value})} />
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(76, 175, 80, 0.4)' }} whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="btn-hero"
                        style={{ marginTop: '10px', background: loading ? '#555' : 'linear-gradient(to right, #4caf50, #2e7d32)', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: '#fff' }}
                    >
                        {loading ? 'Procesando...' : <><Lock size={16} /> PAGAR AHORA</>}
                    </motion.button>
                </form>
                
                <p style={{ textAlign: 'center', fontSize: '0.6rem', color: '#555', marginTop: '15px' }}>
                    <Shield size={10} style={{ verticalAlign: 'middle' }} /> TLS 1.3 Encrypted Transaction.
                </p>
            </motion.div>
        </div>
    );
};

// --- COMPONENTE: PARTÍCULAS ---
const FloatingParticles = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                style={{
                    position: 'absolute', width: Math.random() * 3 + 1 + 'px', height: Math.random() * 3 + 1 + 'px',
                    background: i % 2 === 0 ? 'var(--gold-primary)' : 'rgba(255,255,255,0.3)',
                    left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
                    boxShadow: '0 0 5px rgba(255,255,255,0.5)'
                }}
                animate={{ y: [0, -1000], opacity: [0, 0.8, 0], x: Math.random() * 50 - 25 }}
                transition={{ duration: Math.random() * 20 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
            />
        ))}
    </div>
);

const UserLobby = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ranking'); 
  const videoRef = useRef(null);
  
  // Estados Globales
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPost, setNewPost] = useState('');
  const [userCoins, setUserCoins] = useState(850); 
  
  // Estados de Interacción
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [selectedPack, setSelectedPack] = useState(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5; 
  }, []);

  // --- LOGICA ---
  const checkProfanity = (text) => BAD_WORDS.some(word => text.toLowerCase().includes(word));

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim()) { toast.error('Escribe algo antes de enviar.'); return; }
    if (checkProfanity(newPost)) { toast.error('Lenguaje ofensivo detectado.', { icon: '🚫' }); return; }

    const post = { id: Date.now(), author: user?.username || 'Viajero', role: 'USER', content: newPost, likes: 0, time: 'Ahora mismo', comments: [] };
    setPosts([post, ...posts]);
    setNewPost('');
    toast.success('¡Mensaje enviado a la Taberna! +5 XP');
  };

  const handleLike = (id) => {
      setPosts(posts.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
      toast('¡Distinguido! +1 XP Social', { icon: '👍', style: { background: '#333', color: '#fff' } });
  };

  const handleCommentSubmit = (postId) => {
      if (!commentText.trim()) return;
      if (checkProfanity(commentText)) { toast.error('Comentario bloqueado.', { icon: '🤐' }); return; }

      const updatedPosts = posts.map(post => {
          if (post.id === postId) {
              return { ...post, comments: [...post.comments, { id: Date.now(), author: user?.username || 'Yo', text: commentText }] };
          }
          return post;
      });
      setPosts(updatedPosts);
      setCommentText('');
      toast.success('Respuesta publicada.');
  };

  const handleBuyItem = (item) => {
      if (userCoins >= item.price) {
          setUserCoins(prev => prev - item.price);
          toast.custom((t) => (
            <div style={{ padding: '15px', background: '#1a1a2e', border: '1px solid #ffd700', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}>
                <Check color="#ffd700" /> 
                <div><strong>¡Objeto Adquirido!</strong><div style={{fontSize: '0.8rem'}}>{item.name} añadido al inventario.</div></div>
            </div>
          ));
      } else {
          toast.error(`Te faltan ${item.price - userCoins} monedas.`, { icon: '🔒' });
      }
  };

  const initPurchase = (pack) => setSelectedPack(pack);

  const finalizePurchase = () => {
      if (selectedPack) {
          setUserCoins(prev => prev + selectedPack.amount);
          toast.success(`¡Pago Exitoso! +${selectedPack.amount} Monedas.`, { duration: 5000, icon: '💳' });
          setSelectedPack(null);
      }
  };

  const handleLogout = () => {
    toast('Sincronizando...', { icon: '☁️' });
    setTimeout(() => { logout(); navigate('/'); }, 1000);
  };

  const handleDownload = () => toast.success('Descarga iniciada.', { duration: 3000 });

  const tabVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
      exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', color: '#fff' }}>
      
      {/* BACKGROUND */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(13, 9, 21, 0.85)', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, transparent 0%, #000 120%)', zIndex: 2 }}></div>
        <FloatingParticles />
        <video ref={videoRef} src={bgVideo} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* MODAL DE PAGO */}
      <AnimatePresence>
          {selectedPack && <PaymentModal pack={selectedPack} onClose={() => setSelectedPack(null)} onConfirm={finalizePurchase} />}
      </AnimatePresence>

      {/* HEADER */}
      <header style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'linear-gradient(to bottom, rgba(13, 9, 21, 0.95), transparent)', borderBottom: '1px solid rgba(247, 210, 122, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <motion.div whileHover={{ scale: 1.1, boxShadow: '0 0 20px var(--gold-primary)' }} style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold-primary))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                <User size={35} color="#1a0f26" />
            </motion.div>
            <div>
                <h2 className="text-rpg-gold" style={{ fontSize: '1.4rem', margin: 0, letterSpacing: '1px' }}>{user?.username || 'JUGADOR'}</h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '5px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#4caf50', fontFamily: 'var(--font-pixel)', background: 'rgba(76, 175, 80, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>LVL {user?.level || 1}</span>
                    <motion.span 
                        key={userCoins} 
                        initial={{ scale: 1.2, color: '#fff' }} animate={{ scale: 1, color: 'var(--gold-primary)' }}
                        style={{ fontSize: '0.8rem', fontFamily: 'var(--font-pixel)', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(247, 210, 122, 0.1)', padding: '2px 10px', borderRadius: '4px', border: '1px solid rgba(247, 210, 122, 0.3)' }}
                    >
                        <Coins size={14} /> {userCoins}
                    </motion.span>
                </div>
            </div>
        </div>
        <motion.button whileHover={{ scale: 1.05, color: '#e94560', borderColor: '#e94560' }} whileTap={{ scale: 0.95 }} onClick={handleLogout} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(233, 69, 96, 0.5)', color: '#ffadad', padding: '10px 20px', cursor: 'pointer', fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '4px' }}>
          <LogOut size={14} /> SALIR
        </motion.button>
      </header>

      {/* NAV */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', gap: '15px', margin: '30px 0', flexWrap: 'wrap' }}>
        <TabButton icon={<Trophy size={18} />} label="RANKING" active={activeTab === 'ranking'} onClick={() => setActiveTab('ranking')} />
        <TabButton icon={<MessageSquare size={18} />} label="FORO" active={activeTab === 'forum'} onClick={() => setActiveTab('forum')} />
        <TabButton icon={<ShoppingCart size={18} />} label="TIENDA" active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />
        <TabButton icon={<Bell size={18} />} label="NOTICIAS" active={activeTab === 'news'} onClick={() => setActiveTab('news')} />
        <TabButton icon={<Download size={18} />} label="DESCARGA" active={activeTab === 'download'} onClick={() => setActiveTab('download')} />
      </div>

      {/* CONTENT */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', paddingBottom: '50px' }}>
        <AnimatePresence mode='wait'>
            
            {/* RANKING CON TILT 3D */}
            {activeTab === 'ranking' && (
                <TiltCard className="rpg-panel" style={{ padding: 0, background: 'rgba(26, 18, 43, 0.8)', overflow: 'hidden' }}>
                    <motion.div key="ranking" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                        <div style={{ padding: '30px', textAlign: 'center', background: 'linear-gradient(to bottom, rgba(247, 210, 122, 0.1), transparent)' }}>
                            <h3 className="text-rpg-gold" style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><Trophy size={24} color="var(--gold-primary)" /> SALÓN DE LA FAMA</h3>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 3fr 2fr 1fr', padding: '10px 20px', color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-pixel)', textTransform: 'uppercase' }}><span>#</span><span>JUGADOR</span><span>CLASE</span><span style={{ textAlign: 'right' }}>XP</span></div>
                            {LEADERBOARD_DATA.map((player) => {
                                let rankColor = '#fff'; let rowBg = 'transparent';
                                if (player.rank === 1) { rankColor = '#ffd700'; rowBg = 'rgba(255, 215, 0, 0.15)'; }
                                else if (player.rank === 2) { rankColor = '#c0c0c0'; rowBg = 'rgba(192, 192, 192, 0.1)'; }
                                else if (player.rank === 3) { rankColor = '#cd7f32'; rowBg = 'rgba(205, 127, 50, 0.1)'; }
                                const isMe = user && player.username.toLowerCase() === user.username.toLowerCase();
                                return (
                                    <motion.div whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }} key={player.rank} style={{ display: 'grid', gridTemplateColumns: '0.5fr 3fr 2fr 1fr', padding: '15px 20px', marginBottom: '5px', borderRadius: '4px', background: isMe ? 'rgba(76, 175, 80, 0.2)' : rowBg, borderLeft: isMe ? '4px solid #4caf50' : (player.rank <= 3 ? `4px solid ${rankColor}` : '4px solid transparent'), alignItems: 'center' }}>
                                        <span style={{ fontFamily: 'var(--font-rpg)', fontSize: '1.2rem', color: rankColor }}>{player.rank}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>{player.rank === 1 && <Trophy size={14} color="#ffd700" />}<span style={{ fontWeight: isMe ? 'bold' : 'normal', color: isMe ? '#4caf50' : '#fff' }}>{player.username}</span>{isMe && <span style={{ fontSize: '0.6rem', background: '#4caf50', color: '#000', padding: '2px 4px', borderRadius: '3px' }}>TÚ</span>}</div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{player.class}</span>
                                        <span style={{ textAlign: 'right', fontFamily: 'var(--font-pixel)', color: rankColor }}>{player.xp}</span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </TiltCard>
            )}

            {/* TIENDA CON EFECTOS 3D EN ITEMS */}
            {activeTab === 'shop' && (
                <motion.div key="shop" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                    {/* ITEMS */}
                    <div className="rpg-panel" style={{ padding: '30px', marginBottom: '30px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)' }}>
                        <h3 className="text-rpg-gold" style={{ marginBottom: '20px', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}><ShoppingCart size={20}/> MERCADO NEGRO (Items)</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
                            {SHOP_ITEMS.map(item => (
                                <TiltCard key={item.id} style={{ height: '100%' }}>
                                    <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ width: '60px', height: '60px', background: item.color, borderRadius: '12px', margin: '0 auto 15px', boxShadow: `0 0 20px ${item.color}60` }}></div>
                                            <h4 style={{ margin: '5px 0', fontSize: '1rem', fontFamily: 'var(--font-rpg)' }}>{item.name}</h4>
                                            <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '15px', lineHeight: '1.4' }}>{item.desc}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--gold-primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>{item.price} G</p>
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleBuyItem(item)} style={{ width: '100%', padding: '10px', background: 'linear-gradient(90deg, var(--gold-dark), #4a3b1a)', border: '1px solid var(--gold-primary)', color: '#fff', fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '4px' }}>COMPRAR</motion.button>
                                        </div>
                                    </div>
                                </TiltCard>
                            ))}
                        </div>
                    </div>

                    {/* PACKS DE MONEDAS */}
                    <div className="rpg-panel" style={{ padding: '30px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)' }}>
                        <h3 className="text-rpg-gold" style={{ marginBottom: '20px', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}><CreditCard size={20}/> BANCO CENTRAL</h3>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            {COIN_PACKS.map(pack => (
                                <TiltCard key={pack.id} style={{ flex: 1, minWidth: '200px' }}>
                                    <div style={{ background: 'linear-gradient(to bottom, rgba(76, 175, 80, 0.15), rgba(0,0,0,0.4))', border: '1px solid #4caf50', borderRadius: '12px', padding: '25px', textAlign: 'center', position: 'relative', height: '100%' }}>
                                        {pack.bonus && <span style={{ position: 'absolute', top: '-10px', right: '10px', background: '#e94560', color: '#fff', fontSize: '0.6rem', padding: '4px 8px', borderRadius: '4px', fontFamily: 'var(--font-pixel)', boxShadow: '0 0 10px #e94560' }}>{pack.bonus}</span>}
                                        <Coins size={50} color="#4caf50" style={{ marginBottom: '15px', filter: 'drop-shadow(0 0 10px #4caf50)' }} />
                                        <h2 style={{ margin: '5px 0', color: '#fff', fontSize: '2rem' }}>{pack.amount}</h2>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Monedas Quest</p>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => initPurchase(pack)} className="btn-hero" style={{ width: '100%', marginTop: '20px', background: '#4caf50', border: 'none', color: '#fff', boxShadow: '0 0 15px rgba(76,175,80,0.3)' }}>{pack.price} USD</motion.button>
                                    </div>
                                </TiltCard>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* FORO */}
            {activeTab === 'forum' && (
              <motion.div key="forum" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="rpg-panel" style={{ padding: '30px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)' }}>
                <h3 className="text-rpg-gold" style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>CHAT DEL GREMIO</h3>
                <form onSubmit={handlePostSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                    <input type="text" value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Comparte tus hazañas..." className="rpg-input" style={{ flex: 1, background: 'rgba(0,0,0,0.4)', padding: '15px', border: '1px solid rgba(247, 210, 122, 0.2)', color: '#fff' }} />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="btn-hero" style={{ padding: '0 25px' }}><Send size={20}/></motion.button>
                </form>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                    {posts.map(post => (
                        <motion.div layout key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', borderLeft: post.role === 'ADMIN' ? '4px solid var(--gold-primary)' : '4px solid #4caf50', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: 'bold', color: post.role === 'ADMIN' ? 'var(--gold-primary)' : '#fff', fontFamily: 'var(--font-body)' }}>{post.author}</span>
                                    {post.role === 'ADMIN' && <Shield size={12} color="var(--gold-primary)" />}
                                </div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{post.time}</span>
                            </div>
                            <p style={{ color: '#ddd', fontSize: '0.95rem', marginBottom: '15px', lineHeight: '1.5' }}>{post.content}</p>
                            
                            <div style={{ display: 'flex', gap: '15px', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '10px' }}>
                                <motion.button onClick={() => handleLike(post.id)} whileHover={{ scale: 1.1, color: '#4caf50' }} whileTap={{ scale: 0.9 }} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.8rem' }}><ThumbsUp size={14} /> {post.likes} XP</motion.button>
                                <motion.button onClick={() => setActiveCommentBox(activeCommentBox === post.id ? null : post.id)} whileHover={{ scale: 1.1, color: '#f7d27a' }} whileTap={{ scale: 0.9 }} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.8rem' }}><MessageCircle size={14} /> {post.comments.length} Comentarios</motion.button>
                            </div>

                            <AnimatePresence>
                                {(activeCommentBox === post.id || post.comments.length > 0) && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                        {post.comments.length > 0 && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px', paddingLeft: '15px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                                                {post.comments.map(comment => (
                                                    <div key={comment.id} style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>
                                                        <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{comment.author}: </span>
                                                        <span style={{ color: '#ccc' }}>{comment.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {activeCommentBox === post.id && (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Escribe una respuesta..." style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '4px', fontSize: '0.8rem' }} autoFocus />
                                                <button onClick={() => handleCommentSubmit(post.id)} style={{ background: 'var(--gold-dark)', border: 'none', color: '#000', padding: '0 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>ENVIAR</button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* NOTICIAS */}
            {activeTab === 'news' && (
              <motion.div key="news" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                 {PATCH_NOTES.map((patch, index) => (
                     <motion.div whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.02)' }} key={index} className="rpg-panel" style={{ padding: '30px', marginBottom: '20px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)', borderLeft: '4px solid var(--gold-primary)' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                             <h3 style={{ margin: 0, color: 'var(--gold-primary)', fontFamily: 'var(--font-rpg)', fontSize: '1.3rem' }}>{patch.title}</h3>
                             <span style={{ background: 'rgba(247, 210, 122, 0.1)', color: 'var(--gold-primary)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.7rem', fontFamily: 'var(--font-pixel)', border: '1px solid rgba(247, 210, 122, 0.3)' }}>{patch.version}</span>
                         </div>
                         <p style={{ color: '#ccc', lineHeight: '1.6' }}>{patch.desc}</p>
                         <div style={{ marginTop: '15px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '10px' }}>Publicado el: <span style={{ color: '#fff' }}>{patch.date}</span></div>
                     </motion.div>
                 ))}
              </motion.div>
            )}

            {/* DESCARGA SIN 3D (ESTÁTICA PARA CENTRADO) */}
            {activeTab === 'download' && (
               <motion.div key="download" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="rpg-panel" style={{ padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)' }}>
                   <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: '120px', height: '120px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #4caf50', boxShadow: '0 0 30px rgba(76, 175, 80, 0.2)' }}>
                       <Download size={60} color="#4caf50" />
                   </motion.div>
                   <div><h2 className="text-rpg-gold" style={{ fontSize: '2rem', marginBottom: '10px' }}>CLIENTE DE ESCRITORIO</h2><span style={{ fontFamily: 'var(--font-pixel)', color: '#4caf50', fontSize: '0.9rem' }}>VERSIÓN 1.0.4 (STABLE)</span></div>
                   <p style={{ maxWidth: '500px', color: '#ccc', lineHeight: '1.8', fontSize: '1rem' }}>La herramienta definitiva para gamificar tu productividad. Instala el cliente para sincronizar tus tareas, ganar XP automáticamente y subir de nivel en la vida real.</p>
                   <div style={{ marginTop: '20px' }}>
                       <motion.button onClick={handleDownload} whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(76, 175, 80, 0.4)' }} whileTap={{ scale: 0.95 }} className="btn-hero" style={{ padding: '18px 50px', fontSize: '1.2rem', background: 'linear-gradient(to bottom, #4caf50, #2e7d32)', border: '1px solid #81c784', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>DESCARGAR INSTALADOR</motion.button>
                   </div>
                   <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' }}>Compatible con Windows 10/11 • 64-bit • Tamaño: 145 MB</p>
               </motion.div>
            )}

        </AnimatePresence>
      </div>
    </div>
  );
};

const TabButton = ({ icon, label, active, onClick }) => (
    <motion.button onClick={onClick} whileHover={{ scale: 1.05, backgroundColor: active ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.95 }} style={{ background: active ? 'var(--gold-primary)' : 'rgba(0,0,0,0.4)', color: active ? '#1a0f26' : 'rgba(255,255,255,0.7)', border: active ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)', padding: '12px 25px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', borderRadius: '4px', backdropFilter: 'blur(5px)', boxShadow: active ? '0 0 20px rgba(247, 210, 122, 0.4)' : 'none', fontWeight: active ? 'bold' : 'normal' }}>
        {icon} {label}
    </motion.button>
);

export default UserLobby;