import React from 'react';
import { Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      background: '#0d0915', borderTop: '1px solid rgba(247, 210, 122, 0.1)', 
      padding: '30px 20px', textAlign: 'center', marginTop: 'auto' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        
        <div style={{ display: 'flex', gap: '20px' }}>
            <SocialLink icon={<Github size={20} />} />
            <SocialLink icon={<Twitter size={20} />} />
        </div>

        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', margin: 0 }}>
          © 2026 <strong>CTRL + ALT + QUEST</strong>. Todos los derechos reservados.
        </p>
        
        <p style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
          Hecho con <Heart size={10} color="#e94560" /> y mucho café.
        </p>

      </div>
    </footer>
  );
};

const SocialLink = ({ icon }) => (
    <a href="#" style={{ color: 'var(--gold-primary)', opacity: 0.7, transition: '0.3s' }} 
       onMouseEnter={(e) => e.target.style.opacity = 1} 
       onMouseLeave={(e) => e.target.style.opacity = 0.7}>
        {icon}
    </a>
);

export default Footer;