# Stock Entry

A simple full-stack app for sharing stock suggestions between Archit and Achyutananda, with WhatsApp notifications via CallMeBot.

## Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + Mongoose (Node.js)
- **Database**: MongoDB Atlas (free tier)
- **Notifications**: CallMeBot (free WhatsApp API)

## Project Structure

```
stock-entry/
├── src/                   # React frontend
│   ├── components/        # Navbar, SuggestionCard
│   ├── pages/             # Home, Post
│   └── types/             # TypeScript types
├── backend/               # Express API
│   └── src/
│       ├── models/        # Mongoose schema
│       ├── routes/        # API routes
│       └── services/      # WhatsApp notification service
└── README.md
```

## Setup

### 1. MongoDB Atlas

1. Go to https://cloud.mongodb.com and create a free account.
2. Create a free M0 cluster.
3. Add a database user (username + password).
4. Whitelist your IP (or use `0.0.0.0/0` for development).
5. Click "Connect" → "Drivers" → copy the connection string.
6. Replace `<password>` in the string with your actual password.

### 2. WhatsApp Notifications (CallMeBot)

Both Archit and Achyutananda need to activate CallMeBot separately:

1. Add the number **+34 644 65 21 48** to WhatsApp contacts.
2. Send this exact message: `I allow callmebot to send me messages`
3. You'll receive a reply with your personal API key.
4. Copy the API key into your `.env` file.

No sign-up, no paid plan — this is completely free for personal use.

### 3. Environment Variables

**Backend** (`backend/.env`):

```env
PORT=3001
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/stock-entry?retryWrites=true&w=majority

ARCHIT_PHONE=91XXXXXXXXXX
ARCHIT_CALLMEBOT_APIKEY=XXXXXXXX

ACHYUTANANDA_PHONE=91XXXXXXXXXX
ACHYUTANANDA_CALLMEBOT_APIKEY=XXXXXXXX
```

Phone format: country code + number, no `+` or spaces. Example: `919876543210`

## Running Locally

**Terminal 1 — Backend:**

```bash
cd backend
cp .env.example .env   # then fill in your values
npm install
npm run dev
```

**Terminal 2 — Frontend:**

```bash
npm install
npm run dev
```

Frontend runs on http://localhost:5173 and proxies `/api` requests to the backend at port 3001.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/suggestions` | List all suggestions (newest first) |
| POST | `/api/suggestions` | Create new suggestion + trigger notification |
| GET | `/api/health` | Health check |

## Deployment Notes

- Deploy the `backend/` folder as a Node.js service (Railway, Render, Fly.io — all have free tiers).
- Deploy the frontend with `npm run build` and serve the `dist/` folder (Vercel, Netlify).
- Set the `MONGODB_URI` and WhatsApp env vars in your hosting provider's dashboard.
- Update the Vite proxy target if the backend URL changes (or use `VITE_API_URL`).
