# PrepFuse

PrepFuse is an AI-Powered Placement Preparation Platform that merges Data Structures & Algorithms (DSA) tracking with targeted AI Interview Simulation. 

If a user struggles with a concept (e.g. Graph algorithms), the system detects this and dynamically instructs the AI interviewer to grill the candidate on their weak points, all whilst considering the context of their uploaded resume.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Recharts
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Integrations: Google Gemini Flash
- Authentication: JWT, Passport (GitHub OAuth), Firebase Admin (Phone OTP)

## Getting Started

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file referencing the needed environment variables (see Walkthrough documentation).

```bash
npm start
```

### 2. Frontend Setup
```bash
cd client
npm install
```
Ensure you have `VITE_API_URL=http://localhost:5000/api` in the `.env` or leave as default.
```bash
npm run dev
```

## Features
1. Multi-Auth System (Email, GitHub, Phone)
2. DSA Progress and Streak Heatmaps
3. Auto-Radar Charts identifying strong/weak computer science topics
4. Resume parsing (`pdf-parse`)
5. Interactive Interview Simulator returning graded clarity/relevance metrics.
