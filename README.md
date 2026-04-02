# AdaptiveLMS

An adaptive learning platform that adjusts quiz difficulty in real time based on student performance using Bayesian Knowledge Tracing (BKT).

## Tech Stack

- **Frontend**: React.js + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + MongoDB
- **ML Service**: Python + FastAPI + BKT Model
- **Auth**: JWT

## Features

- Multi-subject quiz system (Math, Science, History, English, CS)
- Adaptive difficulty using BKT model
- Real-time mastery tracking per topic
- Leaderboard, analytics, and study streaks
- Score history with best score tracking
- Retake flow with score reset confirmation

## Setup

### 1. Clone the repo
git clone https://github.com/yourusername/adaptive-lms.git
cd adaptive-lms

### 2. Backend
cd backend
npm install
cp .env.example .env        # fill in your values
node seedLarge.js           # seed questions
node server.js

### 3. ML Service
cd ml-service
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install fastapi uvicorn numpy
uvicorn main:app --reload --port 8000

### 4. Frontend
cd frontend
npm install
npm start

## Environment Variables

Create `backend/.env`:
PORT=5000
MONGO_URI=mongodb://localhost:27017/adaptive-lms
JWT_SECRET=your_secret_here
ML_SERVICE_URL=http://localhost:8000
```

---

## Step 3 — Create a `.env.example` so others know what's needed

Create **`backend/.env.example`**:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/adaptive-lms
JWT_SECRET=your_jwt_secret_here
ML_SERVICE_URL=http://localhost:8000