"use client"

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/hooks/use-toast'
import { NotificationData } from '@/lib/types'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const socketRef = useRef<Socket | null>(null)
  const { token, isAuthenticated } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // Disconnect if not authenticated
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
      return
    }

    // Connect to WebSocket with JWT token
    const socket = io(SOCKET_URL, {
      query: { token },
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('notification', (data: NotificationData) => {
      // Add to notifications list
      setNotifications(prev => [data, ...prev.slice(0, 49)]) // Keep last 50 notifications
      
      // Show toast notification
      toast({
        title: data.type === 'follow' ? '👥 New Follower' : '📝 New Post',
        description: data.message,
        duration: 5000,
      })
    })

    socket.on('connect_error', (error: any) => {
      console.error('❌ WebSocket connection error:', error)
      setIsConnected(false)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [isAuthenticated, token, toast])

  const clearNotifications = () => {
    setNotifications([])
  }

  const markAsRead = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  return {
    isConnected,
    notifications,
    clearNotifications,
    markAsRead,
  }
}
