const API_URL = 'http://localhost:3000/api';

export const loginUser = async (username, password) => {
  try {
    // Intentamos conectar con el backend
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Login exitoso (Status 200)
      return { success: true, user: data };
    } else {
      // Error del servidor (Status 401, 404, 500)
      return { success: false, message: data.message || 'Error de credenciales' };
    }

  } catch (error) {
    // Error si el servidor está apagado o no hay internet
    console.error("Error de red:", error);
    return { success: false, message: "No se pudo conectar con el servidor (¿Node está corriendo?)" };
  }
};

export const getUsers = async () => {
    return []; 
};