# Library — Collaborative Learning Platform

> **Note:** The Transcript module is currently experiencing some errors; therefore, I am attaching a video that may not serve as the best example for demonstrating our features. Additionally, the "Ask" feature has been temporarily resolved with a workaround, so I apologize for any inconvenience this may cause, as it might not work for some videos in the live link.

A collaborative learning platform to discover, share, and engage with educational content across YouTube, Udemy, Coursera, and more — all in one place. Library filters out distractions, surfaces high-quality videos, and gives you AI-powered study tools so you can focus on learning.

## Our Services
![Screenshot 2024-12-13 214747](https://github.com/user-attachments/assets/91b8914b-b32c-49d6-98aa-102ab4ac3a01)
![Screenshot 2024-12-13 215036](https://github.com/user-attachments/assets/72acb7d4-3d6e-4f51-9e35-dea4759ad8b8)
![Screenshot 2024-12-13 215129](https://github.com/user-attachments/assets/ae2d57db-eb44-4a61-8e1f-df7dd0a6070c)
![Screenshot 2024-12-13 215344](https://github.com/user-attachments/assets/aaa34449-60c5-4f2a-8989-937ba89a4a26)

## Demo: [link](https://drive.google.com/file/d/1-Ov8twrXmmMkX09386QCFeFYP7t-vdin/view?usp=sharing)

## Key Upgrade in Focus
 - Will try to implement RAG (Retrieval Augmented Generation) to provide smart and context-aware learning assistance
 -  References: [Amazon Transcribe](https://aws.amazon.com/pm/transcribe/), [Neon databases](https://neon.tech/?ref=gsy1)

---

## 🚀 Features

### 1. **Multi-Platform Content Integration**
- Aggregates educational videos from YouTube, Udemy, Coursera, and other learning platforms.
- Platform source icons let you instantly see where each video comes from.
- AI-powered filtering keeps content focused on education.

### 2. **User-Generated Notes**
- Attach and share notes to videos via Google Drive integration.
- Upvoting system for quality content to highlight the most useful notes.

### 3. **Quick Revision Tools**
- AI-powered suggestions for concise summaries and tips related to the topic.
- Save time by revising key points instead of watching entire videos.

### 4. **Real-Time Doubt Resolution**
- Filtered comment sections for relevant discussions and doubt resolution.
- Foster collaborative learning with community-driven answers.

### 5. **Intelligent Filtering System**
- Block distractions and entertainment content during focused learning sessions.
- Enable a distraction-free learning environment.

### 6. **AI Study Chat**
- Gemini-powered Q&A grounded in the video's actual transcript.
- Ask specific questions about any video and get accurate, contextual answers.

---

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Node.js, Prisma ORM, Neon (PostgreSQL)
- **Auth**: Clerk (Google OAuth)
- **AI**: Google Gemini API
- **APIs**: YouTube Data API, Kome Transcript API

---

## 📦 Installation and Setup

Follow these steps to set up the project locally:

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
   Create a `.env` file in the root directory and add:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
   NEXT_PUBLIC_YOUTUBE_API_URL=https://www.googleapis.com/youtube/v3
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_GEMINI_API_KEY=
   DATABASE_URL=
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to open the app.

---

## 🔗 Links

- **Live**: [join-library.vercel.app](https://join-library.vercel.app)
- **GitHub**: [github.com/aakashsharma003/lib](https://github.com/aakashsharma003/lib)
- **LinkedIn**: [linkedin.com/company/join-library](https://www.linkedin.com/company/join-library/)
