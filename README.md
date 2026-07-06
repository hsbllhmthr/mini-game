---
title: The Peoples Assembly
emoji: 🏛️
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# The People's Assembly (TPA)

The People's Assembly is a real-time governance simulation tool designed to moderate face-to-face workshop discussions, ASEAN governance lectures, and civic education seminars.

The application functions as a **digital moderator** that manages room creation, assigns secret role cards, presents policy scenarios, coordinates private voting, handles the Mayor's veto/tie-break logic, tracks city indicators in real-time, and exports final scores to Excel spreadsheets.

---

## 🏗️ Tech Stack

- **Frontend:** React (Vite) + TypeScript + Tailwind CSS + Lucide Icons + Socket.io-client
- **Backend:** Node.js (Express) + Socket.io + TypeScript
- **Database (Online):** PostgreSQL (via Prisma ORM)
- **Database (Offline):** SQLite (via Prisma ORM + Better-sqlite3 adapter)
- **Exporting:** `exceljs` (server-side)
- **Packaging:** Docker & Docker Compose

---

## ⚡ Deployment Modes

This platform is architected to operate under two parallel deployment modes:

### 1. Online Mode (Cloud Deployment)
For workshops with reliable internet. The application connects to a cloud PostgreSQL database.
- **Client base URL / Dev server:** runs on `http://localhost:5173`
- **Server API / Websockets:** runs on `http://localhost:3000`

### 2. Offline Mode (Local WiFi/Hotspot Deployment)
For venues with poor or no internet. Both client and server run inside a single Docker container on the facilitator's machine, and players connect via local WiFi or hotspot on their mobile devices.
- **Access URL:** `http://<facilitator-local-ip>:3000`

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js (v20 LTS recommended)
- Docker Desktop (for Offline packaging)

### Installation
1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   - **Client:**
     ```bash
     cd client
     npm install
     ```
   - **Server:**
     ```bash
     cd server
     npm install
     ```

### Database Setup
Run migrations to initialize SQLite (development fallback database):
```bash
cd server
npm run db:push
```

### Running the Services
Start client and server dev servers:
- **Run Server:**
  ```bash
  cd server
  npm run dev
  ```
- **Run Client:**
  ```bash
  cd client
  npm run dev
  ```

---

## 🐳 Offline Mode Setup (Docker Compose)

The offline deployment packages both components into a single container and runs local SQLite.

### Facilitator Instructions (No Internet Required)
1. **Prepare Docker:** Make sure Docker Desktop is installed and running.
2. **Launch Application:** Navigate to the root directory and start docker-compose:
   ```bash
   docker compose -f docker-compose.offline.yml up --build
   ```
3. **Open Admin Console:** Open your browser to `http://localhost:3000` to access the Facilitator UI.
4. **Get Local IP:**
   - **Windows:** Open command prompt, type `ipconfig`, look for `IPv4 Address` under your active WiFi adapter (e.g. `192.168.1.50`).
   - **macOS/Linux:** Open terminal, type `ifconfig | grep inet` (or `ip route` / `ip addr`).
5. **Onboard Players:** Have your players join the local WiFi/hotspot and open `http://<facilitator-local-ip>:3000` in their mobile browsers.

---

## 📘 Facilitator Guide (Session Orchestration)

TPA coordinates the game state linearly. As a facilitator, you have complete moderate authority over the room:

1. **Lobby (`lobby`):** Share the 7-character Room Code displayed on screen. Once at least **8 players** (and up to 12) have connected, the "Start Assembly" button activates.
2. **Role Reveal (`role_reveal`):** Players see their private cards. Click "Open Scenario" to proceed when players are ready.
3. **Scenario Display (`scenario_display`):** Present the current policy dilemma to the room. Use the timer dropdown (1–10 minutes) and click "Start Discussion".
4. **Discussion (`discussion`):** Players debate face-to-face. The countdown is synchronized across all devices. You can end discussion early at any time by clicking "End Discussion Early".
5. **Voting (`voting`):** Players vote privately. If someone is slow or disconnected, you can click "Close Voting" to force-close and move on.
6. **Mayor Decision (`mayor_decision`):** The Mayor player makes the final policy selection. In case of a tie, the Mayor breaks it. The Mayor can also veto the vote with a justification.
7. **Outcome Reveal (`outcome_reveal`):** Shows the choice, veto messages, and animated indicator adjustments (+/- values). Repeat from Step 3 for Scenarios 2 and 3.
8. **Final Reflection (`final_reflection`):** Shows the City Archetype, reflection lessons, and a "Who Benefited Most" list.
9. **Export Results (`score_export`):** Click "Export Results" to download the binary `.xlsx` sheet containing the session metrics, choices, and player directories.
