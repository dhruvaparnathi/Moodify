# Moodify 🎧 — AI-Powered Facial Emotion Music Recommender

Moodify is a high-fidelity web application that matches your musical soundtrack to your immediate emotional state. Using advanced webcam-based facial landmark analysis, the app detects your current mood and unlocks curated playlists matched to that specific vibe.

---

## 🌟 Key Features

1. **AI Webcam Vibe Scanner**: Powered by Google MediaPipe Tasks-Vision and the ARKit 52 blendshape standard. A 2.2-second facial scan tracks emotions in real-time, resolving to:
   - Happy 😊
   - Sad 😢
   - Surprised 😲
   - Angry 😠
   - Romantic 😘
   - Calm 😌
2. **GSAP-Powered Audio Playback (VibePlayer)**: Fully animated client-side media player containing high-fidelity animations, a vinyl turntable record effect synced with state, track listings, and custom media control sliders.
3. **Secure Two-Step Auth**: Accounts are protected by JSON Web Token (JWT) sessions inside HttpOnly cookies, verified through email OTPs sent with Brevo SMTP API, and stored temporarily in a Redis server.
4. **Cloud-Hosted Asset Library**: Handles bulk uploading of songs (with automated ID3 metadata parsing using `music-metadata`) and posters straight to ImageKit.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React, Vite
- **Animations**: GSAP (GreenSock Animation Platform)
- **Computer Vision**: `@mediapipe/tasks-vision`
- **Styling**: Sass (SCSS)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: Express (Node.js)
- **Database**: MongoDB (Mongoose ORM)
- **Session & Caching**: Redis (ioredis & redis SDKs)
- **Auth & Security**: bcryptjs, jsonwebtoken, cookie-parser
- **File Storage**: Multer, `@imagekit/nodejs` (ImageKit SDK)
- **Email Delivery**: Brevo SMTP API, Axios
- **Metadata Processing**: `music-metadata` (for song tags parsing)

---

## 📁 Repository Structure

```text
Moodify/
├── Backend/
│   ├── src/
│   │   ├── config/       # Configuration (db, auth credentials)
│   │   ├── controllers/  # API business logic
│   │   ├── middlewares/  # Authentication, error handling, upload filters
│   │   ├── models/       # MongoDB schemas (User, Song, OTP)
│   │   ├── routes/       # Express route endpoints
│   │   ├── services/     # Third-party utilities (Brevo email, ImageKit storage)
│   │   ├── utils/        # Generic helper functions
│   │   └── app.js        # Express app initializer
│   ├── server.js         # Entrypoint script
│   └── package.json      # Backend configuration & dependencies
│
├── Frontend/
│   ├── src/
│   │   ├── Features/
│   │   │   ├── Auth/       # User Login & Registration pages/styles
│   │   │   ├── Expression/ # MediaPipe Facial Landmarker scanner
│   │   │   ├── Home/       # Main Dashboard and VibePlayer
│   │   │   └── shared/     # Global/Reusable UI elements
│   │   ├── app.routes.jsx  # Client routing definitions
│   │   └── main.jsx        # Frontend entry point
│   ├── vite.config.js      # Build bundler configuration
│   └── package.json        # Frontend configuration & dependencies
└── README.md               # You are here!
```

---

## ⚡ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB Connection URI](https://www.mongodb.com/products/platform/atlas-database)
- [Redis Instance](https://redis.io/)
- [ImageKit Account](https://imagekit.io/)
- [Brevo Account (formerly Sendinblue)](https://www.brevo.com/)

### 1. Backend Setup

1. Open the [Backend/package.json](file:///c:/Backend_Projects/Moodify/Backend/package.json) folder.
2. Create an environment configuration file named `.env` under [Backend/.env](file:///c:/Backend_Projects/Moodify/Backend/.env):

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Moodify
JWT_SECRET=your_jwt_signing_secret_here
NODE_ENV=development
PORT=3000

# Redis Cache Credentials
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_PASSWORD=your-redis-password

# ImageKit Credentials
IMAGEKIT_PRIVATE_KEY=private_yourKey=

# Brevo SMTP Credentials
BREVO_LOGIN=your-brevo-login-email
BREVO_PASSWORD=your-brevo-smtp-password
BREVO_API_KEY=xkeysib-your-api-key-here
BREVO_SENDER=your-registered-sender-email
```

3. Install dependencies:
```bash
cd Backend
npm install
```

4. Launch local backend server:
```bash
npm run dev
```

### 2. Frontend Setup

1. Open the [Frontend/package.json](file:///c:/Backend_Projects/Moodify/Frontend/package.json) folder.
2. Install dependencies:
```bash
cd Frontend
npm install
```

3. Launch local frontend server (Vite):
```bash
npm run dev
```

---

## 🔌 API Endpoints

### 🔐 Authentication (`/api/auth`)
- **`POST /register`**: Registers a new user. Expects `username`, `email`, `password`. Automatically generates and transmits an OTP email via Brevo.
- **`POST /verify-email`**: Verifies email OTP. Expects `email`, `otp`. Sets security context JWT in HTTP-only cookies.
- **`POST /login`**: Logs in an existing user.
- **`POST /resend-otp`**: Dispatches a new verification code.
- **`GET /logout`**: Clears authentication cookies.
- **`GET /get-me`**: Retrieves details of the authenticated user.

### 🎵 Songs (`/api/song`)
- **`POST /add`**: Uploads new tracks (`.mp3` binary payloads + automatic `music-metadata` tag parsing and ImageKit upload). Expects standard file upload form data with the parameter name `song` and body attribute `mood`.
- **`GET /`**: Fetches all available library tracks.
- **`GET /mood/:mood`**: Fetches only songs matching the mapped mood (`happy`, `sad`, `surprised`, `angry`, `calm`, `romantic`).

---

## 🧠 Expression Scanning Engine

Facial recognition is run client-side in [FaceExpression.jsx](file:///c:/Backend_Projects/Moodify/Frontend/src/Features/Expression/Components/FaceExpression.jsx) using the `@mediapipe/tasks-vision` module.
It reads the ARKit blendshape output weights dynamically:
- **Happy**: Extrapolated from `mouthSmileLeft`, `mouthSmileRight`, `cheekSquintLeft`, `cheekSquintRight`.
- **Sad**: Extrapolated from `mouthFrownLeft`, `mouthFrownRight`, `browInnerUp`, `mouthShrugLower`, `mouthShrugUpper`.
- **Surprised**: Derived from `eyeWideLeft`, `eyeWideRight`, `jawOpen`, `browInnerUp`.
- **Angry**: Derived from `browDownLeft`, `browDownRight`, `noseSneerLeft`, `noseSneerRight`, `mouthPressLeft`, `mouthPressRight`.
- **Romantic**: Captures high density from light smiles, squint levels, dimple activation, or single-eye winks (`eyeBlinkLeft` vs `eyeBlinkRight`).
- **Calm**: Calculated as the mathematical inverse (rest state) of high-intensity emotional expressions and facial tension.
