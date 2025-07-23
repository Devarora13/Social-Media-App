"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import PostCard from "@/components/post-card"
import NewPostModal from "@/components/new-post-modal"
import { useAuth } from "@/context/auth-context"
import { useWebSocket } from "@/hooks/use-websocket"
import { apiClient } from "@/lib/api"
import { Post } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function TimelinePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
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

  // Load timeline posts
  useEffect(() => {
    if (isAuthenticated) {
      loadTimeline()
    }
  }, [isAuthenticated])

  const loadTimeline = async () => {
    try {
      setIsLoading(true)
      const timelinePosts = await apiClient.getTimeline()
      setPosts(timelinePosts)
    } catch (error) {
      console.error('Failed to load timeline:', error)
      toast({
        title: "Error",
        description: "Failed to load timeline posts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewPost = async (title: string, description: string) => {
    try {
      const response = await apiClient.createPost({ title, description })
      
      toast({
        title: "Post Created!",
        description: response.message || "Your post is being processed and will appear shortly",
      })
      
      // Refresh timeline after a short delay to show the new post
      setTimeout(() => {
        loadTimeline()
      }, 6000) // 6 seconds to account for 5-second processing delay
      
    } catch (error) {
      console.error('Failed to create post:', error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewPost={() => setIsNewPostModalOpen(true)} />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading your timeline...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard 
                key={post._id} 
                id={post._id}
                username={post.authorUsername}
                avatar="/placeholder-user.jpg"
                timestamp={new Date(post.createdAt).toLocaleString()}
                title={post.title}
                description={post.description}
              />
            ))}
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No posts in your timeline yet. Follow some users or create your first post!
            </p>
          </div>
        )}
      </main>

      <NewPostModal isOpen={isNewPostModalOpen} onClose={() => setIsNewPostModalOpen(false)} onSubmit={handleNewPost} />
    </div>
  )
}
