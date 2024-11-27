# Library - Collaborative Learning Platform  

A modern collaborative learning platform designed to enhance learning efficiency and foster community-driven knowledge sharing. Library integrates YouTube content to provide contextually filtered insights, real-time doubt resolution, and quick revision tools, creating a focused and productive environment for learners.  

---

## 🚀 Features  

### 1. **YouTube Content Integration**  
- Seamless integration with YouTube to bring video content directly to the platform.  
- Contextually filtered insights to keep learning focused.  

### 2. **User-Generated Notes**  
- Attach and share notes to videos.  
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

### 6. **Future-Ready Enhancements**  
- Plans to integrate Google Search for multi-platform content.  
- AI models for topic predictions and learning insights with 90% accuracy.  

---

## 🛠️ Technologies Used  

- **Frontend**: React.js, Tailwind CSS  
- **Backend**: Node.js, Prisma ORM, MongoDB  
- **APIs**: YouTube Data API  
- **Real-Time Communication**: Socket.io  
- **AI Tools**: TensorFlow for prediction and filtering models  

---

## 📦 Installation and Setup  

Follow these steps to set up the project locally:  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/aakashsharma003/library.git
   cd library
2. Install Dependencies

```bash
   npm install
```

3. Set Up Environment Variables
   Create a .env file in the root directory and add the following:

```bash
   env
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
   NEXT_PUBLIC_YOUTUBE_API_URL=your_youtube_api_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_GEMINI_API_KEY
   YOUTUBE_API_KEY
   Start the Development Server
```
4. Start the project locally!
```bash
   npm run dev
```
   Open in Browser
   Visit http://localhost:3000 in your browser to access the application.
