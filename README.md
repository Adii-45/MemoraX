# MemoraX

AI-Powered Smart Study Assistant that transforms documents into flashcards, quizzes, summaries, and contextual AI chat.

---

## Overview

MemoraX is an intelligent learning platform that allows users to:

- Upload documents
- Generate AI-powered flashcards
- Create quizzes automatically
- Generate structured summaries
- Chat contextually with their document
- Track learning progress

Built using a modern full-stack architecture and powered by Google Gemini AI.

---

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Profile management

### Document Processing
- Upload PDF documents
- Automatic text extraction
- Intelligent text chunking
- MongoDB storage
- Status tracking (processing / ready)

### AI Flashcards
- Generate customizable number of flashcards
- Difficulty tagging (easy / medium / hard)
- Star / unstar flashcards
- Review tracking
- Delete functionality

### AI Quiz Generator
- Auto-generated multiple choice questions
- 4 options per question
- Correct answer detection
- Difficulty tagging
- Score calculation
- Result storage

### AI Summary
- Structured summaries
- Key concepts highlighted
- Optimized for learning retention

### Context-Aware Chat
- Ask questions based on uploaded document
- Relevant chunk retrieval
- Persistent chat history
- Chat history per document

### Progress Tracking
- Total documents uploaded
- Total quizzes attempted
- Average quiz score
- Flashcard review statistics
- User learning analytics

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Google Gemini AI (@google/genai)
- JWT Authentication
- Multer (file handling)
- dotenv

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Context API
- React Hot Toast
- Lucide Icons

### AI Model
- gemini-2.5-flash-lite

---

## Project Structure

```
MEMORAX
│
├── backend
│   ├── config
│   │   ├── db.js
│   │   └── multer.js
│   │
│   ├── controllers
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── documentController.js
│   │   ├── flashcardController.js
│   │   ├── progressController.js
│   │   └── quizController.js
│   │
│   ├── middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── Flashcard.js
│   │   ├── Quiz.js
│   │   └── ChatHistory.js
│   │
│   ├── routes
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── flashcardRoutes.js
│   │   ├── progressRoutes.js
│   │   └── quizRoutes.js
│   │
│   ├── utils
│   │   ├── geminiService.js
│   │   ├── pdfParser.js
│   │   └── textChunker.js
│   │
│   ├── uploads
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/memora-x
    ├── public
    ├── src
    │   ├── assets
    │   ├── components
    │   ├── context
    │   │   └── AuthContext.jsx
    │   │
    │   ├── pages
    │   │   ├── Auth
    │   │   │   ├── LoginPage.jsx
    │   │   │   └── RegisterPage.jsx
    │   │   ├── Dashboard
    │   │   ├── Documents
    │   │   ├── FlashCards
    │   │   ├── Profile
    │   │   ├── Quizzes
    │   │   └── NotFoundPage.jsx
    │   │
    │   ├── services
    │   ├── utils
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
```

---

## API Routes

### Auth Routes
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile
- PUT /api/auth/password

### Document Routes
- POST /api/documents/upload
- GET /api/documents
- GET /api/documents/:id
- DELETE /api/documents/:id
- PUT /api/documents/:id

### Flashcard Routes
- GET /api/flashcards/:documentId
- POST /api/flashcards
- PUT /api/flashcards/:cardId/star
- DELETE /api/flashcards/:id

### Quiz Routes
- GET /api/quizzes/:documentId
- GET /api/quizzes/:id
- POST /api/quizzes/:id/submit
- GET /api/quizzes/:id/results
- DELETE /api/quizzes/:id

### AI Routes
- POST /api/ai/generate-flashcards
- POST /api/ai/generate-quiz
- POST /api/ai/generate-summary
- POST /api/ai/chat
- GET /api/ai/chat-history/:documentId

### Progress Routes
- GET /api/progress/dashboard

---

## Installation

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend/memora-x
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside `backend/`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
```

---

## Future Improvements

- Spaced repetition algorithm
- PDF annotations
- Real-time collaborative study
- Advanced analytics dashboard
- Role-based access control

---

## License

This project is for educational and development purposes.
