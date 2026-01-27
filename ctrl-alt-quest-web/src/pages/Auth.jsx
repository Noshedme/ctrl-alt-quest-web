import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Importamos la lógica de autenticación
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';

import bgVideo from '../assets/videos/background.mp4';

// --- COMPONENTE: PARTÍCULAS ---
const FloatingParticles = () => {
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: Math.random() * 3 + 1 + 'px',
                        height: Math.random() * 3 + 1 + 'px',
                        background: 'rgba(247, 210, 122, 0.4)',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                    }}
                    animate={{
                        y: [0, -60, 0],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    )
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const videoRef = useRef(null);

  // --- LÓGICA DE LOGIN ---
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  const handleLogin = async () => {
      setError('');
      setLoading(true);
      try {
          // 1. Intentamos loguear con el servicio simulado
          const response = await loginUser(username, password);
          
          if (response.success) {
              // 2. Guardamos al usuario en el contexto global
              login(response.user);
              
              // 3. Redirigimos según el ROL
              if (response.user.role === 'ADMIN') {
                  navigate('/admin');
              } else {
                  navigate('/lobby'); // Redirige al lobby de usuario
              }
          }
      } catch (err) {
          setError(err.message || 'Error de conexión');
      } finally {
          setLoading(false);
      }
  };

  // Variantes para la animación
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflow: 'hidden'
    }}>

      {/* --- FONDO --- */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(13, 9, 21, 0.85)', zIndex: 1 }}></div>
        <FloatingParticles />
        <video
          ref={videoRef}
          src={bgVideo}
          autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      {/* --- PANEL PRINCIPAL --- */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="rpg-panel"
        style={{
          position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px', padding: '40px',
          border: '1px solid rgba(247, 210, 122, 0.3)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)', backgroundColor: 'rgba(26, 18, 43, 0.6)'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)' }}></div>
        
        {/* ENCABEZADO */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <motion.div
                key={isLogin ? "title-login" : "title-register"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ textShadow: "2px 2px 0px #e94560", x: [0, -2, 2, 0] }}
            >
                <h2 className="text-rpg-gold" style={{ fontSize: '1.8rem', marginBottom: '10px', letterSpacing: '1px' }}>
                    {isLogin ? 'ACCESO AL SISTEMA' : 'NUEVO RECLUTA'}
                </h2>
            </motion.div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
                {isLogin ? 'Introduce tus credenciales para sincronizar.' : 'Crea tu identidad digital.'}
            </p>
        </div>

        {/* MENSAJE DE ERROR */}
        {error && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ background: 'rgba(233, 69, 96, 0.2)', border: '1px solid #e94560', padding: '10px', borderRadius: '5px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ffadad', fontSize: '0.8rem' }}
            >
                <AlertCircle size={16} /> {error}
            </motion.div>
        )}

        {/* FORMULARIO */}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <AnimatePresence mode='wait'>
                <motion.div
                    key={isLogin ? "login-form" : "register-form"}
                    variants={containerVariants}
                    initial="hidden" animate="show" exit="hidden"
                    style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                    
                    {!isLogin && (
                        <motion.div variants={itemVariants} className="input-group">
                            <Mail size={18} color="var(--gold-dark)" />
                            <input type="email" placeholder="Correo Electrónico" className="rpg-input" />
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="input-group">
                        <User size={18} color="var(--gold-dark)" />
                        <input
                            type="text"
                            placeholder="Nombre de Usuario"
                            className="rpg-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="input-group">
                        <Lock size={18} color="var(--gold-dark)" />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="rpg-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </motion.div>

                    {!isLogin && (
                         <motion.div variants={itemVariants} className="input-group">
                            <ShieldCheck size={18} color="var(--gold-dark)" />
                            <input type="password" placeholder="Confirmar Contraseña" className="rpg-input" />
                        </motion.div>
                    )}

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, boxShadow: "0 0 15px var(--gold-glow)" }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-hero"
                        style={{ marginTop: '10px', width: '100%', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
                        type="button"
                        onClick={isLogin ? handleLogin : () => {}} // Solo login funciona por ahora
                        disabled={loading}
                    >
                        {loading ? 'ACCEDIENDO...' : (isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE')}
                    </motion.button>
                </motion.div>
            </AnimatePresence>
        </form>

        {/* PIE DE PÁGINA */}
        <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '10px' }}>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05, color: '#fff' }}
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{
              background: 'transparent', border: 'none', color: 'var(--gold-primary)',
              cursor: 'pointer', fontFamily: 'var(--font-pixel)', fontSize: '0.7rem',
              textDecoration: 'underline', letterSpacing: '1px'
            }}
          >
            {isLogin ? 'CREAR CUENTA NUEVA' : 'VOLVER AL LOGIN'}
          </motion.button>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <motion.div
                    whileHover={{ x: -5, color: '#4caf50' }}
                    style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                >
                    <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }}/> Volver al Home
                </motion.div>
            </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Auth;