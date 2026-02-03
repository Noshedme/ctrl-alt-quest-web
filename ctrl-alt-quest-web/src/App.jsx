import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast'; 

// --- IMPORTAMOS CONTEXTO ---
import { AuthProvider, useAuth } from './context/AuthContext';

// --- IMPORTAMOS COMPONENTES UI GLOBALES ---
import CustomCursor from './components/CustomCursor'; 
import SplashScreen from './components/SplashScreen';
import Footer from './components/Footer';
import Ranking from './components/Ranking';

// --- IMPORTAMOS PÁGINAS ---
import Home from './pages/Home';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import UserLobby from './pages/UserLobby';
import NotFound from './pages/NotFound';
import TestZone from './pages/TestZone'; // ⬅️ 1. IMPORTANTE: IMPORTAMOS LA PÁGINA AQUÍ

// --- COMPONENTE DE SEGURIDAD: SOLO ADMINS ---
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// --- COMPONENTE DE SEGURIDAD: USUARIOS LOGUEADOS ---
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/auth" replace />;
    }
    
    return children;
};

// --- COMPONENTE LAYOUT (Maneja dónde sale el Footer) ---
const LayoutWithFooter = ({ children }) => {
    const location = useLocation();
    
    // Ocultar footer en rutas de Admin y Auth para tener más espacio
    const hideFooter = location.pathname.startsWith('/admin') || location.pathname === '/auth';
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>{children}</div>
            {!hideFooter && <Footer />}
        </div>
    );
};

// --- CONTENIDO PRINCIPAL DE LA APP ---
const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="app-container">
      
      {/* 1. CURSOR PERSONALIZADO (Flota sobre todo) */}
      <CustomCursor />

      {/* 2. CONFIGURACIÓN DE NOTIFICACIONES (TOAST) */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
            style: {
                background: 'rgba(13, 9, 21, 0.95)',
                color: '#fff',
                border: '1px solid #4caf50',
                fontFamily: "'Press Start 2P', cursive", 
                fontSize: '0.7rem',
                padding: '12px',
                boxShadow: '0 0 10px rgba(76, 175, 80, 0.4)',
                backdropFilter: 'blur(5px)',
                zIndex: 10000
            },
            success: {
                iconTheme: { primary: '#4caf50', secondary: '#000' },
                style: { border: '1px solid #4caf50' }
            },
            error: {
                iconTheme: { primary: '#e94560', secondary: '#000' },
                style: { border: '1px solid #e94560', color: '#ffadad' }
            },
            loading: {
                style: { border: '1px solid #f7d27a', color: '#f7d27a' }
            }
        }}
      />

      {/* 3. SPLASH SCREEN (Intro) */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* 4. RUTAS DE NAVEGACIÓN */}
      {!showSplash && (
        <LayoutWithFooter>
            <Routes>
              
              {/* RUTA PÚBLICA: HOME + RANKING */}
              <Route path="/" element={
                <>
                  <Home />
                  <Ranking /> 
                </>
              } />
              
              {/* RUTA PÚBLICA: LOGIN / REGISTRO */}
              <Route path="/auth" element={<Auth />} />

              {/* 👇 2. IMPORTANTE: LA RUTA DEL SANDBOX DE PRUEBAS 👇 */}
              <Route path="/test-zone" element={<TestZone />} />
              
              {/* RUTA PROTEGIDA: ADMIN DASHBOARD */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />

              {/* RUTA PROTEGIDA: LOBBY DE USUARIO */}
              <Route 
                path="/lobby" 
                element={
                  <ProtectedRoute>
                    <UserLobby />
                  </ProtectedRoute>
                } 
              />

              {/* RUTA EXTRA: RANKING SOLO */}
              <Route path="/leaderboard" element={<Ranking />} />

              {/* RUTA 404: CUALQUIER OTRA URL CAERÁ AQUÍ */}
              <Route path="*" element={<NotFound />} />

            </Routes>
        </LayoutWithFooter>
      )}
      
    </div>
  );
};

// --- APP RAÍZ ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;