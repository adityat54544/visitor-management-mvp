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