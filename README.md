# BCN Bus Checker – Realtime Barcelona Bus Schedule 🚌

![CI](https://github.com/AdrianCasadoAguilera/TMB-Bus-checker/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-%3E=20.0.0-green)
![Status](https://img.shields.io/badge/status-in%20progress-yellow)
[![Test coverage](https://codecov.io/gh/AdrianCasadoAguilera/TMB-Bus-checker/branch/main/graph/badge.svg)](https://codecov.io/gh/AdrianCasadoAguilera/TMB-Bus-checker)

**BCN Bus Checker** is a real-time web app that lets users check when their bus will arrive at a specific stop.  
Currently focused on TMB buses in Barcelona, the app is designed to expand to support more operators, including AMB, FGC, Rodalies and the metro network.

![Made with React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)
![Made with Next.js](https://img.shields.io/badge/-Next.js-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-38b2ac?logo=tailwind-css&logoColor=white)

---

## 💾 Installation

```bash
git clone https://github.com/AdrianCasadoAguilera/TMB-Bus-checker.git
cd TMB-Bus-checker
npm install
npm run dev
```

## 👨‍💻 Demo
This project is deployed with Vercel

[▶️ See live demo](https://tmb-bus-checker.vercel.app)

## ⚒️ How is it done?
### 🧱 Tech Stack
- **React + Next.js (App Router)** – frontend and routing
- **TypeScript** – static typing
- **Tailwind CSS** – utility-first styling
- **Vitest** – unit and component testing
- **Supabase** – authentication & file storage (future features)
- **Vercel** – deployment platform

### 🔌 Data Sources
**TMB Open Data API** – real-time and static data for Barcelona’s main bus operator
**Planned GTFS / GTFS-RT integration** – to support multiple operators via the industry standard (FGC, AMB, Renfe...)

## 🧪 Testing
```
npm run test
```
(Uses Vitest to test components and logic)

