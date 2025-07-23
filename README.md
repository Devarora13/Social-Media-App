# 🚀 Social Media App

A full-stack social media application built with modern technologies.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Key Implementation Details](#-key-implementation-details)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- User registration and login system
- Protected routes with middleware guards
- Persistent authentication state

### 📝 Post Management
- **Async queue processing** with BullMQ for post creation
- **5-second delay** for post processing as per requirements
- Timeline feed showing posts from followed users
- Real-time post creation notifications

### 👥 Social Features
- **Follow/Unfollow functionality** with real-time updates
- User discovery and profile browsing
- Follower/Following count tracking
- User profile pages with post history

### 🔔 Real-time Notifications
- **WebSocket-based notifications** using Socket.IO
- Live follow notifications
- Real-time post creation alerts
- Notification history and badge counts

### 🛡️ Security & Performance
- **Rate-limited APIs** for security
- Password hashing with bcrypt
- CORS configuration for cross-origin requests
- MongoDB ObjectId to frontend-compatible ID transformation

### 🎨 Modern UI/UX
- **Clean component-based frontend** using Next.js
- **shadcn/ui components** for consistent design
- Responsive design for all screen sizes
- Dark/Light theme support
- Mobile-friendly navigation

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Redis** - In-memory data store for BullMQ queues
- **BullMQ** - Queue system for async job processing
- **Socket.IO** - Real-time WebSocket communication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Lucide React** - Beautiful icons
- **Socket.IO Client** - Real-time client communication

### DevOps & Tools
- **Docker** support for Redis
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   NestJS        │    │   MongoDB       │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│   (Port 3000)   │    │   (Port 3001)   │    │   (Port 27017)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         │              ┌─────────────────┐              
         │              │   Redis         │              
         └──────────────►│   BullMQ        │              
                        │   (Port 6379)   │              
                        └─────────────────┘              
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **MongoDB** (local or cloud)
- **Redis** (for queue processing)
- **Git**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Devarora13/Social-Media-App.git
cd Social-Media-App
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
# or
pnpm install
```

## 🔧 Environment Setup

### Backend Environment (.env)
Create `backend/.env`:
```env
# Database
MONGO_URI=mongodb://localhost:27017/socialapp

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Redis (for BullMQ queues)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend Environment (.env.local)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🏃‍♂️ Running the Application

### 1. Start Required Services

**MongoDB:**
```bash
# Using MongoDB Community Server
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Redis:**
```bash
# Using Redis Server
redis-server

# Or using Docker
docker run -d -p 6379:6379 --name redis redis:alpine
```

### 2. Start Backend Server
```bash
cd backend
npm run start:dev
# Server runs on http://localhost:3001
```

### 3. Start Frontend Server
```bash
cd frontend
npm run dev
# Application runs on http://localhost:3000
```

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get current user profile

### Users
- `GET /user/users` - Get all users
- `GET /user/profile/:username` - Get user by username
- `POST /user/follow/:userId` - Follow a user
- `DELETE /user/unfollow/:userId` - Unfollow a user
- `POST /user/batch` - Get multiple users by IDs

### Posts
- `POST /posts` - Create a new post (queued processing)
- `GET /posts/timeline` - Get timeline posts
- `GET /posts` - Get all posts
- `GET /posts/user/:userId` - Get posts by user

### WebSocket Events
- `connection` - Client connects with JWT authentication
- `notification` - Real-time notifications
- `disconnect` - Client disconnects

## 📁 Project Structure

```
Social-Media-App/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── user/              # User management
│   │   ├── posts/             # Post management
│   │   ├── notifications/     # WebSocket notifications
│   │   └── main.ts           # Application entry point
│   ├── package.json
│   └── .env
├── frontend/                   # Next.js Frontend
│   ├── app/                   # App Router pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── timeline/
│   │   ├── profile/
│   │   ├── users/
│   │   └── notifications/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── header.tsx
│   │   ├── post-card.tsx
│   │   └── user-card.tsx
│   ├── context/              # React Context
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities
│   └── package.json
└── README.md
```

## 🔍 Key Implementation Details

### 1. JWT Authentication Flow
- User registers/logs in → Server generates JWT token
- Token stored in localStorage on frontend
- Every API request includes JWT in Authorization header
- WebSocket connections authenticated using JWT

### 2. BullMQ Queue Processing
- Post creation adds job to Redis queue with 5-second delay
- Background processor handles delayed post creation
- Notifications sent to followers after post is created

### 3. Real-time Notifications
- WebSocket gateway authenticates users via JWT
- Follow events trigger real-time notifications
- Post creation sends notifications to all followers
- Frontend displays toast notifications and badge counts

### 4. Data Transformation
- MongoDB ObjectId fields transformed to `id` for frontend compatibility
- Password fields excluded from all user responses
- Consistent API response format across all endpoints

### 5. Rate Limiting
- Implemented using NestJS built-in rate limiting
- Protects against spam and abuse
- Configurable limits per endpoint

### Authentication
- Login/Register pages with form validation
- JWT token management and persistent sessions

### Timeline Feed
- Posts from followed users
- Real-time post creation with 5-second delay
- Interactive post cards with user information

### User Discovery
- Browse all users with follow/unfollow functionality
- Real-time follower count updates
- User profile pages with post history

### Notifications
- Real-time notification system
- WebSocket connection status indicator
- Notification history and management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Dev Arora**
- GitHub: [@Devarora13](https://github.com/Devarora13)
- Email: devarora1309@gmail.com

## 🎯 Assessment Requirements Fulfilled

✅ **JWT-based authentication** - Complete implementation with middleware guards  
✅ **Async queues with Redis (BullMQ)** - 5-second delayed post processing  
✅ **WebSocket-based real-time notifications** - Follow and post notifications  
✅ **Rate-limited APIs** - Security and spam protection  
✅ **Clean component-based frontend** - Next.js with shadcn/ui components  

---

**Built with ❤️**
