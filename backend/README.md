# EcoWarriors Backend — Setup Guide

## Quick Start

### 1. Install MongoDB (choose one option)

**Option A — MongoDB Atlas (Cloud, Recommended)**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Free signup
2. Create a **Free M0 cluster**
3. Click **Connect** → **Connect your application**
4. Copy the URI string (looks like `mongodb+srv://...`)

**Option B — Local MongoDB**
- Download from [mongodb.com/try/download](https://www.mongodb.com/try/download/community)
- After install, run: `mongod` in a terminal

### 2. Configure Environment

Edit `server/.env` and set your `MONGO_URI`:

```env
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxx.mongodb.net/ecowarriors
```

### 3. Start the Backend

```bash
cd server
npm install       # first time only
npm run dev       # starts with nodemon (auto-restart on changes)
```

Server runs at: **http://localhost:5000**

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get my profile |
| PUT | `/api/auth/profile` | ✅ | Update school/avatar |
| POST | `/api/game/save` | ✅ | Save game score |
| GET | `/api/game/leaderboard` | ❌ | Top scores (all levels) |
| GET | `/api/game/leaderboard?level=2` | ❌ | Top scores for level 2 |
| GET | `/api/game/my-scores` | ✅ | My score history |
| GET | `/api/game/stats` | ❌ | Global stats |
| GET | `/api/health` | ❌ | Server health check |

✅ = JWT Bearer token required in `Authorization` header

---

## Example Requests

### Register
```json
POST /api/auth/register
{
  "name": "ecoHero123",
  "email": "hero@example.com",
  "password": "mypassword",
  "avatar": "🌿",
  "school": "Green Valley School"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "hero@example.com",
  "password": "mypassword"
}
```

### Save Score (needs token)
```json
POST /api/game/save
Authorization: Bearer <your_jwt_token>
{
  "score": 250,
  "level": 2,
  "itemsSorted": 12,
  "accuracy": 85,
  "time": 45
}
```
