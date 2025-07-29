"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Bell, Heart, UserPlus, MessageCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useWebSocket } from "@/hooks/use-websocket"
import { apiClient } from "@/lib/api"
import { Notification } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  // Initialize WebSocket for real-time updates
  useWebSocket()

  // Redirect if not authenticated (but wait for auth to finish loading)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  // Load notifications
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications()
    }
  }, [isAuthenticated])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const userNotifications = await apiClient.getNotifications()
      setNotifications(userNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationIcon = (message: string) => {
    if (message.includes('follow')) {
      return <UserPlus className="h-4 w-4 text-blue-500" />
    } else if (message.includes('like')) {
      return <Heart className="h-4 w-4 text-red-500" />
    } else if (message.includes('comment')) {
      return <MessageCircle className="h-4 w-4 text-green-500" />
    } else {
      return <Bell className="h-4 w-4 text-purple-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => 
        notification._id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Show loading or redirect
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} unread</Badge>}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading notifications...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Card
                  key={notification._id}
                  className={`cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-blue-50 border-blue-200" : ""
                  }`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={`https://ui-avatars.com/api/?name=User&background=0ea5e9&color=fff&size=40`} 
                          alt="User" 
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {getNotificationIcon(notification.message)}
                          <p className="text-sm text-gray-700">{notification.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(notification.createdAt)}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
