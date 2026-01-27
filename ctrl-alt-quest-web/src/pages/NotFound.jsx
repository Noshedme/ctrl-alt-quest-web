import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ 
      height: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', 
      background: '#050505', color: '#e94560', textAlign: 'center', padding: '20px'
    }}>
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <AlertTriangle size={80} style={{ marginBottom: '20px', filter: 'drop-shadow(0 0 10px red)' }} />
      </motion.div>

      <h1 style={{ fontFamily: 'var(--font-rpg)', fontSize: '4rem', margin: 0, textShadow: '4px 4px 0px #fff' }}>404</h1>
      
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', margin: '20px 0', color: '#fff' }}>
        <p>FATAL ERROR: ZONA NO MAPEADA</p>
        <p style={{ color: '#888', fontSize: '0.8rem' }}>La ruta que buscas ha sido consumida por el vacío.</p>
      </div>

      <Link to="/" style={{ textDecoration: 'none' }}>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="btn-hero"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}
        >
          <Home size={18} /> TELETRANSPORTAR AL HOME
        </motion.button>
      </Link>

    </div>
  );
};

export default NotFound;