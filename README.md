# IntelliChat 🤖

> A full-stack AI chat application built with the MERN stack, powered by Groq API

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

---

## Overview

IntelliChat is a full-stack AI-powered chat application inspired by ChatGPT. Users can register, log in, and have intelligent conversations powered by the Groq API. All conversations are saved to MongoDB, allowing users to revisit and continue past chats anytime.

---

## Features

- 🔐 User authentication with JWT (register, login, logout)
- ⚡ Real-time streaming AI responses token by token
- 💾 Persistent chat history saved per user in MongoDB
- 📋 Sidebar with all past conversations
- ✏️ Rename and delete conversations
- 🛡️ Rate limiting to protect API usage
- 🎨 Responsive dark-themed UI built with Bootstrap
- 🔒 Protected routes — only logged-in users can chat
- 🚫 404 Not Found page

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| React Router DOM | Client-side routing |
| Bootstrap 5 | Styling and layout |
| Axios | HTTP requests |
| Context API | Global state management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB + Mongoose | Database and ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Groq SDK | AI API integration |
| express-rate-limit | Rate limiting |

---

## Project Structure

```
intellichat/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── chat.controller.js
│   │   └── conversation.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── rateLimiter.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── conversation.model.js
│   │   └── message.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── chat.routes.js
│   │   └── conversation.routes.js
│   ├── utils/
│   │   ├── connectToDb.js
│   │   ├── hash.js
│   │   ├── jwt.js
│   │   └── generateTitle.js
│   └── app.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Sidebar.jsx
        │   ├── ChatWindow.jsx
        │   ├── MessageBubble.jsx
        │   └── ProtectedRoute.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Chat.jsx
        │   └── NotFound.jsx
        ├── App.jsx
        ├── App.css
        └── index.css
        └── main.jsx
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (free tier)
- Groq API key — free at [console.groq.com](https://console.groq.com)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/madhav-rana/IntelliChat.git
cd IntelliChat
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
GROQ_API_KEY=your_groq_api_key
```
<!-- CLIENT_URL=http://localhost:5173 -->
<!-- PORT=5000 -->

Start the backend server:

```bash
npm start
```

#### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend:

```bash
npm run dev
```

The app will be running at **http://localhost:5173** 🚀

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive JWT token |
| GET | `/me` | Get current logged-in user (protected) |

### Chat — `/api/chat`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Send a message, returns SSE stream (protected) |

### Conversations — `/api/conversations`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all conversations |
| GET | `/:id/messages` | Get messages of a conversation |
| DELETE | `/:id` | Delete a conversation |
| PATCH | `/:id/rename` | Rename a conversation |

---

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string from Atlas |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `GROQ_API_KEY` | API key from console.groq.com |
<!-- | `CLIENT_URL` | Frontend URL for CORS | -->
<!-- | `PORT` | Port for Express server (default: 5000) | -->

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## How It Works

```
User sends message
      ↓
React frontend sends POST /api/chat
      ↓
Express verifies JWT token
      ↓
Rate limiter checks request count
      ↓
Message saved to MongoDB
      ↓
Groq API called with full chat history
      ↓
Response streamed back token by token (SSE)
      ↓
Frontend displays response in real time
      ↓
Final response saved to MongoDB
```

<!-- --- -->

<!-- ## License

This project is open source and available under the [MIT License](LICENSE). -->

---

<p align="center">Built with ❤️ by a MADHAV SINGH RANA</p>