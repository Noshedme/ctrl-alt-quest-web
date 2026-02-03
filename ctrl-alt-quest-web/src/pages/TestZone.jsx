import React, { useState } from 'react';
import { jsPDF } from "jspdf"; 
import { Shield, FileDown, Bug, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

// --- DATOS DE PRUEBA (MOCK DATA) ---
const TEST_USER = {
  username: "TestHero_99",
  level: 50,
  class: "Paladín",
  coins: 9999,
  server: "Servidor de Pruebas Alpha"
};

export default function TestZone() {
  const [logs, setLogs] = useState([]);

  // Función para agregar mensajes a nuestra consola
  const addLog = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${type.toUpperCase()}: ${msg}`, ...prev]);
  };

  // --- FUNCIONALIDAD: GENERAR PDF ---
  const generatePDF = (simulateError = false) => {
    try {
      addLog("Iniciando generación de PDF...", "process");

      // 1. Instanciamos la librería
      const doc = new jsPDF();

      // 2. SIMULACIÓN DE ERROR PARA LA TAREA
      if (simulateError) {
        throw new Error("Fallo simulado: La librería no pudo cargar la fuente.");
      }

      // 3. Usamos la librería para dibujar
      doc.setFontSize(22);
      doc.setTextColor(220, 160, 0); // Color Dorado
      doc.text("CERTIFICADO DE VALOR", 105, 20, null, null, "center");
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`Otorgado al aventurero: ${TEST_USER.username}`, 20, 40);
      
      doc.setFontSize(12);
      doc.text(`Nivel: ${TEST_USER.level}`, 20, 60);
      doc.text(`Clase: ${TEST_USER.class}`, 20, 70);
      doc.text(`Oro: ${TEST_USER.coins}`, 20, 80);
      
      doc.text("Firmado digitalmente por Ctrl+Alt+Quest", 20, 100);

      // 4. Guardamos el archivo
      doc.save("certificado_prueba.pdf");
      
      addLog("PDF generado correctamente.", "success");
      toast.success("Prueba Exitosa: PDF Descargado");

    } catch (error) {
      // AQUÍ DEMUESTRAS LA DEPURACIÓN
      console.error(error); 
      addLog(error.message, "error");
      toast.error("Error detectado en el entorno de pruebas");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-10 text-white font-mono">
      <div className="max-w-4xl mx-auto border-2 border-dashed border-yellow-500/50 p-8 rounded-xl bg-slate-800/50">
        
        <div className="flex items-center gap-4 mb-8">
          <Shield className="text-yellow-500" size={40} />
          <div>
            <h1 className="text-3xl font-bold text-yellow-500">ENTORNO DE PRUEBAS (SANDBOX)</h1>
            <p className="text-gray-400">Zona segura para depurar librerías externas (jsPDF) sin afectar la BBDD.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* PANEL DE CONTROL */}
          <div className="space-y-6">
            <div className="bg-black/40 p-4 rounded border border-slate-700">
              <h3 className="font-bold mb-2 text-blue-400">Datos Simulados (Mock Data):</h3>
              <pre className="text-xs text-green-400 font-mono">
                {JSON.stringify(TEST_USER, null, 2)}
              </pre>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => generatePDF(false)}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 p-4 rounded font-bold transition shadow-lg"
              >
                <FileDown /> Probar Generación PDF
              </button>

              <button 
                onClick={() => generatePDF(true)}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 p-4 rounded font-bold transition shadow-lg"
              >
                <Bug /> Simular Error (Debug)
              </button>
            </div>
          </div>

          {/* CONSOLA DE DEPURACIÓN */}
          <div className="bg-black rounded-lg p-4 border border-slate-600 h-64 overflow-y-auto font-mono text-sm shadow-inner">
            <h3 className="text-gray-500 border-b border-gray-700 pb-2 mb-2 sticky top-0 bg-black flex items-center gap-2">
               {/* ⚠️ AQUÍ ESTABA EL ERROR: Cambiamos '>' por '&gt;' */}
               &gt;_ Consola de Depuración
            </h3>
            {logs.length === 0 && <span className="text-gray-600 italic">Esperando ejecución...</span>}
            {logs.map((log, index) => (
              <div key={index} className={`mb-1 font-mono ${log.includes('ERROR') ? 'text-red-500 font-bold' : log.includes('SUCCESS') ? 'text-green-400' : 'text-blue-300'}`}>
                {log}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}