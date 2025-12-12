import requests
import time
from supabase import create_client, Client

# --- TUS CREDENCIALES (Las mismas de hace rato) ---
url_supabase: str = "https://twhlljvrwkcrsrtjbxqy.supabase.co"
key_supabase: str = "sb_publishable_pQgTy2r6vBRCuNqS7Xl1lw_waSyh4HT"
# -----------------------------

supabase: Client = create_client(url_supabase, key_supabase)

# Las webs que vamos a vigilar
TARGETS = [
    "https://www.google.com",
    "https://oliverg777.github.io/" 
]

print("--- SENTINEL WEB MONITOR INICIADO ---")

while True:
    for target in TARGETS:
        try:
            start_time = time.time()
            response = requests.get(target, timeout=5)
            latency = round((time.time() - start_time) * 1000, 2) # ms
            
            is_online = response.status_code == 200
            
            # Guardar reporte real
            data = {
                "url": target,
                "status_code": response.status_code,
                "is_online": is_online,
                "latency_ms": latency
            }
            
            supabase.table('website_status').insert(data).execute()
            print(f"[{'ONLINE' if is_online else 'FAIL'}] {target} - {latency}ms")

        except Exception as e:
            # Si falla la conexión (internet caído o url mal)
            print(f"[ERROR] {target}: {e}")
            supabase.table('website_status').insert({
                "url": target,
                "status_code": 0,
                "is_online": False,
                "latency_ms": 0
            }).execute()

    # Checar cada 10 segundos (para no saturar)
    time.sleep(3)