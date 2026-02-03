import express from 'express';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const { Pool } = pg;

// --- CONEXIÓN BASE DE DATOS ---
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CtrlAltQuestDB',
  password: 'intesud',
  port: 5432,
});

pool.connect()
  .then(() => console.log('🔌 SERVIDOR NUEVO: Conectado a la Base de Datos (CtrlAltQuestBD)'))
  .catch(err => console.error('❌ Error conexión:', err.message));

// ==========================================
// RUTA DE LOGIN (OPTIMIZADA)
// ==========================================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`\n🔍 INTENTO DE LOGIN: ${username}`);

    // 1. Buscamos usuario por nombre
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      console.log("❌ Usuario no encontrado en la tabla.");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // --- DEPURACIÓN VISUAL ---
    console.log(`   📝 Contraseña recibida: '${password}'`);
    // Mostramos solo el inicio del hash para seguridad
    const hashPreview = user.password_hash ? user.password_hash.substring(0, 15) : 'NULL';
    console.log(`   🔐 Hash en BBDD:        '${hashPreview}...'`);

    let passwordMatch = false;

    // 2. VERIFICACIÓN DE CONTRASEÑA (SOPORTA JAVA Y TEXTO PLANO)
    if (user.password_hash && user.password_hash.startsWith('$')) {
        console.log("   ⚙️  Detectado hash encriptado. Usando Bcrypt...");
        passwordMatch = await bcrypt.compare(password, user.password_hash);
    } else {
        console.log("   📄 Detectado texto plano. Comparando directo...");
        passwordMatch = (user.password_hash === password);
    }

    if (passwordMatch) {
      console.log("✅ ¡ACCESO AUTORIZADO! Redirigiendo...");
      
      // 3. INFERENCIA DE ROL (Porque no existe columna 'role' en tu BBDD)
      const userRole = (user.username.toLowerCase() === 'admin' || user.id === 1) ? 'ADMIN' : 'USER';
      
      // 4. MAPEO DE DATOS (Convertimos snake_case de BBDD a camelCase para React)
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: userRole,
        level: user.level || 1,
        currentXp: user.current_xp,       // Mapeado de BBDD
        totalXp: user.total_xp,           // Mapeado de BBDD
        coins: user.coins || 0,
        avatar: user.avatar,
        streak: user.health_streak || 0,  // Mapeado de BBDD
        classId: user.selected_class_id   // Mapeado de BBDD
      };

      res.json(userData);

    } else {
      console.log("❌ CONTRASEÑA RECHAZADA (No coinciden)");
      res.status(401).json({ message: "Contraseña incorrecta" });
    }

  } catch (err) {
    console.error("💥 Error grave en el servidor:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// ==========================================
// RUTA RANKING
// ==========================================
app.get('/api/leaderboard', async (req, res) => {
  try {
    // Usamos 'total_xp' para ordenar el ranking histórico
    const result = await pool.query(`
      SELECT username, level, total_xp, avatar 
      FROM users 
      ORDER BY total_xp DESC 
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error en ranking:", err);
    res.status(500).json({ error: "Error al obtener ranking" });
  }
});

// ==========================================
// ENCENDER SERVIDOR
// ==========================================
app.listen(port, () => {
  console.log(`🚀 SERVIDOR NUEVO ACTIVO EN: http://localhost:${port}`);
});