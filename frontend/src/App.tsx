import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// TUS CREDENCIALES (Ya las tienes bien configuradas)
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

  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await supabase
        .from('website_status')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(2);

      if (data) {
        const uniqueData = Array.from(new Map(data.map(item => [item.url, item])).values());
        setStatuses(uniqueData);
      }
    };

    fetchStatus();
    // Bajamos a 3 segundos para que se sienta más rápido el cambio
    const interval = setInterval(fetchStatus, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 font-mono">
      <div className="max-w-2xl w-full">
        
        <div className="mb-8 border-b border-purple-900/50 pb-4">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            SENTINEL<span className="text-white">_WEB</span>
          </h1>
          <p className="text-xs text-purple-500 tracking-[0.3em] mt-2">UPTIME MONITOR</p>
        </div>

        <div className="space-y-4">
          {statuses.map((site) => (
            <div key={site.url} className="bg-[#0f0f13] border border-gray-800 p-6 rounded-lg flex items-center justify-between hover:border-purple-500/30 transition-all">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">{site.url}</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${site.is_online ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}></div>
                  <span className={`text-xl font-bold ${site.is_online ? 'text-white' : 'text-red-400'}`}>
                    {site.is_online ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-gray-600 mb-1">LATENCY</p>
                {/* AQUI ESTÁ EL CAMBIO DE LA ANIMACIÓN Y DECIMALES */}
                <p className="font-bold text-purple-400 animate-pulse text-lg">
                  {site.latency_ms.toFixed(2)} ms
                </p>
                <p className="text-[10px] text-gray-700 mt-2">
                  Actualizado: {new Date(site.checked_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {statuses.length === 0 && (
            <div className="text-center text-gray-600 animate-pulse">Esperando señal del Sentinel...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App