"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Bell, Heart, UserPlus, MessageCircle } from "lucide-react"

interface Notification {
  id: string
  type: "like" | "follow" | "comment" | "post"
  username: string
  avatar: string
  message: string
  timestamp: string
  isRead: boolean
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    username: "sarahsmith",
    avatar: "/placeholder.svg?height=40&width=40",
    message: 'liked your post "Beautiful sunset today"',
    timestamp: "2 minutes ago",
    isRead: false,
  },
  {
    id: "2",
    type: "follow",
    username: "mikejohnson",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "started following you",
    timestamp: "1 hour ago",
    isRead: false,
  },
  {
    id: "3",
    type: "comment",
    username: "emilychen",
    avatar: "/placeholder.svg?height=40&width=40",
    message: 'commented on your post "Weekend hiking adventure"',
    timestamp: "3 hours ago",
    isRead: true,
  },
  {
    id: "4",
    type: "post",
    username: "johndoe",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "shared a new post",
    timestamp: "5 hours ago",
    isRead: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const { toast } = useToast()

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new notification (simulate real-time updates)
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? "like" : "follow",
          username: "newuser",
          avatar: "/placeholder.svg?height=40&width=40",
          message: Math.random() > 0.5 ? "liked your post" : "started following you",
          timestamp: "just now",
          isRead: false,
        }

        setNotifications((prev) => [newNotification, ...prev])

        toast({
          title: "New notification",
          description: `${newNotification.username} ${newNotification.message}`,
        })
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [toast])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-green-500" />
      case "post":
        return <Bell className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} unread</Badge>}
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-colors ${!notification.isRead ? "bg-blue-50 border-blue-200" : ""}`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.avatar || "/placeholder.svg"} alt={notification.username} />
                    <AvatarFallback>{notification.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.type)}
                      <p className="text-sm">
                        <span className="font-semibold">{notification.username}</span>{" "}
                        <span className="text-gray-700">{notification.message}</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                  </div>

                  {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        )}
      </main>
    </div>
  )
}
