# MVP — React Native + Node.js Monorepo

Full-stack MVP starter built with exactly this stack:

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
│       ├── middlewares/  # error handling, 404
│       ├── models/       # Mongoose schemas
│       └── routes/       # Express routers
├── mobile/               # React Native app (Expo, blank TypeScript template)
├── docker-compose.yml    # MongoDB + mongo-express
└── README.md
```

## 1. Prerequisites

- **Node.js** ≥ 20 (tested on v24.13.0) — `node --version`
- **npm** ≥ 10
- **Docker Desktop** (running) — MongoDB runs as a container
- For Android builds: Android SDK + Java 17 (already configured at `%LOCALAPPDATA%\Android\Sdk`)

## 2. Start the database (Docker)

```bash
docker compose up -d
```

| Service         | URL / Port                     | Purpose                    |
| --------------- | ------------------------------ | -------------------------- |
| MongoDB         | `mongodb://127.0.0.1:27017/mvp` | App database (volume-backed) |
| mongo-express   | http://localhost:8083          | Web UI — login `admin` / `admin` (on 8083 so it stays clear of Expo's Metro on 8081) |

Stop: `docker compose down` · Stop + wipe data: `docker compose down -v`

## 3. Start the API (server)

```bash
cd server
npm install        # already done
npm run dev        # tsx watch → auto-restarts on save
```

- Server: http://localhost:5000
- Health check: `GET /api/health` → `{ "status": "ok" }`
- Env config lives in `server/.env` (copy from `.env.example` to customize).

### REST endpoints (sample resource: `items`)

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/api/items`    | List all items       |
| GET    | `/api/items/:id`| Get one item         |
| POST   | `/api/items`    | Create item          |
| PUT    | `/api/items/:id`| Update item          |
| DELETE | `/api/items/:id`| Delete item          |

**Example:**

```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":1200}'
```

Other scripts: `npm run build` (compile), `npm run start` (run compiled), `npm run typecheck`.

## 4. Start the mobile app

```bash
cd mobile
npm install        # already done
npm start          # Expo dev server (scan QR with Expo Go, or press a for Android)
```

- Blank TypeScript template (Expo SDK 57 / RN 0.86 / React 19).
- Connect it to the API with the **IP of your machine** (not `localhost`) when on a real device:
  `http://<your-LAN-IP>:5000` — Android emulator can use `http://10.0.2.2:5000`.

## 5. Next steps for the MVP

1. Define your domain model (Mongoose schema in `server/src/models/`).
2. Add auth (JWT) with `jsonwebtoken` + `bcryptjs`.
3. Build screens in `mobile/` and call the API with `fetch` (or `axios`).