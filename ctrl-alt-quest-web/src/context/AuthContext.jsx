import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../services/authService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar sesión guardada al refrescar página
  useEffect(() => {
    const storedUser = localStorage.getItem('quest_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al leer sesión:", e);
        localStorage.removeItem('quest_user');
      }
    }
    setLoading(false);
  }, []);

  // 2. FUNCIÓN DE LOGIN (LA QUE TIENE EL FIX)
  const login = async (username, password) => {
    const result = await loginUser(username, password);

    if (result.success) {
      // Guardamos en el estado de la App
      setUser(result.user);
      // Guardamos en el navegador
      localStorage.setItem('quest_user', JSON.stringify(result.user));
      
      // ⚠️ AQUÍ ESTABA EL ERROR ⚠️
      // Antes tu código solo decía: return { success: true }
      // Y por eso Auth.jsx recibía "undefined" al buscar el usuario.
      // AHORA devolvemos el usuario completo:
      return { success: true, user: result.user }; 
      
    } else {
      return { success: false, message: result.message };
    }
  };

  // 3. Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('quest_user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        isLoading: loading 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);