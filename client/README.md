# Slot Machine Client (React + Vite)

This is the frontend client for the casino slot machine assignment.
It is implemented with **Vite + React + TypeScript** and integrates with the NestJS backend under `../server`.

The client is intentionally small and focused:

- Single-page UI with a 3-slot row
- All game logic handled by the backend
- Typed API layer
- Basic Jest + React Testing Library coverage

## Architecture

- `src/main.tsx` – React entry point, renders `<App />` to `#root`.
- `src/App.tsx` – top-level composition:
  - Wires up the `useSlotMachine` hook.
  - Renders status, reels, and controls.
- `src/hooks/useSlotMachine.ts` – client-side orchestration:
  - Creates and tracks the current session (`sessionId`, `credits`, `isSessionClosed`).
  - Invokes backend API for `/session`, `/roll`, `/cashout`.
  - Drives spinning state (`X`) and delayed reveal using `setTimeout`.
- `src/api/client.ts` – typed API layer:
  - `createSession()`, `roll(sessionId)`, `cashout(sessionId)`.
  - Uses `VITE_API_BASE_URL` to determine backend base URL.
  - Centralizes error handling and always throws `Error` with a clean message.
- `src/types/api.ts` – shared API types:
  - `SlotSymbol = 'C' | 'L' | 'O' | 'W'`
  - `SessionResponse`, `RollResponse`, `CashoutResponse`.
- `src/components/` – presentational components:
  - `SlotReels` – displays 3 blocks in a row (letters or `X`).
  - `Controls` – Start / Roll / Cash Out buttons with proper disabled states.
  - `StatusBar` – session ID, credits, last win, and error display.

All credits, win detection, and cheating logic live **only** on the backend.

## API Integration

The client talks to the backend via:

- **Environment variable**: `VITE_API_BASE_URL`
- Default (if unset): `http://localhost:3000`

File:

- `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

Requests are made to:

- `POST ${VITE_API_BASE_URL}/session`
- `POST ${VITE_API_BASE_URL}/roll`
- `POST ${VITE_API_BASE_URL}/cashout`

The client never re-computes wins or credits; it always trusts the backend’s `winAmount` and `credits`.

## Running Client and Server

From the repository root:

```bash
# Backend
cd server
npm install
npm run start:dev

# Frontend
cd ../client
npm install
cp .env.example .env    # or create .env manually
npm run dev
```

Then open the URL printed by Vite (typically `http://localhost:5173`).

## Testing

The client uses **Jest + React Testing Library**:

- Config: `jest.config.cjs`
- Setup: `src/setupTests.ts`

Current coverage:

- `src/__tests__/App.session.test.tsx`
  - Verifies that starting a game (mocked `POST /session`) displays credits from the server.

Run tests:

```bash
cd client
npm test
```

## Build

Before merging the client feature branch, ensure the build passes:

```bash
cd client
npm run build
```

