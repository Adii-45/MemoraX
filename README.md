📘 MemoraX

AI-Powered Smart Study Assistant
Turn your documents into flashcards, quizzes, summaries & contextual chat instantly.

⸻

🚀 Overview

MemoraX is an intelligent learning platform that transforms uploaded documents into:
    •    🧠 Smart Flashcards
    •    📝 AI-Generated Quizzes
    •    📄 Structured Summaries
    •    💬 Context-Aware Chat
    •    ⭐ Starred Flashcards
    •    🔁 Review Tracking System

Built using modern full-stack technologies and powered by Google Gemini AI.

⸻

✨ Features

📄 Document Processing
    •    Upload documents
    •    Automatic text chunking
    •    MongoDB storage
    •    Status tracking (processing / ready)

⸻

🧠 AI Flashcards
    •    Generate customizable number of flashcards
    •    Difficulty tagging (easy / medium / hard)
    •    Review tracking
    •    Star / Unstar system
    •    Delete functionality

⸻

📝 AI Quiz Generator
    •    Multiple-choice questions
    •    4 options per question
    •    Correct answer detection
    •    Difficulty tagging
    •    Explanations included

⸻

📄 AI Summary
    •    Structured and concise summary
    •    Key concepts highlighted
    •    Optimized for learning retention

⸻

💬 Context-Aware Chat
    •    Ask questions based on uploaded document
    •    Returns:
    •    Answer
    •    Relevant chunk indices
    •    Chat history ID
    •    Persistent chat history storage

⸻

📘 Concept Explainer
    •    Explain specific topics from document context
    •    Clear educational responses
    •    Example-based explanations

⸻

🛠 Tech Stack

Backend
    •    Node.js
    •    Express.js
    •    MongoDB
    •    Mongoose
    •    Google Gemini AI (@google/genai)
    •    JWT Authentication
    •    Multer (file handling)
    •    dotenv

AI Model
    •    gemini-2.5-flash-lite

⸻

📂 Project Structure

```
backend/
│
├── controllers/
│   ├── authController.js
│   ├── documentController.js
│   ├── aiController.js
│   └── flashcardController.js
│
├── models/
│   ├── User.js
│   ├── Document.js
│   ├── Flashcard.js
│   ├── Quiz.js
│   └── ChatHistory.js
│
├── routes/
│   ├── authRoutes.js
│   ├── documentRoutes.js
│   ├── aiRoutes.js
│   └── flashcardRoutes.js
│
├── utils/
│   └── geminiService.js
│
└── server.js
```

⸻

🔐 Environment Variables

Create a .env file inside /backend:

```
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=
JWT_EXPIRE= 
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
MAX_FILE_SIZE=10485760
```

⸻

⚙️ Installation

```
git clone https://github.com/yourusername/memorax.git
cd memorax/backend
npm install
npm run dev
```

⸻

Server runs on: 
```
http://localhost:8000
```

⸻

📊 Current Status

✅ Flashcard Generation
✅ Quiz Generation
✅ Summary Generation
✅ Contextual Chat
✅ Concept Explanation
✅ Review Tracking
✅ Star Toggle
✅ Delete Flashcards
✅ JWT Auth
✅ MongoDB Connected

⸻

🚧 Upcoming Features
    •    📅 Spaced Repetition Algorithm
    •    📊 Study Analytics Dashboard
    •    🧾 PDF Parsing Improvements
    •    🌐 Frontend (React / MERN full-stack)
    •    🔁 Retry logic for AI 503 handling
    •    📦 Caching layer for AI responses

⸻

🧠 Why MemoraX?

Instead of passively reading notes, MemoraX converts content into:
    •    Active recall flashcards
    •    Practice quizzes
    •    Instant explanations
    •    Smart Q&A system

It transforms documents into an interactive study system.

⸻
