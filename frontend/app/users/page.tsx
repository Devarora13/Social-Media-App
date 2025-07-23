"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import UserCard from "@/components/user-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useWebSocket } from "@/hooks/use-websocket"
import { apiClient } from "@/lib/api"
import { User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { user: currentUser, isAuthenticated, updateUser } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  // Initialize WebSocket for real-time updates
  useWebSocket()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Load all users
  useEffect(() => {
    if (isAuthenticated) {
      loadUsers()
    }
  }, [isAuthenticated])

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const allUsers = await apiClient.getAllUsers()
      // Filter out current user
      const otherUsers = allUsers.filter(user => user.id !== currentUser?.id)
      setUsers(otherUsers)
      setFilteredUsers(otherUsers)
    } catch (error) {
      console.error('Failed to load users:', error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowToggle = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user || !currentUser) return

      const isCurrentlyFollowing = currentUser.following.includes(userId)
      
      if (isCurrentlyFollowing) {
        await apiClient.unfollowUser(userId)
        
        // Update current user's following list immediately
        const updatedCurrentUser = {
          ...currentUser,
          following: currentUser.following.filter(id => id !== userId)
        }
        updateUser(updatedCurrentUser)
        
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${user.username}`,
        })
      } else {
        await apiClient.followUser(userId)
        
        // Update current user's following list immediately
        const updatedCurrentUser = {
          ...currentUser,
          following: [...currentUser.following, userId]
        }
        updateUser(updatedCurrentUser)
        
        toast({
          title: "Following",
          description: `You are now following ${user.username}`,
        })
      }
      
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Discover Users</h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  username={user.username}
                  displayName={user.username}
                  avatar={`https://ui-avatars.com/api/?name=${user.username}&background=0ea5e9&color=fff&size=40`}
                  status="Active user"
                  isFollowing={currentUser?.following.includes(user.id) || false}
                  onFollowToggle={() => handleFollowToggle(user.id)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchQuery ? "No users found matching your search." : "No users to display."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
