// Type definitions for API responses
export interface User {
  id: string
  email: string
  username: string
  followers: string[]
  following: string[]
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface Post {
  _id: string
  title: string
  description: string
  authorId: string
  authorUsername: string
  createdAt: string
  updatedAt: string
}

export interface CreatePostResponse {
  message: string
  jobId: string | number
}

export interface NotificationData {
  type: 'follow' | 'post'
  message: string
  fromUserId: string
  postId?: string
}
