# CrisisSync AI

Production-oriented emergency response operations stack for hospitality venues: incidents, Smart SOS, rule-based AI playbooks, analytics, notifications, structured locations, audit logging, and Socket.io synchronization.

## Repository layout

- `backend/` — Node.js + Express + Mongoose + Socket.io (MVC-style folders, services, middleware)
- `frontend/` — React (Vite) + Tailwind + Zustand + Axios + Framer Motion + Recharts

## Prerequisites

- Node.js 18+
- MongoDB 6+ reachable from your machine

## Environment variables

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

- `PORT` — API port (default `5000`)
- `MONGODB_URI` — Mongo connection string
- `JWT_SECRET` — long random secret for signing JWTs
- `JWT_EXPIRES_IN` — e.g. `7d`
- `CLIENT_ORIGIN` — frontend origin for CORS (e.g. `http://localhost:5173`)

Optional seed overrides:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

### Frontend (`frontend/.env`)

Copy from `frontend/.env.example`:

- `VITE_API_URL` — backend base URL (e.g. `http://localhost:5000`). Leave unset to rely on the Vite dev proxy.

## Setup and run

```bash
# Terminal 1 — database + API
cd backend
npm install
copy .env.example .env   # Windows PowerShell: Copy-Item .env.example .env
npm run seed             # creates admin, floors/rooms, AI rules
npm run dev

# Terminal 2 — UI
cd frontend
npm install
npm run dev
```

Default admin after seed (unless overridden):

- Email: `admin@crisissync.local`
- Password: `ChangeMe123!`

Register additional **Staff** or **Security** users from the UI. **Admin** is not self-service; use the seed account or create admins directly in MongoDB.

## API surface (REST)

| Area        | Method & path | Notes |
|------------|---------------|-------|
| Auth       | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `GET /auth/responders` | JWT bearer for protected routes |
| Incidents  | `POST /incident/create`, `GET /incident/all`, `PATCH /incident/update`, `GET /incident/:id`, `DELETE /incident/:id` (Admin) | SOS uses `POST /incident/create` |
| AI         | `GET /ai/suggestions/:type` | Rule engine backed by `AIRule` documents |
| Analytics  | `GET /analytics/summary` | Real aggregations + daily frequency series |
| Notifications | `GET /notifications`, `PATCH /notifications/read/:id`, `PATCH /notifications/read-all` | In-app store + Socket push |
| Locations  | `GET /location/floors`, `GET /location/rooms?floorId=`, `POST /location/floors`, `POST /location/rooms` | Writes require Admin |
| Audit      | `GET /audit/logs` | Admin only |

## Real-time (Socket.io)

- Clients authenticate with JWT via `handshake.auth.token`.
- Events: `new_incident`, `incident_updated`, `status_changed`, `notification_new`.
- Clients acknowledge incident broadcasts by emitting `incident_ack` with `{ ackId }` (ack callback supported).

## Role model

- **Admin** — full incident lifecycle, deletes, locations, audit visibility.
- **Security** — triage: status progression, assignments, notes.
- **Staff** — raise incidents and append notes (cannot change status or assignment).

## Security notes for real deployments

- Rotate `JWT_SECRET`, use TLS, restrict CORS to known origins, and store Mongo credentials in a secret manager.
- CCTV/SMS integrations are intentionally stubbed at the service boundary; notification plumbing is real and ready to extend.
