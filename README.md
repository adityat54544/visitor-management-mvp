# Visitor Management System 🪪

**A production-grade full-stack Visitor Check-in app — built mainly with React Native & Node.js**

> **Core Stack:** `React Native` + `TypeScript` + `REST APIs` + `Node.js` + `Express` + `MongoDB`

> Built by **[Aditya Tiwari](https://github.com/adityat54544)** · 📞 **+91 63908 57720**

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](#) [![React Native](https://img.shields.io/badge/React%20Native%20(Expo)-0.86-black)](#) [![Node.js](https://img.shields.io/badge/Node.js%20%2B%20Express-green)](#) [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)](#) [![License](https://img.shields.io/badge/License-MIT-yellow)](#)

A complete front-desk solution for offices, co-working spaces and events:
visitors pre-register → get a QR badge → check in by scanning it at reception →
hosts get notified instantly → managers view live dashboards & reports.

## ✨ Features

| Area | Capabilities |
|---|---|
| 🔐 **Auth** | JWT sessions (7-day expiry), bcrypt password hashing, change password, self-closing registration |
| 👥 **Visitors** | Register, edit, search, status filter, full visit log |
| ✅ **Check-in/out** | One-tap or **QR-scan check-in** with camera |
| 📸 **Photo badges** | Capture visitor photo at registration |
| 🔔 **Notifications** | Hosts auto-notified when their guest checks in/out |
| 📊 **Reports** | Visit summaries & analytics for managers/admins |
| 🧑‍💼 **RBAC** | `receptionist` < `manager` < `admin` role hierarchy; admin-only user management |
| 🎨 **UI** | Glass-morphism design, animated stat cards, tab navigation |

## 🛠 Tech Stack

This project is built **mainly using React Native (mobile) and Node.js (backend)**, with:

```
✅ React Native      — cross-platform mobile app (Expo)
✅ TypeScript        — end-to-end type safety on both client & server
✅ REST APIs         — clean JSON API contract between app and backend
✅ Node.js           — JavaScript runtime powering the backend
✅ Express           — lightweight REST framework (routing, middleware, RBAC)
✅ MongoDB           — NoSQL database via Mongoose ODM
```

<details>
<summary><b>Full dependency details</b></summary>

```
mobile/   React Native 0.86 · Expo SDK 57 · TypeScript · React Navigation · Reanimated
          expo-camera (QR scanning) · AsyncStorage (JWT sessions) · react-native-svg
server/   Node.js ≥ 20 · Express 4 · TypeScript (NodeNext) · Mongoose 8
          jsonwebtoken (JWT auth) · bcryptjs (password hashing) · morgan (logging)
database/ MongoDB 7 (Docker container) · mongo-express admin UI
infra/    Docker Compose one-command local setup
```

</details>


## 🚀 Quick Start

### Prerequisites
Node.js ≥ 20 · npm ≥ 10 · [Docker Desktop](https://www.docker.com/products/docker-desktop/) running

### 1️⃣ Start the database
```bash
docker compose up -d
```
| Service | URL | Purpose |
|---|---|---|
| MongoDB | `mongodb://127.0.0.1:27017/mvp` | App database |
| mongo-express | http://localhost:8083 | Data browser (dev only) |

### 2️⃣ Start the API
```bash
cd server
npm install
copy .env.example .env     # then edit values (see below)
npm run dev                # runs on http://localhost:5000
```

<details>
<summary><b>Server environment variables</b> (<code>.env</code>)</summary>

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mvp    # or mongodb+srv://… for Atlas
JWT_SECRET=<generate: openssl rand -hex 48>   # REQUIRED — change it!
CLIENT_ORIGIN=*                               # comma-separated allowed origins
DEMO_EMAIL=admin@visitor.app                  # optional demo seed override
DEMO_PASSWORD=admin123                        # local DEV placeholder only!
```
</details>

> 💡 The first boot seeds 1 admin + 10 sample visitors automatically so you can explore instantly.

### 3️⃣ Run the mobile app
```bash
cd mobile
npm install
npm start          # Expo dev server → press 'a' for Android emulator, or scan QR in Expo Go
```
The app auto-points at `http://10.0.2.2:5000` on Android emulators. On a real device,
set your machine's LAN IP in [`mobile/src/api/client.ts`](mobile/src/api/client.ts)
or build with `EXPO_PUBLIC_API_URL=https://your-api.example.com/api`.

### 🔑 Demo login (development only)

| Email | Password | Notes |
|---|---|---|
| `admin@visitor.app` | `admin123` | **Local placeholder — never use these credentials anywhere deployed.** Set real credentials via `.env` (`DEMO_EMAIL` / `DEMO_PASSWORD`) before any shared/staging deployment. |

## 📚 API Reference

Base URL: `http://localhost:5000/api`

# Visitor Management MVP

A full-stack visitor check-in app built with exactly this stack:

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| Mobile app   | React Native (Expo) + **TypeScript**               |
| API          | **Node.js** + **Express** + **TypeScript** (REST)  |
| Database     | **MongoDB** (via Docker, Mongoose ODM)             |

```
.
├── server/               # REST API backend
│   └── src/
│       ├── config/       # DB connection (Mongoose)
│       ├── controllers/  # route handlers
│       ├── middlewares/  # JWT auth, error handling, 404
│       ├── models/       # User + Visitor schemas
│       ├── routes/       # Express routers
│       ├── utils/        # JWT signing
│       └── seed.ts       # demo data (runs on first boot)
├── mobile/               # React Native app (Expo + TypeScript)
│   └── src/
│       ├── api/          # typed REST clients (auth, visitors)
│       ├── components/   # GlassButton, GlassCard, StatCard, StatusBadge…
│       ├── context/      # AuthContext (JWT restore, login, logout)
│       ├── navigation/   # auth gate → stack → bottom tabs
│       ├── screens/      # Login, Dashboard, Visitors, Register, Details, Settings
│       └── theme/        # colors, spacing, glass + status tokens
├── docker-compose.yml    # MongoDB + mongo-express
└── README.md
```

## 1. Prerequisites

- **Node.js** ≥ 20 (tested on v24.13.0) — `node --version`
- **npm** ≥ 10
- **Docker Desktop** (running) — MongoDB runs as a container
- For Android: Android SDK + Java 17 (already configured at `%LOCALAPPDATA%\Android\Sdk`)

## 2. Start the database (Docker)

```bash
docker compose up -d
```

| Service       | URL / Port                     | Purpose                     |
| ------------- | ------------------------------ | --------------------------- |
| MongoDB       | `mongodb://127.0.0.1:27017/mvp` | App database (volume-backed) |
| mongo-express | http://localhost:8083          | Web UI — login `admin` / `admin` |

Stop: `docker compose up -d` · Stop + wipe data: `docker compose down -v`.

## 3. Start the API (server)

```bash
cd server
npm install
npm run dev        # tsx watch → auto-restarts on save
```

- Server: http://localhost:5000 · Health: `GET /api/health`
- Env in `server/.env` (copy `.env.example`). Change `JWT_SECRET` in production.
- **On first boot with an empty DB, the seed runs automatically** → 1 admin + 10 demo visitors.

### Demo login

```
Email:    admin@visitor.app
Password: admin123
```

### Auth endpoints

| Method | Endpoint                 | Description                       |
| ------ | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register`     | Create account (only while empty) |
| POST   | `/api/auth/login`        | Log in → JWT (+ user)             |
| GET    | `/api/auth/me`           | Current user profile              |
| POST   | `/api/auth/change-password` | Change password (JWT)           |

<details>
<summary><b>Auth</b></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | – | Create account (closed once ≥1 user exists) |
| POST | `/auth/login` | – | Returns `{ user, token }` |
| GET | `/auth/me` | JWT | Current profile |
| POST | `/auth/change-password` | JWT | Change own password |

</details>

<details>
<summary><b>Visitors</b> (all require Bearer token)</summary>

| Method | Endpoint | Roles |
|---|---|---|
| GET | `/visitors/today` | all |
| GET | `/visitors?search=&status=` | all |
| GET | `/visitors/:id` | all |
| POST | `/visitors/check-in/qr` `{qrToken}` | all |
| POST | `/visitors` | receptionist+ |
| PUT | `/visitors/:id` | receptionist+ |
| PATCH | `/visitors/:id/check-in` | receptionist+ |
| PATCH | `/visitors/:id/check-out` | receptionist+ |
| DELETE | `/visitors/:id` | admin |

Statuses: `expected` · `checked-in` · `checked-out`

</details>

<details>
<summary><b>Users / Notifications / Reports</b></summary>

| Method | Endpoint | Access |
|---|---|---|
| GET/POST/PATCH/DELETE | `/users`, `/users/:id`, `/users/:id/role` | admin |
| GET | `/notifications` (+`/unread-count`) | owner |
| PATCH | `/notifications/read-all`, `/notifications/:id/read` | owner |
| GET | `/reports/summary?from=&to=` | manager+ |

</details>

```bash
# example login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@visitor.app","password":"admin123"}'
```

## ☁️ Deployment

- **API**: deploy to Render / Railway / Koyeb / Fly.io; set env vars `NODE_ENV=production`, strong `JWT_SECRET`, Atlas `MONGODB_URI`.
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier.
- **Mobile**: `eas build -p android --profile production` (Expo Application Services) → internal-distribution APK.

### ⚠️ Before going live
1. Generate a **strong** `JWT_SECRET` (never ship the default)
2. Remove/disable demo seed data and demo credentials
3. Restrict `CLIENT_ORIGIN`; enable rate-limiting on auth routes
4. Never expose mongo-express publicly

## 📁 Project Structure

<details>
<summary>Click to expand</summary>

```
server/src/
├── config/db.ts              # Mongoose connection
├── controllers/              # auth · visitors · users · notifications · reports
├── middlewares/              # requireAuth + requireRole (hierarchical RBAC), errors, 404
├── models/                   # User · Visitor (QR token + photo) · Notification
├── routes/                   # Express routers
├── utils/jwt.ts              # token signing
└── seed.ts                   # dev/demo data seeding

mobile/src/
├── api/                      # typed REST clients + JWT-in-AsyncStorage client
├── components/               # GlassButton · GlassCard · StatCard · StatusBadge …
├── context/AuthContext.tsx   # session restore · login · logout
├── navigation/               # auth gate → stack → bottom tabs
├── screens/                  # Login · Dashboard · VisitorList · RegisterVisitor ·
│                             # VisitorDetails · QrCheckin · Notifications · Reports ·
│                             # AdminUsers · Settings
└── theme/                    # design tokens
```

</details>

## 🧭 Roadmap

- [ ] Push/email notifications instead of in-app polling
- [ ] Multi-tenant (multiple companies on one instance)
- [ ] Excel/PDF report export
- [ ] Appointment scheduling & host approval flow

## 👤 Author

**Aditya Tiwari**
- GitHub: [@adityat54544](https://github.com/adityat54544)
- Phone: **+91 6390857720**

## 📄 License

MIT © Aditya Tiwari


### Visitors (all require `Authorization: Bearer <token>`)

| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/api/visitors/today`       | Today's visitors + counts      |
| GET    | `/api/visitors`             | List (search + status filter)  |
| GET    | `/api/visitors/:id`         | Visit detail                   |
| POST   | `/api/visitors`             | Register visitor               |
| PUT    | `/api/visitors/:id`         | Update visitor                 |
| DELETE | `/api/visitors/:id`         | Delete visitor                 |
| PATCH  | `/api/visitors/:id/check-in`  | Mark checked-in               |
| PATCH  | `/api/visitors/:id/check-out` | Mark checked-out              |

Status values: `expected` · `checked-in` · `checked-out`.

**Example:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@visitor.app","password":"admin123"}'
```

## 4. Start the mobile app

```bash
cd mobile
npm install
npm start          # Expo dev server (scan QR with Expo Go, or press a for Android)
```

- Blank TypeScript template (Expo SDK 57 / RN 0.86 / React 19) extended with:
  - Navigation (native-stack + bottom tabs), reanimated, gesture-handler, expo-blur, AsyncStorage.
  - Glass UI + psychological status colors (blue=trust, green=checked-in, amber=expected, grey=checked-out).
- On the Android emulator the API URL is already `http://10.0.2.2:5000` (see `mobile/src/api/client.ts`).
- On a real device, point the API base URL at your machine's LAN IP.

## 5. The MVP flow

Login → **Dashboard** (3 animated stat cards + today's visitors) → **Register visitor** →
**Visitor list** (search + status filter) → **Visitor details** (check in / check out) → **Profile** (change password, sign out).

## 6. Next steps

- Multi-role access control (receptionist vs. admin).
- Notifications/host alerts on check-in.
- Visit history + reporting.
- Photo capture + QR badge for check-in.