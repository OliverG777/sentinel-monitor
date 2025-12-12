# Sentinel: Automated Service Health Monitor 🛡️

**Sentinel** es un sistema de monitoreo de disponibilidad (uptime) en tiempo real diseñado para equipos de Soporte Técnico y DevOps. Utiliza un script de automatización en Python para verificar la salud de servicios externos y un dashboard en React para visualizar el estado actual e histórico.

## 🚀 Características Principales
* **Monitoreo Automatizado:** Script de Python (`bot`) que ejecuta verificaciones de estado (Health Checks) en intervalos configurables.
* **Persistencia de Datos:** Registro histórico de latencia y códigos de estado HTTP en **Supabase (PostgreSQL)**.
* **Dashboard en Tiempo Real:** Interfaz visual construida con **React** y **Tailwind CSS** que muestra el estado actual del servicio (Online/Offline) mediante indicadores visuales.
* **Logs de Errores:** Captura automática de excepciones y tiempos de caída para análisis forense básico.

## 🛠️ Tech Stack (Arquitectura)

Este proyecto fue construido utilizando un enfoque moderno y desacoplado:

### Frontend
* **React + TypeScript:** Para seguridad de tipos y renderizado eficiente.
* **Tailwind CSS:** Para un diseño de interfaz rápido, responsivo y moderno (Dark Mode nativo).
* **Supabase Client:** Para suscripción y lectura de datos en tiempo real.

### Backend & Automation
* **Python:** Scripting para la lógica de "poling" (verificación periódica).
* **Supabase (PostgreSQL):** Base de datos relacional para almacenar logs de disponibilidad.

### Herramientas de Desarrollo
* **AI-Assisted Development:** Desarrollado utilizando **Cursor IDE** y **GitHub Copilot** para acelerar la implementación de lógica repetitiva y optimización de consultas SQL.

## 📂 Estructura del Proyecto

```bash
/sentinel
├── /src              # Frontend (React components)
│   ├── App.tsx       # Dashboard Logic
│   └── main.tsx      # Entry point
├── /backend          # Backend Logic
│   └── monitor.py    # Python Script (The "Sentinel" Bot)
├── tailwind.config.js
└── README.md
```

## ⚡ Cómo ejecutarlo

### 1. Clonar el repositorio
```bash
git clone [https://github.com/OliverGarcia/Sentinel-Uptime-Monitor.git](https://github.com/OliverGarcia/Sentinel-Uptime-Monitor.git)
cd sentinel
```

### 2. Configurar el Monitor (Python)
```bash
cd backend
pip install supabase requests
# Editar monitor.py con tus credenciales de Supabase
python monitor.py
```
*(El bot comenzará a imprimir el estado del servicio en la terminal)*

### 3. Iniciar el Dashboard
```bash
# En una nueva terminal (raíz del proyecto)
npm install
npm run dev
```

---
**Desarrollado por [Oliver García](https://www.linkedin.com/in/oliver-garcia-fragoso-9108692a8)**
*Ingeniero de Software enfocado en soluciones Full Stack y Automatización.*
