import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'; 
import { Download, Users, ShieldAlert, Sparkles, Zap, Globe, Sword, ChevronDown } from 'lucide-react'; 
import { Link } from 'react-router-dom';

// Importamos el efecto 3D (Asegúrate de haber creado el archivo TiltCard.jsx en components)
import TiltCard from '../components/TiltCard'; 
import bgVideo from '../assets/videos/background.mp4'; 

// --- COMPONENTE 1: TEXTO HACKER (DESENCRIPTADO) ---
const HackerText = ({ text }) => {
    const [displayText, setDisplayText] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&'; // Caracteres "basura"
    
    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(text.split('').map((letter, index) => {
                if(index < iteration) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));
            
            if(iteration >= text.length) clearInterval(interval);
            iteration += 1/3; // Velocidad del efecto
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{displayText}</span>;
};

// --- COMPONENTE 2: CONTADOR NUMÉRICO ANIMADO ---
const CountUp = ({ value, label, icon }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const springValue = useSpring(0, { bounce: 0, duration: 2000 });
    const displayValue = useTransform(springValue, (current) => Math.round(current));

    useEffect(() => {
        if (isInView) {
            // Extraemos solo los números del string (ej: "12,405" -> 12405)
            const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
            springValue.set(numericValue);
        }
    }, [isInView, value, springValue]);

    return (
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <div style={{ color: 'var(--gold-primary)', marginBottom: '5px' }}>{icon}</div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-rpg)', margin: 0, display: 'flex' }}>
                <motion.span>{displayValue}</motion.span>
                {/* Agregamos símbolos extra si el string original los tenía (ej: "k", "%") */}
                <span>{value.replace(/[0-9,.]/g, '')}</span>
            </h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)' }}>{label}</span>
        </div>
    );
};

// --- COMPONENTE 3: PARTÍCULAS FLOTANTES ---
const FloatingParticles = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                style={{
                    position: 'absolute',
                    width: Math.random() * 3 + 1 + 'px',
                    height: Math.random() * 3 + 1 + 'px',
                    background: i % 2 === 0 ? 'var(--gold-primary)' : '#4caf50', // Mezcla de oro y verde
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                }}
                animate={{
                    y: [0, -1000], // Suben más alto
                    opacity: [0, 0.8, 0],
                    x: Math.random() * 50 - 25 // Movimiento lateral aleatorio
                }}
                transition={{
                    duration: Math.random() * 20 + 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 5
                }}
            />
        ))}
    </div>
);

const Home = () => {
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax: El fondo se mueve más lento que el contenido
  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6; // Video un poco más lento para ser cinemático
    }
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden', backgroundColor: '#050505' }}>
      
      {/* --- FONDO CINEMÁTICO PARALLAX --- */}
      <motion.div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '120%', zIndex: 0, y: yBackground }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(13, 9, 21, 0.75)', zIndex: 2 }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, transparent 20%, #000 100%)', zIndex: 3 }}></div> {/* Viñeta */}
        <FloatingParticles />
        <video
          ref={videoRef}
          src={bgVideo}
          autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(3px)' }}
        />
      </motion.div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* --- HERO SECTION (Pantalla completa) --- */}
        <motion.section 
            style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px', opacity: opacityHero }}
        >
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 1, type: 'spring' }}
                style={{ marginBottom: '20px' }}
            >
                <span style={{ border: '1px solid var(--gold-primary)', padding: '8px 16px', borderRadius: '20px', color: 'var(--gold-primary)', fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', background: 'rgba(247, 210, 122, 0.1)' }}>
                    ● SYSTEM ONLINE v2.0
                </span>
            </motion.div>

            <h1 className="text-rpg-gold" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', marginBottom: '10px', letterSpacing: '2px', textShadow: '0 0 30px rgba(247, 210, 122, 0.3)' }}>
                <HackerText text="CTRL + ALT + QUEST" />
            </h1>

            <motion.p 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ maxWidth: '600px', fontSize: '1.2rem', color: '#ccc', lineHeight: '1.6', marginBottom: '40px' }}
            >
                La herramienta definitiva de gamificación. <br/>
                Convierte tu rutina en una <span style={{ color: '#4caf50' }}>Aventura RPG</span>.
            </motion.p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 25px var(--gold-primary)" }} whileTap={{ scale: 0.95 }} className="btn-hero" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Download size={20} /> DESCARGAR .EXE</div>
                </motion.button>
                
                <Link to="/auth">
                    <motion.button whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.95 }} className="btn-secondary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={20} /> ACCESO WEB</div>
                    </motion.button>
                </Link>
            </div>

            {/* Scroll Indicator */}
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', bottom: '40px', color: 'rgba(255,255,255,0.3)' }}>
                <ChevronDown size={30} />
            </motion.div>
        </motion.section>

        {/* --- DASHBOARD DE ESTADÍSTICAS (Glassmorphism) --- */}
        <div style={{ width: '100%', background: 'linear-gradient(to bottom, transparent, #0d0915 20%)', paddingBottom: '100px' }}>
            
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                style={{ 
                    display: 'flex', gap: '60px', flexWrap: 'wrap', justifyContent: 'center', 
                    background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', 
                    padding: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' 
                }}
            >
                <CountUp icon={<Globe size={28}/>} value="12,405" label="HÉROES ONLINE" />
                <CountUp icon={<Zap size={28}/>} value="850k+" label="HORAS PRODUCTIVAS" />
                <CountUp icon={<Sword size={28}/>} value="99.9%" label="UPTIME SERVER" />
            </motion.div>

            {/* --- CARACTERÍSTICAS EN 3D (TILT CARDS) --- */}
            <div style={{ maxWidth: '1200px', margin: '100px auto', padding: '0 20px' }}>
                <motion.h2 
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} 
                    className="text-rpg-gold" 
                    style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px' }}
                >
                    ARSENAL DEL SISTEMA
                </motion.h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    
                    <TiltCard className="feature-card-3d">
                        <div className="rpg-panel" style={{ height: '100%', padding: '40px', textAlign: 'center', background: 'rgba(26, 18, 43, 0.6)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                            <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 20px rgba(76, 175, 80, 0.2)' }}>
                                <ShieldAlert size={40} color="#4caf50" />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-rpg)', color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>Escudo de Foco</h3>
                            <p style={{ color: '#ccc', lineHeight: '1.6' }}>Bloquea distracciones automáticamente. Nuestra IA detecta cuando pierdes el foco y te devuelve al camino.</p>
                        </div>
                    </TiltCard>

                    <TiltCard className="feature-card-3d">
                        <div className="rpg-panel" style={{ height: '100%', padding: '40px', textAlign: 'center', background: 'rgba(26, 18, 43, 0.6)', border: '1px solid rgba(247, 210, 122, 0.3)' }}>
                            <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(247, 210, 122, 0.1)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 20px rgba(247, 210, 122, 0.2)' }}>
                                <Sparkles size={40} color="var(--gold-primary)" />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-rpg)', color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>Loot y Progresión</h3>
                            <p style={{ color: '#ccc', lineHeight: '1.6' }}>Sube de nivel en la vida real. Desbloquea skins, marcos y títulos exclusivos completando tus tareas diarias.</p>
                        </div>
                    </TiltCard>

                    <TiltCard className="feature-card-3d">
                        <div className="rpg-panel" style={{ height: '100%', padding: '40px', textAlign: 'center', background: 'rgba(26, 18, 43, 0.6)', border: '1px solid rgba(233, 69, 96, 0.3)' }}>
                            <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(233, 69, 96, 0.1)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 20px rgba(233, 69, 96, 0.2)' }}>
                                <Users size={40} color="#e94560" />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-rpg)', color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>Clanes y Gremios</h3>
                            <p style={{ color: '#ccc', lineHeight: '1.6' }}>No luches solo. Forma un gremio con tus amigos, compitan en rankings semanales y dominen el servidor.</p>
                        </div>
                    </TiltCard>

                </div>
            </div>

            {/* --- NEWSLETTER / FOOTER SECTION --- */}
            <motion.div 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                style={{ textAlign: 'center', padding: '80px 20px', background: 'radial-gradient(circle at center, #1a1a2e 0%, #000 100%)' }}
            >
                <h2 className="text-rpg-gold" style={{ fontSize: '2rem', marginBottom: '20px' }}>¿LISTO PARA EL CAMBIO?</h2>
                <p style={{ color: '#888', marginBottom: '30px' }}>Únete a los 12,000+ usuarios que ya están subiendo de nivel.</p>
                <Link to="/auth">
                    <motion.button whileHover={{ scale: 1.1, boxShadow: '0 0 30px var(--gold-primary)' }} className="btn-hero" style={{ padding: '15px 50px', fontSize: '1.2rem' }}>
                        REGISTRARSE GRATIS
                    </motion.button>
                </Link>
            </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Home;