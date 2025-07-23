"use client"

import { useState } from "react"
import Header from "@/components/header"
import PostCard from "@/components/post-card"
import NewPostModal from "@/components/new-post-modal"

// Mock data - TODO: Replace with API calls
const mockPosts = [
  {
    id: "1",
    username: "johndoe",
    avatar: "/placeholder.svg?height=40&width=40",
    timestamp: "2 hours ago",
    title: "Beautiful sunset today",
    description: "Just witnessed the most amazing sunset from my balcony. Nature never fails to amaze me! 🌅",
  },
  {
    id: "2",
    username: "sarahsmith",
    avatar: "/placeholder.svg?height=40&width=40",
    timestamp: "4 hours ago",
    title: "New coffee shop discovery",
    description:
      "Found this hidden gem of a coffee shop downtown. Their latte art is incredible and the atmosphere is so cozy. Definitely my new favorite spot! ☕",
  },
  {
    id: "3",
    username: "mikejohnson",
    avatar: "/placeholder.svg?height=40&width=40",
    timestamp: "6 hours ago",
    title: "Weekend hiking adventure",
    description:
      "Completed a 10-mile hike today through the mountain trails. The views were absolutely breathtaking and totally worth the early morning start! 🏔️",
  },
  {
    id: "4",
    username: "emilychen",
    avatar: "/placeholder.svg?height=40&width=40",
    timestamp: "8 hours ago",
    title: "Cooking experiment success",
    description:
      "Tried making homemade pasta for the first time and it actually turned out amazing! Nothing beats the satisfaction of creating something delicious from scratch. 🍝",
  },
]

export default function TimelinePage() {
  const [posts, setPosts] = useState(mockPosts)
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)

  const handleNewPost = (title: string, description: string) => {
    const newPost = {
      id: Date.now().toString(),
      username: "currentuser", // TODO: Get from auth context
      avatar: "/placeholder.svg?height=40&width=40",
      timestamp: "just now",
      title,
      description,
    }
    setPosts((prev) => [newPost, ...prev])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewPost={() => setIsNewPostModalOpen(true)} />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </div>
        )}
      </main>

      <NewPostModal isOpen={isNewPostModalOpen} onClose={() => setIsNewPostModalOpen(false)} onSubmit={handleNewPost} />
    </div>
  )
}
