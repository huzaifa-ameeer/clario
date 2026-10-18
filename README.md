# Clarious

**Turn any PDF or Word document into a clean, scannable AI summary.**

Upload a document, and Clarious reads every page and returns a catchy title plus 8–12 punchy bullet points — ready to scan in seconds.

![Hero section](ss/1.png)

**Live app:** https://clarious.vercel.app

---

## Features

- **Upload & analyze** — drag-and-drop or pick a PDF/DOCX (up to 5MB) and get an AI-generated summary with colored, numbered bullets
- **Realtime progress** — ChatGPT-style spinner, upload progress bar, and a cancel button that aborts the request mid-flight
- **History library** — drill-down views: list → document details → full AI summary, with delete + two-step delete confirmation
- **Auth done right** — JWT stored in an HTTP-only cookie, OTP-based password reset (emails via Resend), protected routes
- **Light & dark mode** — instant theme switching, remembered across visits
- **Responsive** — works from mobile to desktop
- **Toast notifications** — stacked, success/error, auto-dismiss

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, lucide-react |
| Backend | Node.js, Express 5, Mongoose 9, JWT, Multer, bcryptjs |
| AI | Google Gemini (with automatic model fallback) |
| Email | Resend |
| Deploy | Vercel (frontend), Render (backend), MongoDB Atlas (DB) |

---

## Getting started (local)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in your values
npm run dev            # starts on http://localhost:8000
```

Required env vars (see `server/.env.example`):

| Variable | Description |
|---|---|
| `PORT` | Server port (default 8000) |
| `CLIENT_URL` | Comma-separated allowed origins, e.g. `http://localhost:5173` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret for signing tokens |
| `RESEND_API_KEY` | API key from resend.com (OTP emails) |
| `EMAIL_FROM` | Sender address, e.g. `Clarious <onboarding@resend.dev>` |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `GEMINI_MODELS` | Optional comma-separated model override list |

### 2. Frontend

```bash
cd client
npm install
npm run dev             # starts on http://localhost:5173
```

Local dev needs no env vars — the API falls back to `http://localhost:8000/api`.

---

## API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account |
| POST | `/api/auth/login` | – | Login (sets cookie) |
| POST | `/api/auth/logout` | – | Clear session |
| POST | `/api/auth/forget-password` | – | Send OTP email |
| POST | `/api/auth/resend-otp` | – | Resend OTP |
| POST | `/api/auth/verify-otp` | – | Reset password |
| POST | `/api/documents/analyze` | ✅ | Upload + analyze a file (field: `file`) |
| GET | `/api/documents` | ✅ | List my history |
| GET | `/api/documents/:id` | ✅ | Document details |
| DELETE | `/api/documents/:id` | ✅ | Delete a document |
| GET | `/health` | – | Health check |

---

## Deployment

**Frontend (Vercel)** — root directory `client`, env:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

**Backend (Render)** — root directory `server`, build `npm install`, start `npm start`, env:

```
CLIENT_URL=https://clarious.vercel.app
MONGO_URI=...
JWT_SECRET=...
RESEND_API_KEY=...
EMAIL_FROM=...
GEMINI_API_KEY=...
NODE_ENV=production
```

`NODE_ENV=production` (or an `https://` `CLIENT_URL`) switches cookies to `SameSite=None; Secure`, which is required for auth to work across different domains.

---

## Project structure

```
clario/
├── client/          # React + Vite + Tailwind app
│   └── src/
│       ├── components/   # Navbar, Hero, Features, Footer, ...
│       ├── pages/        # Home, Login, Signup, Main, History, ...
│       └── utils/        # api (axios), notify
├── server/          # Express + Mongoose API
│   └── src/
│       ├── controllers/  # auth, documents
│       ├── routes/       # /api/auth, /api/documents
│       ├── middleware/   # auth (JWT), upload (multer)
│       ├── models/       # User, Document
│       ├── services/     # Gemini AI
│       └── utils/        # email, text extraction
└── ss/              # screenshots used in this README
```
