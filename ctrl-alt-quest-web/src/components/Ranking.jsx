import { useEffect, useState } from 'react';
import { Trophy, ShieldAlert, User } from 'lucide-react';

export default function Ranking() {
  const [jugadores, setJugadores] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Pedimos los datos a TU servidor local
    fetch('http://localhost:3000/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibidos:", data);
        setJugadores(data);
      })
      .catch(err => {
        console.error("Error:", err);
        setError(true);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl text-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-500 flex justify-center items-center gap-2">
        <Trophy size={32} /> TABLA DE LÍDERES
      </h2>

      {error && (
        <div className="bg-red-900/50 p-4 rounded text-center mb-4 text-red-200">
          ⚠️ No se pudo conectar con la base de datos local.
          <br/>Revisa que el servidor (node) esté encendido.
        </div>
      )}

      <div className="space-y-2">
        {jugadores.length === 0 && !error ? (
          <p className="text-center text-gray-400">Cargando guerreros...</p>
        ) : (
          jugadores.map((jugador, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold w-8 ${index < 3 ? 'text-yellow-400' : 'text-gray-500'}`}>
                  #{index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <User size={18} /> {jugador.username}
                  </h3>
                  <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                    {jugador.class || 'Aventurero'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-mono font-bold">Lvl {jugador.level}</p>
                <p className="text-xs text-gray-500">{jugador.experience || jugador.xp} XP</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}