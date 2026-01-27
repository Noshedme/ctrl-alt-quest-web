// SIMULACIÓN DE BASE DE DATOS
const MOCK_DB = {
  users: [
    { id: 1, username: 'admin', password: '123', role: 'ADMIN', email: 'admin@quest.com', level: 99 },
    { id: 2, username: 'player1', password: '123', role: 'USER', email: 'player@quest.com', level: 5 }
  ]
};

export const loginUser = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_DB.users.find(u => u.username === username && u.password === password);
      if (user) {
        // Retornamos el usuario sin la contraseña
        const { password, ...userWithoutPass } = user;
        resolve({ success: true, user: userWithoutPass });
      } else {
        reject({ success: false, message: "Credenciales inválidas" });
      }
    }, 800); // Simulamos un pequeño delay de red
  });
};

export const getMockUsers = () => MOCK_DB.users; // Para el CRUD del admin