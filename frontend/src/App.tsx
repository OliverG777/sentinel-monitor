import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TUS CREDENCIALES ---
const supabaseUrl = 'https://twhlljvrwkcrsrtjbxqy.supabase.co';
const supabaseKey = 'sb_publishable_pQgTy2r6vBRCuNqS7Xl1lw_waSyh4HT';
const supabase = createClient(supabaseUrl, supabaseKey);

interface SiteStatus {
  url: string;
  is_online: boolean;
  latency_ms: number;
  checked_at: string;
}

function App() {
  const [statuses, setStatuses] = useState<SiteStatus[]>([]);
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);
  
  // Umbral para considerar que el agente se apagó (20 segundos)
  const THRESHOLD_MS = 20000; 

  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await supabase
        .from('website_status')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(4);

      if (data && data.length > 0) {
        // Guardamos la fecha del dato más reciente absoluto para saber si el sistema vive
        const mostRecent = new Date(data[0].checked_at);
        setLastHeartbeat(mostRecent);

        // Filtramos duplicados por URL
        const uniqueData = Array.from(new Map(data.map(item => [item.url, item])).values());
        setStatuses(uniqueData);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000); 
    return () => clearInterval(interval);
  }, []);

  // Calculamos si el sistema global está "vivo"
  const now = new Date().getTime();
  const isSystemAlive = lastHeartbeat ? (now - lastHeartbeat.getTime()) < THRESHOLD_MS : false;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 flex flex-col items-center justify-center p-4 font-mono selection:bg-purple-500/30">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* CABECERA CON CONTEXTO */}
        <div className="border-b border-purple-900/30 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              SENTINEL<span className="text-purple-500">_MONITOR</span>
            </h1>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">
              Infraestructura IoT & Telemetría en Tiempo Real
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${isSystemAlive ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isSystemAlive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
              {isSystemAlive ? 'AGENTE ACTIVO' : 'MODO REPOSO'}
            </div>
          </div>
        </div>

        {/* LISTA DE MONITORES */}
        <div className="space-y-4">
          {statuses.map((site) => {
            // Estado visual
            let statusText = isSystemAlive ? (site.is_online ? 'OPERATIONAL' : 'ERR_CONNECTION') : 'PAUSED';
            let latText = isSystemAlive ? `${site.latency_ms.toFixed(2)} ms` : '--';
            let barColor = isSystemAlive ? (site.is_online ? 'bg-purple-600' : 'bg-red-600') : 'bg-gray-700';

            return (
              <div key={site.url} className="group relative bg-[#0a0a0e] border border-gray-800 hover:border-purple-500/40 rounded-xl p-5 transition-all overflow-hidden">
                {/* Barra lateral de color */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${barColor} transition-all duration-500`}></div>
                
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h3 className="text-sm font-bold text-gray-200 mb-1">{site.url.replace('https://', '')}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`${isSystemAlive && site.is_online ? 'text-green-400' : 'text-gray-500'}`}>
                        ● {statusText}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-600 uppercase mb-1">Latencia</div>
                    <div className={`text-xl font-bold ${isSystemAlive ? 'text-white' : 'text-gray-600'}`}>
                      {latText}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {statuses.length === 0 && (
            <div className="text-center py-10 text-gray-600 animate-pulse border border-dashed border-gray-800 rounded-xl">
              Esperando conexión con el Agente Python...
            </div>
          )}
        </div>

        {/* SECCIÓN EDUCATIVA / ARQUITECTURA (El valor para reclutadores y clientes) */}
        <div className="mt-12 pt-8 border-t border-gray-900 grid md:grid-cols-2 gap-8">
          
          {/* Explicación para Humanos (Clientes) */}
          <div>
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="text-purple-500">?</span> ¿Cómo funciona?
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Este dashboard no es una animación grabada. Es una ventana en tiempo real a mi estación de trabajo.
              <br/><br/>
              Cuando ejecuto mi <strong>Agente Sentinel</strong>, mi computadora comienza a enviar datos de vida. Si ves esto "En Reposo", significa que he terminado mi jornada y apagado mis sistemas.
            </p>
            {!isSystemAlive && lastHeartbeat && (
              <div className="mt-4 p-3 bg-gray-900/50 rounded border border-gray-800 text-xs text-gray-400">
                🕒 Última actividad registrada: <span className="text-white">{lastHeartbeat.toLocaleTimeString()}</span> del {lastHeartbeat.toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Explicación Técnica (Reclutadores) */}
          <div className="bg-[#0f0f13] p-4 rounded-lg border border-gray-800/50">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Arquitectura del Sistema</h4>
            
            <div className="space-y-4 relative">
              {/* Línea conectora */}
              <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-800 z-0"></div>

              {/* Paso 1: Python */}
              <div className="relative z-10 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isSystemAlive ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-gray-800 border-gray-700 text-gray-600'}`}>
                  PY
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Agente Local (Python)</div>
                  <div className="text-xs text-gray-500">Ejecutándose en hardware físico. Recolecta métricas y realiza pings (requests).</div>
                </div>
              </div>

              {/* Paso 2: Supabase */}
              <div className="relative z-10 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isSystemAlive ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-gray-800 border-gray-700 text-gray-600'}`}>
                  DB
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Supabase (Backend)</div>
                  <div className="text-xs text-gray-500">Base de datos en tiempo real (PostgreSQL). Sincroniza el estado en milisegundos.</div>
                </div>
              </div>

              {/* Paso 3: React */}
              <div className="relative z-10 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 border border-blue-500/50 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  UI
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Cliente Web (React + Vite)</div>
                  <div className="text-xs text-gray-500">Dashboard reactivo que consume la suscripción de datos vivos.</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default App