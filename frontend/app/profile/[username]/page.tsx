"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import ProfileTabs from "@/components/profile-tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, UserMinus } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { apiClient } from "@/lib/api"
import { User, Post } from "@/lib/types"

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [user, setUser] = useState<User | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const { user: currentUser, isAuthenticated, updateUser } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile()
    }
  }, [username, isAuthenticated])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      
      // Fetch user data
      const userData = await apiClient.getUserByUsername(username)
      setUser(userData)
      
      // Fetch user's posts
      const posts = await apiClient.getUserPosts(userData.id)
      setUserPosts(posts)
      
      // Fetch followers data efficiently
      if (userData.followers.length > 0) {
        const followersData = await apiClient.getUsersByIds(userData.followers)
        setFollowers(followersData)
      } else {
        setFollowers([])
      }
      
      // Fetch following data efficiently
      if (userData.following.length > 0) {
        const followingData = await apiClient.getUsersByIds(userData.following)
        setFollowing(followingData)
      } else {
        setFollowing([])
      }
      
    } catch (error) {
      console.error('Failed to load user profile:', error)
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowToggle = async () => {
    if (!user || !currentUser) return
    
    setIsFollowLoading(true)

    try {
      const isCurrentlyFollowing = currentUser.following.includes(user.id)
      
      if (isCurrentlyFollowing) {
        await apiClient.unfollowUser(user.id)
        
        // Update current user's following list immediately
        const updatedCurrentUser = {
          ...currentUser,
          following: currentUser.following.filter(id => id !== user.id)
        }
        updateUser(updatedCurrentUser)
        
        // Update profile user's follower count
        setUser(prev => prev ? {
          ...prev,
          followers: prev.followers.filter(id => id !== currentUser.id)
        } : null)
        
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${user.username}`,
        })
      } else {
        await apiClient.followUser(user.id)
        
        // Update current user's following list immediately
        const updatedCurrentUser = {
          ...currentUser,
          following: [...currentUser.following, user.id]
        }
        updateUser(updatedCurrentUser)
        
        // Update profile user's follower count
        setUser(prev => prev ? {
          ...prev,
          followers: [...prev.followers, currentUser.id]
        } : null)
        
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
    } finally {
      setIsFollowLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div>Please log in to view profiles</div>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-gray-500">User not found</p>
          </div>
        </main>
      </div>
    )
  }

  const isCurrentlyFollowing = currentUser?.following.includes(user.id) || false
  const isOwnProfile = currentUser?.id === user.id

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage 
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=0ea5e9&color=fff&size=120`} 
                  alt={user.username} 
                />
                <AvatarFallback className="text-2xl">
                  {user.username
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                </div>

                <p className="text-gray-700">{user.email}</p>

                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold">{userPosts.length}</span>
                    <span className="text-gray-600 ml-1">Posts</span>
                  </div>
                  <div>
                    <span className="font-semibold">{user.followers.length}</span>
                    <span className="text-gray-600 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-semibold">{user.following.length}</span>
                    <span className="text-gray-600 ml-1">Following</span>
                  </div>
                </div>

                {!isOwnProfile && (
                  <Button
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    variant={isCurrentlyFollowing ? "outline" : "default"}
                    className="w-full md:w-auto"
                  >
                    {isFollowLoading ? (
                      "Loading..."
                    ) : isCurrentlyFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <ProfileTabs 
          posts={userPosts.map(post => ({
            id: post._id,
            title: post.title,
            description: post.description,
            timestamp: new Date(post.createdAt).toLocaleDateString()
          }))}
          followers={followers}
          following={following}
        />
      </main>
    </div>
  )
}
