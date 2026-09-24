# GameHub

GameHub is a modern full-stack gaming SaaS web application where users can discover fictional games, manage a personal cloud gaming library, and subscribe to membership tiers. Built with a clean dark gaming aesthetic, GameHub features JWT authentication, protected routes, a 3-game quota on the Free tier, and an interactive demo checkout flow that upgrades users to the Pro tier without real credit card transactions.

---

## Features

* **JWT Authentication**: Secure user registration and login with encrypted passwords using `bcryptjs` and stateless `jsonwebtoken`.
* **Dedicated Post-Registration Welcome**: Seamless onboarding route (`/welcome`) immediately after registration that guides users to explore games or jump straight to their dashboard.
* **Protected Routes**: Client-side and server-side route guards preventing unauthorized access to library, dashboard, checkout, and profile.
* **Gaming Library**: Browse fictional titles, inspect full details with ratings, and add games to a personal library.
* **SaaS Tier Restrictions**: Enforced 3-game limit on the Free tier with real-time feedback and upgrade prompts.
* **Demo Payment System**: A simulated checkout flow (`/checkout`) that processes mock transactions and upgrades users to the Pro tier (`₹299/mo`) with an order record stored in MongoDB.
* **REST API**: Clean Express REST API structured with dedicated controllers, routes, models, and middleware.
* **MongoDB Database**: Document-based persistence with Mongoose schemas for Users, Games, and Orders, including automatic initial data seeding.

---

## Tech Stack

### Frontend
* **React** (v19) — UI component library
* **Vite** — Fast frontend build tool and dev server
* **React Router** (`react-router-dom` v7) — Client-side SPA routing
* **Axios** — HTTP client with auth token interceptors
* **Plain CSS** — Dark gaming SaaS theme with responsive layout and glass-style cards

### Backend
* **Node.js** — JavaScript runtime environment
* **Express.js** — REST API web framework
* **MongoDB & Mongoose** — NoSQL database and object data modeling
* **JWT** (`jsonwebtoken`) — Token-based user authentication
* **bcryptjs** — Password hashing algorithm
* **cors** & **dotenv** — Cross-origin requests and environment variable configuration

---

## Project Structure

```text
GameHub/
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, GameCard, ProtectedRoute
│   │   ├── pages/          # Landing, Register, Welcome, Login, Dashboard, Games, Details, Pricing, Checkout, Library, Profile
│   │   ├── services/       # Axios API client (api.js) and AuthContext (AuthContext.jsx)
│   │   ├── App.jsx         # App router and layout
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Plain CSS styling for entire application
│   └── package.json
│
├── backend/
│   ├── config/             # MongoDB connection (db.js) and game seeds (seed.js, seedData.js)
│   ├── controllers/        # authController, gameController, userController, paymentController
│   ├── middleware/         # authMiddleware (JWT verification)
│   ├── models/             # Mongoose schemas: User, Game, Order
│   ├── routes/             # authRoutes, gameRoutes, userRoutes, paymentRoutes
│   ├── server.js           # Express app entry point
│   ├── .env.example        # Sample environment configuration
│   └── package.json
│
├── README.md               # Documentation and local setup instructions
└── .gitignore              # Git ignore rules for node_modules and secrets
```

---

## API Routes

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (name, email, password, confirmPassword) | No |
| `POST` | `/api/auth/login` | Log in user and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user data | Yes |

### Games (`/api/games`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/games` | Fetch all 8 fictional games | No |
| `GET` | `/api/games/:id` | Fetch single game details by ID | No |
| `POST` | `/api/games/:id/library` | Add game to user library (enforces 3-game limit for Free plan) | Yes |

### User (`/api/user`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Retrieve user profile, account status, and order history | Yes |
| `GET` | `/api/user/library` | Retrieve user's personal game library with added dates | Yes |

### Demo Payment (`/api/payment`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payment/demo` | Process demo payment, create Order record, and upgrade plan to `pro` | Yes |

---

## Environment Variables

Create a `.env` file inside the `backend` directory. A template is available in `backend/.env.example`.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/gamehub
JWT_SECRET=your_jwt_secret_key_here
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port for Express backend server | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/gamehub` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens | Any secure string |

---

## Running Locally

### 1. Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB** (local community server running at `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

### 2. Start the Backend
Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
npm run dev
```

> **Note:** The backend server will automatically connect to MongoDB and auto-seed the 8 fictional games if the database collection is empty. You can also manually re-seed anytime with `npm run seed`.

### 3. Start the Frontend
Open a second terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Open your browser and visit:
```
http://localhost:5173
```

---

## Evaluation Checklist

- [x] Frontend builds with `npm run build`
- [x] Backend starts and connects to MongoDB
- [x] Database seeded with 8 fictional games
- [x] Register user -> redirects to dedicated `/welcome` page
- [x] Login existing user -> redirects directly to `/dashboard`
- [x] Protected routes return 401 Unauthorized without valid JWT
- [x] Browse games catalog and view individual game details
- [x] Add games to library with Free plan limit check (max 3 games)
- [x] Demo payment checkout upgrades user from `free` to `pro`
- [x] Pro users can add unlimited games to their library
- [x] User profile displays name, email, member since date, and demo order history
- [x] Logout clears JWT and redirects to login
