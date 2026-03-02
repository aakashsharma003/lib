# Library - Collaborative Learning Platform

A platform built to make learning easy and collaborative. With Library, users get filtered YouTube content for better understanding, real-time doubt-solving, and quick revision tools — all in one place.

**Live**: [link](https://join-library.vercel.app)

## Plateform Preview
<p align="center"> <img src="https://github.com/user-attachments/assets/5b1b9b0f-5ea9-4949-860d-f74810d81aae" width="90%" style="border-radius:20px; margin-bottom:20px;" /> </p> <p align="center"> <img src="https://github.com/user-attachments/assets/12eeb32b-da82-488e-8eeb-a56890ef6e9e" width="90%" style="border-radius:20px; margin-bottom:20px;" /> </p> <p align="center"> <img src="https://github.com/user-attachments/assets/7ecf4e52-d316-4d38-bc36-bf2fe20002c9" width="90%" style="border-radius:20px; margin-bottom:20px;" /> </p> <p align="center"> <img src="https://github.com/user-attachments/assets/5b9c6ff7-70f8-429a-ac60-da919ab0f797" width="90%" style="border-radius:20px; margin-bottom:20px;" /> </p> <p align="center"> <img src="https://github.com/user-attachments/assets/4246af17-afe3-4ece-be1d-752fdaafc6fd" width="90%" style="border-radius:20px; margin-bottom:20px;" /> </p> <p align="center"> <img src="https://github.com/user-attachments/assets/a19de252-a878-458c-835a-c84e5591d552" width="90%" style="border-radius:20px;" /> </p>


## Demo: [link](https://drive.google.com/file/d/1-Ov8twrXmmMkX09386QCFeFYP7t-vdin/view?usp=sharing)

---

## 🚀 Features

### 1. **YouTube Content Integration**
- Seamless integration with YouTube to bring video content directly to the platform.
- AI-powered filtering to keep content focused on education and block distractions.
- Platform source icons to identify content origin at a glance.

### 2. **AI Study Chat (Gemini)**
- Ask any question about a video and get accurate, contextual answers.
- Powered by Google Gemini with RAG (Retrieval Augmented Generation) for transcript-grounded responses.
- Smart chunking and embedding pipeline for precise context retrieval.

### 3. **User-Generated Notes & Google Drive Sync**
- Attach and share notes to videos directly from Google Drive.
- One-time Drive consent for seamless file uploads.
- Upvoting system to highlight the most useful community notes.

### 4. **Quick Revision Tools**
- AI-generated concise revision cards from video transcripts.
- Save time by revising key points instead of watching entire videos.

### 5. **Real-Time Doubt Resolution**
- Filtered comment sections for relevant discussions and doubt resolution.
- Foster collaborative learning with community-driven answers.

### 6. **Smart Onboarding Tour**
- Branded welcome experience for new users with feature walkthrough.
- Two-phase guided tour: Home page features → Video page tools.
- Personalized greeting using the user's name.

### 7. **Dark Mode & Modern UI**
- System-aware dark/light mode with smooth transitions.
- Responsive design optimized for mobile, tablet, and desktop.
- Infinite scroll video feed with skeleton loading states.

---

## 🛠️ Technologies Used

| Layer | Stack |
|-------|-------|
| **Framework** | Next.js 15 (App Router) |
| **Frontend** | React, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Prisma ORM |
| **Database** | Neon (PostgreSQL) |
| **Auth** | Clerk (Google OAuth) |
| **AI** | Google Gemini API |
| **APIs** | YouTube Data API, Kome Transcript API |
| **Storage** | Google Drive API |
| **Deployment** | Vercel |

---

## 📦 Installation and Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/aakashsharma003/lib.git
   cd lib
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
   NEXT_PUBLIC_YOUTUBE_API_URL=https://www.googleapis.com/youtube/v3
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_GEMINI_API_KEY=
   DATABASE_URL=
   CLERK_WEBHOOK_SECRET=
   YOUTUBE_TRANSCRIPT_URI=
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Links

- **Live**: [join-library.vercel.app](https://join-library.vercel.app)
- **GitHub**: [github.com/aakashsharma003/lib](https://github.com/aakashsharma003/lib)
- **LinkedIn**: [linkedin.com/company/join-library](https://www.linkedin.com/company/join-library/)
