## Slot Machine Backend (NestJS)

NestJS backend implementing a simple slot machine game engine with session management, credits, cheating logic, and a small, well-defined HTTP API.

The backend is the **single source of truth** for:

- **Game state**
- **Credits**
- **Roll results**
- **Cheating logic**
- **Session lifecycle**

No game logic is performed on the client.

---

## Architecture

- **Framework**: NestJS (TypeScript)
- **Entry point**: `main.ts` bootstraps `AppModule`
- **Domain module**: `GameModule`
  - **Controller**: `GameController` – HTTP-only, exposes:
    - `POST /session`
    - `POST /roll`
    - `POST /cashout`
  - **Service**: `GameService` – orchestrates sessions, credits, and rolls
  - **Pure logic**: `game.logic.ts` – pure, deterministic functions for:
    - Roll generation
    - Win detection
    - Cheating probability and re-roll logic
    - Credits & winnings calculation
  - **Types & constants**:
    - `game.types.ts` – strong types for sessions, roll results, symbols
    - `game.constants.ts` – configuration (initial credits, costs, cheating thresholds, payouts)

**In-memory storage** is used for sessions (a `Map` keyed by `sessionId`). This is suitable for the assignment and can later be replaced by a database-backed repository without changing the HTTP contract.

---

## Running the backend

- **Install dependencies**

```bash
npm install
```

- **Start in development**

```bash
npm run start:dev
```

The server listens on port `3000` by default (or `process.env.PORT` if provided).

---

## API Contract

All endpoints are HTTP JSON APIs, no authentication.

### `POST /session`

Creates a new game session with initial credits.

**Request body**

```json
{}
```

**Response 201**

```json
{
  "sessionId": "string",
  "credits": 10
}
```

Notes:

- `sessionId` is a UUID generated on the server.
- `credits` is initialized to `10` (configurable via `INITIAL_CREDITS`).

---

### `POST /roll`

Consumes one credit from an **open** session, generates a 3-symbol roll, applies cheating rules, and returns the outcome.

**Request body**

```json
{
  "sessionId": "string"
}
```

**Response 200**

```json
{
  "symbols": ["C", "L", "O"],
  "winAmount": 0,
  "credits": 9
}
```

Fields:

- **`symbols`**: array of three symbols, each one of:
  - `"C"`, `"L"`, `"O"`, `"W"`, `"N"`
- **`winAmount`**: credits won for this roll (0 if losing roll)
- **`credits`**: updated total credits after this roll

Rules:

- **Cost per roll**: `1` credit.
- **Win condition**: all 3 symbols in `symbols` are identical.
- **Credits update**:
  - `creditsAfter = creditsBefore - 1 + winAmount`.

Error cases:

- Invalid / unknown `sessionId` → `404 Not Found` with `{ "statusCode": 404, "message": "Session not found" }`.
- Session already cashed out / closed → `400 Bad Request` with `{ "statusCode": 400, "message": "Session is closed" }`.
- Insufficient credits (`credits < 1`) → `400 Bad Request` with `{ "statusCode": 400, "message": "Insufficient credits" }`.

---

### `POST /cashout`

Closes an open session and returns the final credits.

**Request body**

```json
{
  "sessionId": "string"
}
```

**Response 200**

```json
{
  "finalCredits": 12,
  "status": "closed"
}
```

Rules:

- The session is marked as `closed`.
- After cashout, further calls to `/roll` or `/cashout` with this `sessionId` will fail gracefully:
  - `/roll` on a closed session → `400 Bad Request` (`"Session is closed"`).
  - `/cashout` again → `400 Bad Request` (`"Session is closed"`).

Error cases:

- Unknown `sessionId` → `404 Not Found` (`"Session not found"`).

---

## Cheating Algorithm

All cheating is performed **server-side** and **only after a winning roll** has been detected.

### 1. Base roll

1. Generate a 3-symbol roll:
   - Each symbol is sampled independently from `["C", "L", "O", "W", "N"]`.
2. Check if the roll is a winning roll (all 3 symbols identical).

### 2. Cheating thresholds

Cheating is based on **credits before the roll**:

- **`credits < 40`**:
  - No cheating, rolls are fully random.
- **`40 ≤ credits < 60`**:
  - `30%` chance to **re-roll** a winning result.
- **`credits ≥ 60`**:
  - `60%` chance to **re-roll** a winning result.

### 3. Cheating behavior

- If the base roll is **not** a winning roll:
  - No cheating occurs, result is returned as-is.
- If the base roll **is** a winning roll:
  - Compute the cheating probability based on credits (see above).
  - Sample a single random value in `[0, 1)`.
    - If the value is **less than** the cheating probability → **re-roll once** and return the new roll (which is likely losing).
    - Otherwise → keep the original winning roll.

Cheating never **creates** wins; it can only **destroy** wins by forcing a single re-roll.

---

## Payouts

When a roll is winning (all three symbols are the same), the payout depends on the symbol:

- `"C"` → `10` credits
- `"L"` → `20` credits
- `"O"` → `30` credits
- `"W"` → `40` credits
- `"N"` → `40` credits

Only three-of-a-kind pays out; any mixed combination yields `winAmount = 0`.

---

## Testing

- **Unit tests**:
  - `npm test`
  - Cover:
    - Roll generation & symbol set
    - Win detection
    - Cheating probability & re-roll behavior
    - Session creation, rolling, cashout, and invalid states

Tests are deterministic by injecting custom random functions into pure logic where needed.

---

## Assumptions & Edge Cases

- **In-memory sessions**:
  - Sessions are stored in-process and are lost on server restart.
  - This is acceptable for the assignment; in production, replace with persistent storage.
- **Concurrency**:
  - No explicit locking is implemented. A single instance and low contention are assumed.
- **Error format**:
  - Default NestJS error JSON is used (`statusCode`, `message`, `error`).
- **Validation**:
  - Minimal DTO validation; the controller relies on correct `sessionId` shape from the client.
  - Unknown or closed sessions are always handled gracefully with 4xx errors.
- **Cheating randomness**:
  - Only **one** re-roll is ever performed per winning spin, to keep behavior predictable.

With this contract, a frontend can:

1. `POST /session` once to start a new game and store `sessionId` and `credits`.
2. Repeatedly `POST /roll` with the same `sessionId` until the user stops or credits run out.
3. `POST /cashout` to finish the session and display the final credits to the user.
