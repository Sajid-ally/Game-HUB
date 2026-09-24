# GameHub

> A full-stack gaming SaaS platform demonstrating clean end-to-end frontend and backend development with user authentication, catalog exploration, library quotas, and a demo subscription billing flow.

Repository: [https://github.com/Sajid-ally/Game-HUB](https://github.com/Sajid-ally/Game-HUB)

---

## Overview

GameHub is built as a focused full-stack web application designed for technical evaluation. Rather than building a generic CRUD dashboard or introducing bloated dependencies, the goal of this project was to implement a realistic gaming SaaS workflow:

1. **User Authentication & Session Management**: Secure user registration and login using JWTs stored client-side and verified via Express middleware, with hashed passwords using `bcryptjs`.
2. **Dedicated Onboarding**: New signups land on a dedicated `/welcome` route before transitioning to their main dashboard or catalog.
3. **Gaming Catalog & Details**: Browse fictional game titles with genre filtering, live search, ratings, and detailed game views.
4. **Library Management with Tier Limits**: Free tier users can curate up to 3 games in their personal cloud library. Attempting to add a 4th game triggers a quota block with direct upgrade prompts.
5. **Interactive Demo Payment System**: Users can test upgrading to the Pro plan (`₹299/mo`) via a simulated checkout interface (`/checkout`) that writes transaction records to MongoDB and grants unlimited library storage immediately.
6. **Account & Billing History**: A comprehensive profile view showing user credentials, current subscription status, cloud sync state, and a full ledger of mock orders.

---

## Tech Stack & Design Philosophy

The project adheres strictly to fundamental web technologies without over-engineering:

### Frontend
- **React (v19)** — Functional components with modern hooks (`useState`, `useEffect`, `useContext`, `useMemo`).
- **Vite** — High-speed build tooling and local development server.
- **React Router (`react-router-dom` v7)** — Client-side SPA routing with protected route wrappers (`ProtectedRoute.jsx`).
- **Axios** — Centralized API service with request interceptors for automatic JWT header injection and response error interceptors.
- **Plain CSS** — Handcrafted stylesheet (`index.css`) built around a **Light Gradient SaaS aesthetic** (Linear/Stripe-inspired), using ambient radial mesh gradients, custom SVGs (strictly emoji-free), and the **Outfit** + **Plus Jakarta Sans** font pairing.

### Backend
- **Node.js & Express.js** — Modular REST API architecture with dedicated controllers, routes, and middleware.
- **MongoDB & Mongoose** — Document schemas for `User`, `Game`, and `Order`, with automatic auto-seeding on initial connection.
- **JSON Web Tokens (`jsonwebtoken`)** — Stateless authentication with Bearer tokens.
- **bcryptjs** — Salted password hashing (cost factor 10).
- **CORS & Dotenv** — Standard cross-origin security and environment variable isolation.

*Intentionally excluded*: TypeScript, Redux, Next.js, Docker, GraphQL, microservices, or external UI component libraries.

---

## Project Structure

```text
GameHub/
├── backend/
│   ├── config/
│   │   ├── db.js             # Mongoose connection & auto-seed trigger
│   │   ├── seed.js           # Standalone seed runner (`npm run seed`)
│   │   └── seedData.js       # 8 fictional games with metadata & high-res artwork
│   ├── controllers/
│   │   ├── authController.js # register, login, getMe
│   │   ├── gameController.js # getGames, getGameById, addToLibrary (with quota check)
│   │   ├── paymentController.js # demoPayment (creates Order, updates plan to 'pro')
│   │   └── userController.js # getProfile, getLibrary
│   ├── middleware/
│   │   └── authMiddleware.js # Bearer token validation & req.user attachment
│   ├── models/
│   │   ├── Game.js           # Title, genre, price, rating, thumbnail, description
│   │   ├── Order.js          # User reference, plan, amount, status, paymentMethod
│   │   └── User.js           # Credentials, plan enum ('free'|'pro'), library array
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── gameRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js             # Express app bootstrap & route registration
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx        # SaaS footer with clean SVG branding
│   │   │   ├── GameCard.jsx      # Catalog card with library status & quick actions
│   │   │   ├── Navbar.jsx        # Navigation bar, user chip & auth actions
│   │   │   └── ProtectedRoute.jsx# Auth guard redirecting guests to /login
│   │   ├── pages/
│   │   │   ├── CheckoutPage.jsx  # Demo payment card form & instant upgrade
│   │   │   ├── DashboardPage.jsx # Stats (Library count, Plan, Quota) & recent games
│   │   │   ├── GameDetailsPage.jsx # In-depth game info & add-to-library action
│   │   │   ├── GamesPage.jsx     # Filterable, searchable games catalog
│   │   │   ├── LandingPage.jsx   # Hero section, feature breakdown, social proof
│   │   │   ├── LibraryPage.jsx   # User's personal collection & quota tracker
│   │   │   ├── LoginPage.jsx     # User authentication
│   │   │   ├── PricingPage.jsx   # Free vs. Pro SaaS comparison table
│   │   │   ├── ProfilePage.jsx   # Account details & demo billing history
│   │   │   ├── RegisterPage.jsx  # Account creation with validation
│   │   │   └── WelcomePage.jsx   # Dedicated onboarding welcome screen
│   │   ├── services/
│   │   │   ├── api.js            # Axios client with JWT interceptor
│   │   │   └── AuthContext.jsx   # User session, login, register, logout, sync
│   │   ├── App.jsx               # Route declarations & main layout
│   │   ├── index.css             # Light gradient styles, responsive breakpoints
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Quickstart Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (default: `mongodb://127.0.0.1:27017/gamehub`) or a MongoDB Atlas connection string.

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (you can copy `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/gamehub
JWT_SECRET=supersecret_gamehub_jwt_key_2026
```

Start the backend server:

```bash
# Production / standard mode:
npm start

# Development mode (auto-restart on file change):
npm run dev
```

> **Automatic Seeding**: When the server connects to MongoDB, it automatically checks if any games exist. If the collection is empty, it seeds 8 fictional games automatically. You can also re-seed manually at any time with `npm run seed`.

---

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Visit the app in your browser at:
```
http://localhost:5173
```

---

## Evaluator Walkthrough (2-Minute Test Flow)

To quickly test all core full-stack features:

1. **Register**: Click **Get Started** on the navbar and create a new account (e.g., `alex@example.com`).
2. **Onboarding**: Observe that registration redirects directly to `/welcome` with quick navigation paths.
3. **Dashboard**: Navigate to `/dashboard` — notice you start on the **FREE** tier with 0/3 games used.
4. **Browse Catalog**: Go to **Browse Games** (`/games`), search by title or filter by genre (e.g., Sci-Fi, RPG, Racing).
5. **Enforce Free Quota**:
   - Add 3 games to your library.
   - Attempt to add a 4th game.
   - Observe the 403 response caught cleanly by the UI with an inline upgrade alert: *"Free plan limit reached (max 3 games). Upgrade to Pro for unlimited games."*
6. **Demo Upgrade Flow**:
   - Click **Upgrade to Pro** in the navbar or on the quota prompt.
   - You will land on `/checkout` (`₹299/mo`).
   - Use the pre-filled demo card or enter mock credentials and click **Complete Demo Payment**.
   - Your account is instantly upgraded to **PRO** in MongoDB, an Order receipt is created, and you are redirected to `/dashboard`.
7. **Verify Unlimited Access**:
   - Return to `/games` and add the 4th game. It will now succeed without any quota restrictions.
   - Visit **My Library** (`/library`) to see your full collection.
8. **Check Billing Records**:
   - Open **Profile** (`/profile`). View your subscription badge (`PRO MEMBER`), account details, and the transaction record in the **Subscription & Billing History** table.
9. **Sign Out**:
   - Click **Sign Out**. The JWT is cleared from `localStorage` and you are redirected to `/login`. Trying to access `/dashboard` or `/library` directly will redirect you back to `/login`.

---

## REST API Reference

All protected endpoints require an `Authorization: Bearer <token>` header.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create account (`name`, `email`, `password`, `confirmPassword`) | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user data from token | Yes |

### Games (`/api/games`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/games` | Retrieve all games (supports `?search=` and `?genre=`) | No |
| `GET` | `/api/games/:id` | Retrieve single game by MongoDB ID | No |
| `POST` | `/api/games/:id/library` | Add game to user library (enforces 3-game quota if Free) | Yes |

### User & Library (`/api/user`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Retrieve user details, library count, and demo orders | Yes |
| `GET` | `/api/user/library` | Retrieve list of games in user's library with timestamps | Yes |

### Demo Payment (`/api/payment`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payment/demo` | Process mock payment, create `Order`, upgrade plan to `pro` | Yes |

---

## Key Backend Implementation Details

- **Quota Enforcement**: In `backend/controllers/gameController.js`, `addToLibrary` checks `user.plan === 'free' && user.library.length >= 3` on the server before modifying any database records. This guarantees security even if client-side validation is bypassed.
- **Stateless Tokens**: JWTs expire in 7 days and encode the MongoDB `user._id`. The `authMiddleware.js` extracts the Bearer token, verifies signature integrity, and attaches the sanitized user document to `req.user`.
- **Atomic Plan Upgrades**: When a user completes the demo checkout, `paymentController.js` creates a persistent `Order` document and updates the user's `plan` field to `'pro'` in MongoDB within the same request lifecycle.

---

## License

This project was built for technical evaluation purposes. All game names, artwork, and descriptions are fictional.
