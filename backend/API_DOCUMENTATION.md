# Social Media App Backend - Complete API Documentation

## Overview
A complete NestJS backend with JWT authentication, async queues with BullMQ, WebSocket notifications, and rate-limited APIs.

## Features Implemented ✅
- ✅ JWT-based authentication
- ✅ Async queues with Redis (BullMQ)
- ✅ WebSocket-based real-time notifications
- ✅ Rate-limited APIs (Global + Endpoint-specific)
- ✅ Follow/Unfollow system
- ✅ Post creation with queue processing
- ✅ Timeline API

## Rate Limiting Configuration
- **Global Rate Limit**: 10 requests per minute per IP
- **Auth Endpoints** (login/register): 5 requests per minute
- **Posts Creation**: 3 requests per minute
- **Other Endpoints**: Global limit applies

## API Endpoints

### Authentication (`/auth`)
```bash
POST /auth/register
POST /auth/login
```
**Rate Limit**: 5 requests/minute

**Register Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### User Management (`/user`)
```bash
GET /user/profile
POST /user/follow/:userId
POST /user/unfollow/:userId
GET /user/all
```
**Authentication**: JWT required
**Rate Limit**: Global (10 requests/minute)

### Posts (`/posts`)
```bash
POST /posts                  # Create post (queued processing)
GET /posts/timeline         # Get posts from followed users
GET /posts/all              # Get all posts
GET /posts/user/:userId     # Get posts by specific user
```
**Authentication**: JWT required
**Rate Limit**: 
- POST: 3 requests/minute
- GET: Global (10 requests/minute)

**Create Post Request:**
```json
{
  "title": "My Post Title",
  "description": "Post content here..."
}
```

### WebSocket Notifications
**Endpoint**: `ws://localhost:3000`
**Authentication**: JWT token via query parameter

**Connection:**
```javascript
const socket = io('http://localhost:3000', {
  query: { token: 'your-jwt-token' }
});
```

**Notification Types:**
- `follow`: When someone follows you
- `post`: When someone you follow creates a post

## Queue Processing (BullMQ)
- **Queue Name**: `post-processing`
- **Processing Delay**: 5 seconds (as required)
- **Redis**: localhost:6379 (configurable via environment)

## Environment Variables
```env
MONGO_URI=mongodb://localhost:27017/socialapp
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Installation & Setup

1. **Install Dependencies:**
```bash
npm install
```

2. **Start Required Services:**
```bash
# MongoDB (make sure it's running)
# Redis (make sure it's running)
```

3. **Run the Application:**
```bash
npm run start:dev
```

## Architecture

### Modules
- **AuthModule**: JWT authentication with guards
- **UserModule**: User management and following system
- **PostsModule**: Post creation with BullMQ processing
- **NotificationsModule**: WebSocket real-time notifications

### Queue Processing Flow
1. User creates post → API returns immediately
2. Post data added to BullMQ with 5-second delay
3. After delay, post is saved to database
4. Notifications sent to all followers via WebSocket

### WebSocket Flow
1. Client connects with JWT token
2. Server validates token and stores connection
3. When events occur (follow/post), notifications sent in real-time

## Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Create Post (with JWT token)
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My First Post","description":"Hello world!"}'
```

### 4. Get Timeline
```bash
curl -X GET http://localhost:3000/posts/timeline \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Assignment Requirements Status: 100% Complete ✅

All requirements have been successfully implemented:
- ✅ JWT-based authentication system
- ✅ Async queues with Redis (BullMQ) for post processing
- ✅ WebSocket-based real-time notifications
- ✅ Rate-limited APIs with different limits per endpoint
- ✅ Follow/Unfollow functionality
- ✅ Post creation and timeline system
