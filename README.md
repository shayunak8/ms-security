## ms-security monorepo

This repository is organized as a mono-repo for the casino slot machine assignment.

- `server/` – NestJS backend (game engine, cheating logic, HTTP API)
- `client/` – (planned) Vite + React + TypeScript frontend

### Backend

See `server/README.md` for:

- Backend architecture
- API contract (`/session`, `/roll`, `/cashout`)
- Cheating algorithm
- Testing and build instructions

To run backend commands:

```bash
cd server
npm install
npm run start:dev
```

### Frontend (to be added)

The client application will live under `client/` and will:

- Use `VITE_API_BASE_URL` to talk to the backend (e.g. `http://localhost:3000`)
- Implement the slot machine UI, animation, and API integration as per the assignment

