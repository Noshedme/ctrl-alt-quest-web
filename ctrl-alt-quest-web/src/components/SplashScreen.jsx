import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Usamos background.mp4 para una transición perfecta al Home
import bgVideo from '../assets/videos/background.mp4'; 

// --- SUB-COMPONENTE: TEXTO TIPO MÁQUINA DE ESCRIBIR (Ahora más grande y centrado) ---
const LoadingText = () => {
  const phrases = [
    "INITIALIZING CORE SYSTEM...",
    "LOADING RPG ASSETS...",
    "SYNCHRONIZING SERVER...",
    "CTRL + ALT + QUEST READY..."
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isDeleting) {
        setDisplayedText(prev => prev.substring(0, prev.length - 1));
      } else {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
      }

      let typeSpeed = isDeleting ? 30 : 50;

      if (!isDeleting && displayedText === currentPhrase) {
        typeSpeed = 1500; 
        setIsDeleting(true);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        typeSpeed = 500;
      }

      setTimeout(handleTyping, typeSpeed);
    };

    const timer = setTimeout(handleTyping, 100);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhraseIndex]);

  return (
    <div style={{
      fontFamily: 'var(--font-pixel)',
      color: 'var(--gold-primary)',
      // CAMBIO: Fuente mucho más grande
      fontSize: '1.5rem', 
      letterSpacing: '3px',
      // CAMBIO: Sombra más intensa para que resalte
      textShadow: '0 0 15px rgba(247, 210, 122, 0.8), 0 0 30px rgba(247, 210, 122, 0.4)', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // Centrado horizontal
      gap: '10px',
      textAlign: 'center',
      width: '100%'
    }}>
      <span style={{ color: '#4caf50' }}>&gt;</span> 
      {displayedText}
      <span className="cursor-blink" style={{ color: '#fff' }}>_</span>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  // Simulación de barra de carga
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) return 100;
        const diff = Math.random() * 15; 
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }} 
      transition={{ duration: 1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 9999, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* --- 0. OVERLAY DE SCANLINES --- */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%',
        zIndex: 5, pointerEvents: 'none'
      }}></div>

      {/* --- 1. VIDEO DE FONDO (BORROSO) --- */}
      <video
        src={bgVideo}
        autoPlay muted loop playsInline
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0,
          filter: 'blur(25px) brightness(0.5)', // Un poco más oscuro para que resalten las letras
          transform: 'scale(1.1)'
        }}
      />

      {/* --- 2. CONTENEDOR CENTRAL (Video + Texto) --- */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* VIDEO PRINCIPAL (NÍTIDO) */}
        <motion.video
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src={bgVideo}
          autoPlay muted playsInline
          onEnded={onComplete}
          style={{
            width: '100%', height: '100%',
            maxWidth: '1100px', maxHeight: '65vh',
            objectFit: 'contain',
            boxShadow: '0 0 80px rgba(0,0,0,0.8)',
            border: '1px solid rgba(247, 210, 122, 0.3)'
          }}
        />

        {/* --- TEXTO CENTRAL TIPO MÁQUINA DE ESCRIBIR --- */}
        {/* CAMBIO: Posicionado absolutamente en el centro */}
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20, // Por encima del video
            width: '100%',
            textAlign: 'center'
        }}>
            <LoadingText />
        </div>

      </div>

      {/* --- 3. UI INFERIOR (Solo Barra de Progreso y Porcentaje) --- */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        width: '80%',
        maxWidth: '600px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
      }}>
        
        {/* Porcentaje a la derecha */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
             <span style={{ fontFamily: 'var(--font-pixel)', color: '#fff', fontSize: '0.8rem' }}>
                {Math.round(progress)}%
             </span>
        </div>

        {/* Barra de Progreso */}
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '3px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <motion.div 
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-primary))',
              boxShadow: '0 0 15px var(--gold-primary)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

      </div>
      
      {/* Botón SKIP */}
      <motion.button 
        onClick={onComplete}
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute', bottom: '30px', right: '30px',
          background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.5)', padding: '10px 20px',
          fontFamily: 'var(--font-pixel)', cursor: 'pointer',
          fontSize: '0.7rem', zIndex: 20, backdropFilter: 'blur(5px)'
        }}
      >
        SKIP_INTRO()
      </motion.button>

    </motion.div>
  );
};

export default SplashScreen;