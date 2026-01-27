import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Download, ShieldAlert, Trash2, Edit, LogOut, MessageSquare, AlertTriangle, CheckCircle, Activity, Terminal, ShoppingCart, Coins, PlusCircle, MinusCircle, Gift, DollarSign, TrendingUp, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';

import bgVideo from '../assets/videos/background.mp4';

// --- DATOS SIMULADOS ---
const INITIAL_USERS = [
  { id: 1, name: 'PlayerOne', role: 'USER', status: 'Active', lvl: 12, coins: 850 },
  { id: 2, name: 'DarkMage', role: 'USER', status: 'Banned', lvl: 45, coins: 12000 },
  { id: 3, name: 'SysAdmin', role: 'ADMIN', status: 'Active', lvl: 99, coins: 999999 },
  { id: 4, name: 'NoobSlayer', role: 'USER', status: 'Active', lvl: 5, coins: 150 },
  { id: 5, name: 'GlitchHunter', role: 'USER', status: 'Warning', lvl: 23, coins: 3400 },
];

const INITIAL_SHOP_ITEMS = [
    { id: 1, name: 'Marco Dorado', price: 500, type: 'frame', color: '#ffd700' },
    { id: 2, name: 'Skin Cyberpunk', price: 1200, type: 'skin', color: '#00f3ff' },
    { id: 3, name: 'Título: "Leyenda"', price: 3000, type: 'title', color: '#ff0055' },
    { id: 4, name: 'Boost XP (1h)', price: 250, type: 'consumable', color: '#4caf50' },
];

const INITIAL_POSTS = [
    { 
        id: 1, 
        author: 'NoobMaster69', 
        role: 'USER', 
        content: '¿Cómo hackeo el sistema para tener oro infinito?', 
        likes: 5, 
        time: 'Hace 2h', 
        reports: 5, 
        status: 'Flagged',
        comments: [
            { id: 101, author: 'TrollUser', text: 'Yo te enseño, manda DM' },
            { id: 102, author: 'GoodGuy', text: 'Eso es ilegal, te van a banear.' }
        ]
    },
    { 
        id: 2, 
        author: 'PixelArtist', 
        role: 'USER', 
        content: 'Aquí les dejo mi fanart del boss final.', 
        likes: 120, 
        time: 'Hace 5h', 
        reports: 0, 
        status: 'Clean',
        comments: []
    },
    { 
        id: 3, 
        author: 'TrollUser', 
        role: 'USER', 
        content: 'Este juego es una basura xdxdxd', 
        likes: 0, 
        time: 'Hace 10m', 
        reports: 12, 
        status: 'Flagged',
        comments: []
    },
];

// Datos Gráfico XP (Dashboard General)
const GRAPH_DATA = [
  { name: 'LUN', xp: 2000, users: 120 },
  { name: 'MAR', xp: 3000, users: 139 },
  { name: 'MIE', xp: 2000, users: 980 },
  { name: 'JUE', xp: 2780, users: 390 },
  { name: 'VIE', xp: 1890, users: 480 },
  { name: 'SAB', xp: 2390, users: 380 },
  { name: 'DOM', xp: 3490, users: 430 },
];

// Datos Gráfico Ganancias (Economía)
const EARNINGS_DATA = [
    { name: 'SEM 1', income: 150, sales: 20 },
    { name: 'SEM 2', income: 230, sales: 35 },
    { name: 'SEM 3', income: 180, sales: 25 },
    { name: 'SEM 4', income: 340, sales: 50 },
];

// Logs del Sistema
const SYSTEM_LOGS = [
    { time: '10:42:05', type: 'INFO', msg: 'User [PlayerOne] logged in.' },
    { time: '10:42:12', type: 'WARN', msg: 'High latency detected in Sector 7.' },
    { time: '10:43:00', type: 'SUCCESS', msg: 'Backup completed successfully.' },
    { time: '10:45:20', type: 'ERROR', msg: 'Failed to sync with .EXE client (User #44).' },
    { time: '10:46:01', type: 'INFO', msg: 'New patch v1.0.5 ready for deployment.' },
];

// --- COMPONENTE: PARTÍCULAS ---
const FloatingParticles = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {[...Array(15)].map((_, i) => (
            <motion.div
                key={i}
                style={{
                    position: 'absolute', width: Math.random() * 4 + 1 + 'px', height: Math.random() * 4 + 1 + 'px',
                    background: 'rgba(76, 175, 80, 0.2)', left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
                }}
                animate={{ y: [0, -100, 0], opacity: [0, 0.5, 0] }}
                transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
            />
        ))}
    </div>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const videoRef = useRef(null);
  
  // Estados Locales
  const [users, setUsers] = useState(INITIAL_USERS);
  const [forumPosts, setForumPosts] = useState(INITIAL_POSTS);
  const [shopItems, setShopItems] = useState(INITIAL_SHOP_ITEMS);
  const [systemLogs, setSystemLogs] = useState(SYSTEM_LOGS);

  // Estados para Edición en Moderación
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5;
  }, []);

  const addLog = (type, msg) => {
      const time = new Date().toLocaleTimeString();
      setSystemLogs(prev => [{ time, type, msg }, ...prev]);
  };

  const handleLogout = () => {
    toast('Cerrando sesión segura...', { icon: '🔒' });
    setTimeout(() => { logout(); navigate('/'); }, 1000);
  };

  // --- LÓGICA DE USUARIOS ---
  const deleteUser = (id) => {
      if(window.confirm('¿Confirmar eliminación permanente del usuario?')) {
          setUsers(users.filter(u => u.id !== id));
          addLog('WARN', `User #${id} deleted by Admin.`);
          toast.success(`Usuario #${id} eliminado.`);
      }
  };

  const modifyUserCoins = (id, amount) => {
      setUsers(users.map(u => {
          if (u.id === id) {
              const newAmount = u.coins + amount;
              return { ...u, coins: newAmount < 0 ? 0 : newAmount };
          }
          return u;
      }));
      const type = amount > 0 ? 'Grant' : 'Penalty';
      addLog('INFO', `Coin ${type}: ${amount} coins to User #${id}.`);
      toast.success(`${type === 'Grant' ? 'Abonadas' : 'Descontadas'} ${Math.abs(amount)} monedas.`);
  };

  // --- LÓGICA DE TIENDA Y ECONOMÍA ---
  const deleteShopItem = (id) => {
      setShopItems(shopItems.filter(item => item.id !== id));
      addLog('WARN', `Shop Item #${id} removed from marketplace.`);
      toast.error('Item eliminado de la tienda.');
  };

  const addShopItem = () => {
      const newItem = { id: Date.now(), name: 'Item Nuevo (WIP)', price: 1000, type: 'special', color: '#fff' };
      setShopItems([...shopItems, newItem]);
      addLog('SUCCESS', 'New item added to shop database.');
      toast.success('Nuevo item borrador creado.');
  };

  const globalAirdrop = () => {
      if(window.confirm('¿Enviar 500 monedas a TODOS los usuarios?')) {
          setUsers(users.map(u => ({ ...u, coins: u.coins + 500 })));
          addLog('SUCCESS', 'Global Airdrop executed: +500 coins per user.');
          toast.success('¡Airdrop global enviado!', { icon: '🎁' });
      }
  }

  // --- LÓGICA DE MODERACIÓN (EDICIÓN Y BORRADO) ---
  const startEditPost = (post) => {
      setEditingPostId(post.id);
      setEditContent(post.content);
  };

  const saveEditPost = (id) => {
      setForumPosts(forumPosts.map(p => p.id === id ? { ...p, content: editContent, status: 'Clean' } : p)); // Al editarlo asumimos que el admin lo limpió
      setEditingPostId(null);
      addLog('INFO', `Post #${id} edited by Admin.`);
      toast.success('Contenido actualizado correctamente.');
  };

  const cancelEditPost = () => {
      setEditingPostId(null);
      setEditContent('');
  };

  const deletePost = (id) => {
      setForumPosts(forumPosts.filter(p => p.id !== id));
      addLog('WARN', `Post #${id} censored.`);
      toast.error('Contenido eliminado.');
  };

  const approvePost = (id) => {
      setForumPosts(forumPosts.map(p => p.id === id ? {...p, status: 'Clean'} : p));
      addLog('INFO', `Post #${id} marked as safe.`);
      toast.success('Contenido aprobado.');
  };

  const handleUploadPatch = () => {
      const loadingToast = toast.loading('Compilando binarios v1.0.5...');
      setTimeout(() => {
          toast.dismiss(loadingToast);
          addLog('SUCCESS', 'Patch v1.0.5 deployed to CDN.');
          toast.success('Parche desplegado.', { duration: 4000 });
      }, 2000);
  };

  const tabVariants = {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
      exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  // --- UI MODULES ---

  const StatsCard = ({ title, value, icon, color }) => (
    <motion.div whileHover={{ y: -5, boxShadow: `0 0 20px ${color}40` }} className="rpg-panel" style={{ padding: '25px', flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: `4px solid ${color}`, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)' }}>
      <div style={{ padding: '15px', background: `${color}20`, borderRadius: '50%', color: color }}>{icon}</div>
      <div>
        <h3 style={{ margin: 0, fontSize: '2rem', fontFamily: 'var(--font-rpg)', color: '#fff' }}>{value}</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
      </div>
    </motion.div>
  );

  const ActivityChart = () => (
      <div className="rpg-panel" style={{ padding: '20px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)', height: '350px', marginTop: '30px' }}>
          <h3 className="text-rpg-gold" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity size={20}/> FLUJO DE XP GLOBAL</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={GRAPH_DATA}>
                <defs><linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/><stop offset="95%" stopColor="#4caf50" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888" tick={{fontFamily: 'var(--font-pixel)', fontSize: 10}} />
                <YAxis stroke="#888" tick={{fontFamily: 'var(--font-pixel)', fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: '#0d0915', border: '1px solid #4caf50', borderRadius: '5px' }} itemStyle={{ color: '#4caf50', fontFamily: 'var(--font-body)' }} />
                <Area type="monotone" dataKey="xp" stroke="#4caf50" fillOpacity={1} fill="url(#colorXp)" />
            </AreaChart>
          </ResponsiveContainer>
      </div>
  );

  const SystemConsole = () => (
      <div className="rpg-panel" style={{ padding: '20px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.85)', border: '1px solid #333', marginTop: '30px', fontFamily: 'monospace', height: '350px', overflow: 'hidden' }}>
          <h4 style={{ color: '#888', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><Terminal size={14}/> SYSTEM_LOGS.TXT</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', overflowY: 'auto' }}>
              {systemLogs.map((log, i) => (
                  <div key={i} style={{ fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                      <span style={{ color: '#555', marginRight: '10px' }}>[{log.time}]</span>
                      <span style={{ color: log.type === 'ERROR' ? '#ff4d4d' : log.type === 'WARN' ? '#f7d27a' : log.type === 'SUCCESS' ? '#4caf50' : '#888', fontWeight: 'bold', marginRight: '10px' }}>{log.type}</span>
                      <span style={{ color: '#ccc' }}>{log.msg}</span>
                  </div>
              ))}
              <div style={{ color: '#4caf50', animation: 'blink 1s infinite' }}>_</div>
          </div>
      </div>
  );

  const UsersTable = () => (
    <div className="rpg-panel" style={{ padding: '25px', overflowX: 'auto', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="text-rpg-gold" style={{ margin: 0 }}>BASE DE DATOS DE USUARIOS</h3>
          <span style={{ fontSize: '0.8rem', color: '#4caf50' }}>{users.length} REGISTROS ACTIVOS</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--gold-dark)', textAlign: 'left' }}>
            <th style={{ padding: '15px' }}>ID</th><th style={{ padding: '15px' }}>USUARIO</th><th style={{ padding: '15px' }}>ROL</th><th style={{ padding: '15px' }}>NIVEL</th><th style={{ padding: '15px' }}>SALDO</th><th style={{ padding: '15px' }}>ESTADO</th><th style={{ padding: '15px' }}>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '15px', fontFamily: 'var(--font-pixel)', color: 'var(--text-muted)' }}>#{u.id}</td>
              <td style={{ padding: '15px', fontWeight: 'bold', color: '#fff' }}>{u.name}</td>
              <td style={{ padding: '15px' }}><span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', background: u.role === 'ADMIN' ? 'rgba(247, 210, 122, 0.2)' : 'rgba(255,255,255,0.1)', color: u.role === 'ADMIN' ? 'var(--gold-primary)' : '#fff' }}>{u.role}</span></td>
              <td style={{ padding: '15px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ height: '6px', width: '50px', background: '#333', borderRadius: '3px' }}><div style={{ height: '100%', width: `${u.lvl}%`, background: '#4caf50', borderRadius: '3px' }}></div></div><span style={{ fontSize: '0.8rem' }}>{u.lvl}</span></div></td>
              <td style={{ padding: '15px', color: 'var(--gold-primary)', fontFamily: 'var(--font-pixel)', fontSize: '0.8rem' }}>{u.coins}</td>
              <td style={{ padding: '15px' }}><span style={{ color: u.status === 'Active' ? '#4caf50' : '#e94560', display: 'flex', alignItems: 'center', gap: '5px' }}>{u.status === 'Active' ? <CheckCircle size={14}/> : <ShieldAlert size={14}/>} {u.status}</span></td>
              <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                <button onClick={() => modifyUserCoins(u.id, 100)} title="+100 Monedas" style={{ background: 'transparent', border: '1px solid #4caf50', color: '#4caf50', borderRadius: '4px', cursor: 'pointer', padding: '4px' }}><PlusCircle size={14}/></button>
                <button onClick={() => modifyUserCoins(u.id, -100)} title="-100 Monedas" style={{ background: 'transparent', border: '1px solid #f7d27a', color: '#f7d27a', borderRadius: '4px', cursor: 'pointer', padding: '4px' }}><MinusCircle size={14}/></button>
                <button onClick={() => deleteUser(u.id)} title="Eliminar" style={{ background: 'transparent', border: '1px solid #e94560', color: '#e94560', borderRadius: '4px', cursor: 'pointer', padding: '4px' }}><Trash2 size={14}/></button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // --- NUEVO: GESTIÓN DE ECONOMÍA CON GRÁFICOS ---
  const EconomyManager = () => (
      <div className="rpg-panel" style={{ padding: '25px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)' }}>
          {/* HEADER ECONOMÍA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>
                  <h3 className="text-rpg-gold" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShoppingCart size={24}/> ECONOMÍA & MERCADO
                  </h3>
                  <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>Gestión de items, airdrops y análisis financiero.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                  <motion.button onClick={globalAirdrop} whileHover={{ scale: 1.05 }} className="btn-hero" style={{ fontSize: '0.8rem', padding: '10px 20px', background: '#e94560', border: 'none' }}><Gift size={16} style={{marginRight:'5px'}}/> AIRDROP GLOBAL</motion.button>
                  <motion.button onClick={addShopItem} whileHover={{ scale: 1.05 }} className="btn-hero" style={{ fontSize: '0.8rem', padding: '10px 20px' }}><PlusCircle size={16} style={{marginRight:'5px'}}/> NUEVO ITEM</motion.button>
              </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              {/* GRÁFICO DE GANANCIAS */}
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '20px', height: '300px' }}>
                  <h4 style={{ color: '#4caf50', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><DollarSign size={18}/> INGRESOS REALES (USD)</h4>
                  <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={EARNINGS_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="name" stroke="#888" tick={{fontFamily: 'var(--font-pixel)', fontSize: 10}} />
                          <YAxis stroke="#888" tick={{fontFamily: 'var(--font-pixel)', fontSize: 10}} />
                          <Tooltip contentStyle={{ backgroundColor: '#0d0915', border: '1px solid #4caf50' }} />
                          <Legend />
                          <Bar dataKey="income" name="Ingresos ($)" fill="#4caf50" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="sales" name="Ventas (Uni)" fill="#f7d27a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>

              {/* LISTA DE ITEMS */}
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '20px', overflowY: 'auto', height: '300px' }}>
                  <h4 style={{ color: '#f7d27a', margin: '0 0 20px 0' }}>ITEMS ACTIVOS EN TIENDA</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                      {shopItems.map(item => (
                          <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', textAlign: 'center', position: 'relative' }}>
                              <button onClick={() => deleteShopItem(item.id)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', color: '#e94560', cursor: 'pointer' }}><Trash2 size={14}/></button>
                              <div style={{ width: '30px', height: '30px', background: item.color, borderRadius: '4px', margin: '0 auto 5px', boxShadow: `0 0 5px ${item.color}` }}></div>
                              <h5 style={{ margin: '5px 0', color: '#fff', fontSize: '0.8rem' }}>{item.name}</h5>
                              <p style={{ color: 'var(--gold-primary)', fontWeight: 'bold', fontSize: '0.7rem' }}>{item.price} G</p>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  // --- MODERACIÓN TIPO FORO (MEJORADA) ---
  const ForumModeration = () => (
    <div className="rpg-panel" style={{ padding: '25px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)' }}>
        <h3 className="text-rpg-gold" style={{ marginBottom: '20px' }}>MODERACIÓN DE CONTENIDO</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {forumPosts.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: '#4caf50' }}>¡Comunidad limpia!</div> : forumPosts.map(post => (
                <motion.div layout key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', borderLeft: post.status === 'Flagged' ? '4px solid #e94560' : '4px solid #4caf50', border: '1px solid rgba(255,255,255,0.05)' }}>
                    
                    {/* CABECERA POST */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: '#fff' }}>{post.author}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{post.time}</span>
                                {post.status === 'Flagged' && <span style={{ background: 'rgba(233, 69, 96, 0.2)', color: '#ffadad', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={10}/> {post.reports} REPORTES</span>}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Role: {post.role}</div>
                        </div>
                        
                        {/* CONTROLES DE ADMIN */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {editingPostId === post.id ? (
                                <>
                                    <button onClick={() => saveEditPost(post.id)} style={{ background: '#4caf50', color: '#000', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}><Save size={14}/> GUARDAR</button>
                                    <button onClick={cancelEditPost} style={{ background: '#555', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}><X size={14}/></button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => startEditPost(post)} title="Editar Contenido" style={{ background: 'transparent', border: '1px solid #f7d27a', color: '#f7d27a', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Edit size={16}/></button>
                                    <button onClick={() => approvePost(post.id)} title="Aprobar (Quitar Reporte)" style={{ background: 'transparent', border: '1px solid #4caf50', color: '#4caf50', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><CheckCircle size={16}/></button>
                                    <button onClick={() => deletePost(post.id)} title="Eliminar Definitivamente" style={{ background: 'transparent', border: '1px solid #e94560', color: '#e94560', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16}/></button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* CONTENIDO DEL POST (EDITABLE) */}
                    {editingPostId === post.id ? (
                        <textarea 
                            value={editContent} 
                            onChange={(e) => setEditContent(e.target.value)} 
                            style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--gold-primary)', color: '#fff', padding: '10px', borderRadius: '4px', minHeight: '60px' }}
                        />
                    ) : (
                        <p style={{ color: '#ddd', fontSize: '0.95rem', marginBottom: '15px', lineHeight: '1.5', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '4px' }}>{post.content}</p>
                    )}

                    {/* COMENTARIOS ANIDADOS (VISUALIZACIÓN) */}
                    {post.comments && post.comments.length > 0 && (
                        <div style={{ marginLeft: '20px', paddingLeft: '15px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '5px' }}>HILO DE RESPUESTAS ({post.comments.length})</div>
                            {post.comments.map(comment => (
                                <div key={comment.id} style={{ fontSize: '0.8rem', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{comment.author}: </span>
                                        <span style={{ color: '#ccc' }}>{comment.text}</span>
                                    </div>
                                    <button title="Borrar Comentario" style={{ background: 'transparent', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '0.7rem' }}>[x]</button>
                                </div>
                            ))}
                        </div>
                    )}

                </motion.div>
            ))}
        </div>
    </div>
  );

  const ExeManager = () => (
    <div className="rpg-panel" style={{ padding: '40px', textAlign: 'center', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 18, 43, 0.7)' }}>
      <Download size={60} color="var(--gold-primary)" style={{ marginBottom: '20px' }} />
      <h3 className="text-rpg-gold" style={{ fontSize: '1.5rem' }}>DEPLOY CENTER (.EXE)</h3>
      <div style={{ margin: '30px auto', maxWidth: '500px', background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}><span style={{ color: 'var(--text-muted)' }}>Versión Producción:</span><span style={{ color: '#4caf50', fontFamily: 'var(--font-pixel)' }}>v1.0.4-stable</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Descargas Globales:</span><span style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>12,450</span></div>
      </div>
      <motion.button onClick={handleUploadPatch} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-hero" style={{ fontSize: '1rem', background: 'linear-gradient(to bottom, #4caf50, #2e7d32)', border: '1px solid #81c784' }}>SUBIR NUEVO PARCHE</motion.button>
    </div>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', color: '#fff', overflow: 'hidden' }}>
      
      {/* FONDO DE VIDEO (Admin Version) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(13, 9, 21, 0.9)', zIndex: 1 }}></div>
        <FloatingParticles />
        <video ref={videoRef} src={bgVideo} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* SIDEBAR */}
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ width: '260px', padding: '30px 20px', display: 'flex', flexDirection: 'column', background: 'linear-gradient(to right, rgba(13, 9, 21, 0.95), rgba(13, 9, 21, 0.8))', borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--gold-primary)', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(247,210,122,0.3)' }}>
                <ShieldAlert size={30} color="#000" />
            </div>
            <h2 className="text-rpg-gold" style={{ fontSize: '1.2rem', margin: 0 }}>ADMIN CONSOLE</h2>
            <span style={{ fontSize: '0.7rem', color: '#4caf50', fontFamily: 'var(--font-pixel)' }}>ACCESS LEVEL: ROOT</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
          <SidebarButton icon={<Activity size={18}/>} label="DASHBOARD" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
          <SidebarButton icon={<Users size={18}/>} label="USUARIOS" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarButton icon={<ShoppingCart size={18}/>} label="ECONOMÍA" active={activeTab === 'economy'} onClick={() => setActiveTab('economy')} />
          <SidebarButton icon={<MessageSquare size={18}/>} label="MODERACIÓN" active={activeTab === 'forum'} onClick={() => setActiveTab('forum')} />
          <SidebarButton icon={<Download size={18}/>} label="VERSIONES" active={activeTab === 'exe'} onClick={() => setActiveTab('exe')} />
        </nav>
        <motion.button onClick={handleLogout} style={{ marginTop: 'auto', background: 'transparent', border: '1px solid rgba(233, 69, 96, 0.3)', color: '#e94560', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', padding: '12px', borderRadius: '8px', fontSize: '0.8rem' }}>
          <LogOut size={16} /> DESCONECTAR
        </motion.button>
      </motion.div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', position: 'relative', zIndex: 10 }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div><h1 style={{ fontFamily: 'var(--font-rpg)', margin: 0, fontSize: '2rem', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>Bienvenido, {user?.username}</h1></div>
           <div style={{ display: 'flex', gap: '10px' }}><div style={{ width: '10px', height: '10px', background: '#4caf50', borderRadius: '50%', boxShadow: '0 0 10px #4caf50', alignSelf: 'center' }}></div><span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: '#4caf50' }}>SERVER: ONLINE</span></div>
        </header>

        <AnimatePresence mode='wait'>
            {activeTab === 'stats' && (
              <motion.div key="stats" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '30px' }}>
                    <StatsCard title="Usuarios Totales" value="1,240" icon={<Users size={30} />} color="#4caf50" />
                    <StatsCard title="Ingresos (Mes)" value="$4,500" icon={<DollarSign size={30} />} color="#f7d27a" />
                    <StatsCard title="Reportes Activos" value={forumPosts.filter(p => p.status === 'Flagged').length} icon={<ShieldAlert size={30} />} color="#e94560" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>
                    <ActivityChart />
                    <SystemConsole />
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && <motion.div key="users" variants={tabVariants} initial="hidden" animate="visible" exit="exit"><UsersTable /></motion.div>}
            {activeTab === 'economy' && <motion.div key="economy" variants={tabVariants} initial="hidden" animate="visible" exit="exit"><EconomyManager /></motion.div>}
            {activeTab === 'forum' && <motion.div key="forum" variants={tabVariants} initial="hidden" animate="visible" exit="exit"><ForumModeration /></motion.div>}
            {activeTab === 'exe' && <motion.div key="exe" variants={tabVariants} initial="hidden" animate="visible" exit="exit"><ExeManager /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SidebarButton = ({ icon, label, active, onClick }) => (
    <motion.button onClick={onClick} whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }} whileTap={{ scale: 0.98 }} style={{ background: active ? 'linear-gradient(90deg, var(--gold-primary), transparent)' : 'transparent', color: active ? '#000' : 'var(--text-muted)', border: 'none', padding: '12px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: active ? 'bold' : 'normal', borderRadius: '4px', textAlign: 'left', width: '100%', position: 'relative', overflow: 'hidden' }}>
        {icon} {label}
        {active && <motion.div layoutId="active-pill" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#fff' }} />}
    </motion.button>
);

export default AdminDashboard;