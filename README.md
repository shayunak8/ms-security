# Casino Jackpot - Slot Machine Game

A full-stack web application implementing a casino-style slot machine game with server-side cheating logic to ensure the house always wins! Built with NestJS (backend) and React + Vite (frontend).

## Project Overview

This is a **monorepo** containing:

- **Server**: NestJS backend handling game logic, sessions, and cheating mechanics
- **Client**: React + Vite frontend with animations and UI components

### Features

✅ **Session Management**: Each player gets 10 starting credits  
✅ **Game Mechanics**: 3-reel slot machine with 4 fruit symbols  
✅ **Animations**: Sequential reel reveal animations (1s, 2s, 3s)  
✅ **House Edge**: Server-side cheating logic to protect profits  
✅ **Error Handling**: Graceful error recovery with user-friendly messages  
✅ **Type Safety**: Full TypeScript implementation  
✅ **Testing**: Unit and integration tests for both layers

### Symbol Payouts

- 🍒 Cherry (C): 10 credits
- 🍋 Lemon (L): 20 credits
- 🍊 Orange (O): 30 credits
- 🍉 Watermelon (W): 40 credits

## Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- npm 9+ (comes with Node.js)
- Git

### Run Both Applications

```bash
# Clone or navigate to repository
cd ms-security

# Terminal 1: Backend
cd server
npm install
npm run start:dev
# Server runs on http://localhost:3000

# Terminal 2: Frontend
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

Open http://localhost:5173 in your browser and start playing!

## Project Structure

```
.
├── server/                   # NestJS backend
│   ├── src/
│   │   ├── game/            # Game module
│   │   │   ├── game.controller.ts      # HTTP endpoints
│   │   │   ├── game.service.ts         # Session management
│   │   │   ├── game.logic.ts           # Pure game logic
│   │   │   ├── game.constants.ts       # Game configuration
│   │   │   ├── game.types.ts           # Type definitions
│   │   │   ├── game.di.ts              # Dependency injection
│   │   │   ├── game.module.ts          # Module definition
│   │   │   ├── game.logic.spec.ts      # Logic unit tests
│   │   │   ├── game.service.spec.ts    # Service unit tests
│   │   │   └── dto/                    # Data transfer objects
│   │   ├── app.module.ts               # Root module
│   │   └── main.ts                     # Bootstrap
│   ├── test/
│   │   └── app.e2e-spec.ts            # E2E tests
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── client/                   # React + Vite frontend
    ├── src/
    │   ├── components/       # React components
    │   │   ├── Controls.tsx
    │   │   ├── SlotReels.tsx
    │   │   ├── StatusBar.tsx
    │   │   └── ErrorBoundary.tsx
    │   ├── hooks/
    │   │   └── useSlotMachine.ts   # Game state hook
    │   ├── api/
    │   │   └── client.ts           # API client
    │   ├── types/
    │   │   └── api.ts              # Type definitions
    │   ├── constants/              # UI & API constants
    │   ├── utils/
    │   │   └── errorHandler.ts     # Error utilities
    │   ├── __tests__/              # Component tests
    │   ├── App.tsx                 # Root component
    │   └── main.tsx                # Entry point
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── .env.example
```

## Development

### Backend Development

See [server/README.md](server/README.md) for:

- Architecture overview
- API documentation
- Cheating algorithm explanation
- Running tests

Key commands:

```bash
cd server

# Development
npm install
npm run start:dev      # Watch mode
npm run build          # Compile
npm start              # Production

# Testing
npm test               # Run unit tests
npm run test:watch     # Watch mode
npm run test:cov       # Coverage report
npm run test:e2e       # End-to-end tests

# Code Quality
npm run lint           # Check code
npm run format         # Auto-format code
```

### Frontend Development

See [client/README.md](client/README.md) for:

- Component architecture
- Hook documentation
- Testing setup
- Deployment guide

Key commands:

```bash
cd client

# Development
npm install
npm run dev            # Dev server on :5173
npm run build          # Production build
npm run preview        # Preview build

# Testing
npm test               # Run tests
npm test:watch         # Watch mode

# Code Quality
npm run lint           # Check code
```

## API Documentation

### Endpoints

All endpoints accept JSON and return JSON responses.

#### `POST /session`

Creates a new game session.

**Request:**

```json
{}
```

**Response (201):**

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "credits": 10
}
```

#### `POST /roll`

Performs a single roll, costing 1 credit.

**Request:**

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**

```json
{
  "symbols": ["C", "L", "O"],
  "winAmount": 0,
  "credits": 9
}
```

Errors:

- `404 Not Found`: Session doesn't exist
- `400 Bad Request`: Session closed or insufficient credits

#### `POST /cashout`

Closes a session and cashes out.

**Request:**

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**

```json
{
  "finalCredits": 45,
  "status": "closed"
}
```

## Game Rules

### Basic Rules

1. Player starts with **10 credits**
2. Each roll costs **1 credit**
3. Win = all 3 symbols identical
4. Winning payouts range from 10–40 credits
5. Player can cash out anytime

### Server-Side Cheating

The house protects its profits with progressive cheating:

| Credits | Cheat Probability | Behavior                              |
| ------- | ----------------- | ------------------------------------- |
| < 40    | 0%                | No cheating, fully random rolls       |
| 40–60   | 30%               | 30% chance to re-roll winning results |
| ≥ 60    | 60%               | 60% chance to re-roll winning results |

**How it works**: After generating a winning roll, the server rolls a random number. If it's below the cheat probability, the server generates a new (usually losing) roll and returns that instead.

This ensures:

- Small wins and losses are genuine
- Excessive winning is prevented
- The player still has a fair chance to win

## Git Workflow

### Commit Message Format

Follow semantic commit messages:

```
type(scope): subject

body

footer
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code reorganization
- `test`: Add or update tests
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons)
- `chore`: Build, dependencies, tooling

**Examples:**

```
feat(game): add cheat reroll logic
fix(client): resolve animation timing issue
test(server): add cheating algorithm tests
docs: update API documentation
```

### Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feat/cheating-logic

# Make changes
git add .
git commit -m "feat(game): implement server-side cheating"

# Push and create PR
git push origin feat/cheating-logic
```

## Testing

### Backend Tests

```bash
cd server

# Unit tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test:cov

# E2E tests
npm run test:e2e
```

**Coverage targets:**

- Game logic: 95%+
- Service layer: 90%+
- Controller: 85%+

### Frontend Tests

```bash
cd client

# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

**Current coverage:**

- Session creation and credits display
- Button interactions and disabled states
- Error handling

## Performance

### Backend Optimization

- In-memory session storage (O(1) lookup)
- Pure functions for game logic (testable, cacheable)
- Minimal dependencies

### Frontend Optimization

- React.memo on all components
- useMemo for derived state
- Lazy animation timing
- No unnecessary re-renders

### Metrics

- Initial page load: ~2s (with bundling)
- Roll API call: ~10–50ms
- Animation duration: 3 seconds (user-facing)

## Deployment

### Backend (NestJS on Node)

```bash
# Build
cd server
npm run build
```

Supports environment variables:

- `PORT`: Server port (default: 3000)

### Frontend (Static Hosting)

```bash
# Build
cd client
npm run build

# Output: dist/ directory

# Deploy to:
# - AWS S3 + CloudFront
# - Netlify
# - Vercel
# - GitHub Pages
# - Traditional web server
```

Configure backend URL:

```bash
VITE_API_BASE_URL=https://api.example.com npm run build
```

## Troubleshooting

### Backend won't start

```bash
cd server
rm -rf node_modules package-lock.json
npm install
npm run start:dev
```

### Frontend can't connect to backend

1. Ensure backend is running on http://localhost:3000
2. Check `VITE_API_BASE_URL` in client `.env.local`
3. Check browser console for CORS errors
4. Verify firewall isn't blocking port 3000

### Tests failing

```bash
# Clear cache and reinstall
npm install --no-save
npm test -- --no-cache
```

### Port already in use

```bash
# Backend (change port)
PORT=3001 npm run start:dev

# Frontend (Vite auto-selects if 5173 is taken)
npm run dev
```

## Architecture Decisions

### Why NestJS?

- Enterprise-grade framework with TypeScript first-class support
- Built-in dependency injection and module system
- Excellent for scalable REST APIs
- Strong validation with class-validator

### Why React + Vite?

- Fast development with Vite HMR
- React's component model is perfect for game UI
- TypeScript prevents runtime errors
- Excellent testing tools (Jest, React Testing Library)

### Why Monorepo?

- Single repository for related projects
- Shared CI/CD pipeline
- Easier collaboration and code review
- Simplified dependency management

## Best Practices Implemented

✅ **Type Safety**: Full TypeScript with strict mode  
✅ **Code Organization**: Clear separation of concerns  
✅ **Error Handling**: Centralized error handlers with user-friendly messages  
✅ **Testing**: Unit, integration, and E2E tests  
✅ **Documentation**: Comprehensive READMEs and JSDoc comments  
✅ **Linting**: ESLint with TypeScript support  
✅ **Constants**: No magic strings/numbers  
✅ **Memoization**: React.memo and useMemo for performance  
✅ **Accessibility**: Semantic HTML and ARIA attributes  
✅ **Error Boundaries**: Graceful error recovery

## Future Enhancements

- Database persistence (PostgreSQL)
- User authentication (JWT)
- Leaderboard/statistics
- Mobile-responsive design improvements
- Progressive Web App (PWA) features
- WebSocket for real-time multiplayer
- Admin dashboard for game management
- Payment integration for real currency
- Analytics and logging

## Contributing

1. Create a feature branch (`feat/feature-name`)
2. Make atomic commits with semantic messages
3. Ensure tests pass (`npm test` in both dirs)
4. Ensure linting passes (`npm run lint` in both dirs)
5. Push and create a pull request
6. Request review from team

## License

UNLICENSED - Internal project

## Support

For issues, questions, or contributions:

- Check existing documentation in server/README.md and client/README.md
- Review code comments and JSDoc
- Check test files for usage examples
- Review git commit history for context
