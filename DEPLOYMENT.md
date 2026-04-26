# Deployment Guide

This app has two deployable projects:

- `backend`: NestJS API, WebSocket server, MongoDB connection, Redis queue worker
- `frontend`: Next.js app

It also needs two hosted services:

- MongoDB database
- Redis database for Bull queue jobs

The simplest beginner setup is:

- MongoDB Atlas for MongoDB
- Render for Redis and the backend
- Vercel for the frontend

## 1. Put The Code On GitHub

1. Create a GitHub repository.
2. Push this project to it.
3. Make sure `backend/.env` and `frontend/.env.local` are not committed.

## 2. Create MongoDB Atlas

1. Go to MongoDB Atlas and create a free cluster.
2. Create a database user with a password.
3. Add network access. For a simple first deploy, allow access from anywhere.
4. Copy the connection string.
5. Replace `<password>` in the string with your database user's password.

Your final value will look like:

```env
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/socialapp
```

## 3. Create Redis On Render

1. In Render, create a new Redis service.
2. Copy its Redis connection URL.
3. You will use it as:

```env
REDIS_URL=redis://...
```

## 4. Deploy Backend On Render

Create a new Render Web Service from your GitHub repo.

Use these settings:

```text
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

Add these environment variables in Render:

```env
MONGO_URI=your_mongodb_atlas_connection_string
REDIS_URL=your_render_redis_url
JWT_SECRET=generate_a_long_random_secret
PORT=10000
CORS_ORIGIN=http://localhost:3000
```

Render will give you a backend URL like:

```text
https://your-backend.onrender.com
```

Keep it. You need it for the frontend.

## 5. Deploy Frontend On Vercel

Create a new Vercel project from the same GitHub repo.

Use these settings:

```text
Root Directory: frontend
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
```

Add these environment variables in Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

Deploy the frontend. Vercel will give you a URL like:

```text
https://your-frontend.vercel.app
```

## 6. Update Backend CORS

Go back to the Render backend environment variables and update:

```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

Redeploy the backend after changing this.

If you also want local development to keep working, use both origins separated by a comma:

```env
CORS_ORIGIN=https://your-frontend.vercel.app,http://localhost:3000
```

## 7. Test The Live App

Open your Vercel frontend URL.

Test this flow:

1. Sign up.
2. Log in.
3. Create a post.
4. Wait around 5 seconds for the queued post to appear.
5. Open the app in another browser or account and test follow notifications.

## Common Problems

If sign up or login fails, check:

- `NEXT_PUBLIC_API_URL` in Vercel points to the Render backend URL.
- `CORS_ORIGIN` in Render exactly matches the Vercel frontend URL.
- `MONGO_URI` is correct and the MongoDB Atlas network rule allows Render.

If posts do not appear after 5 seconds, check:

- `REDIS_URL` is set in Render.
- The backend logs do not show Redis connection errors.

If notifications do not connect, check:

- `NEXT_PUBLIC_SOCKET_URL` points to the same Render backend URL.
- `CORS_ORIGIN` includes the Vercel frontend URL.
