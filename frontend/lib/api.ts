// API base URL - update this to match your backend
import { AuthResponse, User, Post, CreatePostResponse, Notification } from './types'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  
  // User
  PROFILE: '/user/profile',
  ALL_USERS: '/user/all',
  USERS_BATCH: '/user/batch',
  USER_BY_USERNAME: (username: string) => `/user/${username}`,
  FOLLOW: (userId: string) => `/user/follow/${userId}`,
  UNFOLLOW: (userId: string) => `/user/unfollow/${userId}`,
  
  // Posts
  CREATE_POST: '/posts',
  TIMELINE: '/posts/timeline',
  ALL_POSTS: '/posts/all',
  USER_POSTS: (userId: string) => `/posts/user/${userId}`,
  
  // Notifications
  NOTIFICATIONS: '/notifications',
} as const

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// API client class
export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: getAuthHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      const responseText = await response.text()
      
      try {
        return JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', {
          url,
          responseText: responseText.substring(0, 100) + '...',
          parseError,
        })
        throw new Error('Invalid JSON response from server')
      }
    } catch (error) {
      console.error('💥 API request failed:', { url, error })
      throw error
    }
  }

  // Auth methods
  async register(data: { email: string; username: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // User methods
  async getProfile(): Promise<User> {
    return this.request<User>(API_ENDPOINTS.PROFILE)
  }

  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>(API_ENDPOINTS.ALL_USERS)
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.request<User>(API_ENDPOINTS.USER_BY_USERNAME(username))
  }

  async getUsersByIds(ids: string[]): Promise<User[]> {
    return this.request<User[]>(API_ENDPOINTS.USERS_BATCH, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    })
  }

  async followUser(userId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(API_ENDPOINTS.FOLLOW(userId), {
      method: 'POST',
    })
  }

  async unfollowUser(userId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(API_ENDPOINTS.UNFOLLOW(userId), {
      method: 'POST',
    })
  }

  // Posts methods
  async createPost(data: { title: string; description: string }): Promise<CreatePostResponse> {
    return this.request<CreatePostResponse>(API_ENDPOINTS.CREATE_POST, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTimeline(): Promise<Post[]> {
    return this.request<Post[]>(API_ENDPOINTS.TIMELINE)
  }

  async getAllPosts(): Promise<Post[]> {
    return this.request<Post[]>(API_ENDPOINTS.ALL_POSTS)
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return this.request<Post[]>(API_ENDPOINTS.USER_POSTS(userId))
  }

  // Notifications methods
  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>(API_ENDPOINTS.NOTIFICATIONS)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
