# PrepFuse 🚀
### AI-Powered Placement Preparation Platform

![PrepFuse Banner](client/public/banner.png)

PrepFuse is an industry-leading, AI-driven platform designed to revolutionize the way candidates prepare for technical placements. By merging **Real-time DSA Tracking** with **Personalized AI Interview Simulations**, PrepFuse identifies your technical gaps and grills you where it matters most.

---

## ✨ Key Features

### 🧠 Adaptive AI Interviewer
* **Dynamic Questioning:** Generates technical and behavioral questions based on your unique resume and weak DSA topics.
* **Granular Feedback:** Graded metrics on **Clarity**, **Relevance**, and **Technical Depth** for every response.
* **Suggested Optimizations:** Get the "perfect answer" for every question you missed.

### 📊 DSA Tracker & CS Analytics
* **Mastery Heatmaps:** Track your daily coding streaks with GitHub-style activity maps.
* **Topic Radar Charts:** Automatically visualizes your proficiency across Arrays, Graphs, Dynamic Programming, and more.
* **Progress Analytics:** Real-time stats on problem difficulty distribution (Easy, Medium, Hard).

### 📄 Intelligent Resume Parsing
* Upload your PDF resume and let our AI extract your skills, projects, and experiences to tailor the interview experience specifically to you.

### 🔒 Secure Multi-Method Auth
* Sign in via **Email/Password**, **GitHub OAuth**, or **Secure Phone OTP** via Firebase.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Recharts |
| **Backend** | Node.js, Express, Multer |
| **Database** | MongoDB (Mongoose) |
| **AI Engine** | Google Gemini Flash (Generative AI) |
| **Cloud** | Cloudinary (Resume Storage), Firebase (Phone Auth) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Piyush610/PrepFuse.git
   cd PrepFuse
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   GEMINI_API_KEY=your_gemini_key
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

---

## 📸 Screen Previews

| Landing Page | DSA Dashboard |
| :---: | :---: |
| ![Landing](https://raw.githubusercontent.com/Piyush610/PrepFuse/main/client/src/assets/hero.png) | (Dashboard screenshot coming soon) |

---

## 📂 Project Structure

```text
PrepFuse/
├── client/              # React + Vite Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI & Features
│   │   ├── pages/       # Page Layouts
│   │   └── services/    # API & AI integrations
├── server/              # Node.js + Express Backend
│   ├── controllers/     # Business Logic
│   ├── models/          # MongoDB Schemas
│   ├── routes/          # API Endpoints
│   └── services/        # AI & Analytics logic
```

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ by [Piyush Kumar](https://github.com/Piyush610)**
