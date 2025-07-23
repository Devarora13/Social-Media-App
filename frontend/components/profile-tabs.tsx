"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Post {
  id: string
  title: string
  description: string
  timestamp: string
}

interface ProfileTabsProps {
  posts: Post[]
}

// Mock followers and following data
const mockFollowers = [
  { username: "alice_wonder", displayName: "Alice Wonder", avatar: "/placeholder.svg?height=40&width=40" },
  { username: "bob_builder", displayName: "Bob Builder", avatar: "/placeholder.svg?height=40&width=40" },
  { username: "charlie_brown", displayName: "Charlie Brown", avatar: "/placeholder.svg?height=40&width=40" },
]

const mockFollowing = [
  { username: "diana_prince", displayName: "Diana Prince", avatar: "/placeholder.svg?height=40&width=40" },
  { username: "edward_cullen", displayName: "Edward Cullen", avatar: "/placeholder.svg?height=40&width=40" },
]

export default function ProfileTabs({ posts }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="followers">Followers</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-gray-700">{post.description}</p>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts yet</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="followers" className="space-y-4">
        {mockFollowers.map((follower) => (
          <Card key={follower.username}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={follower.avatar || "/placeholder.svg"} alt={follower.displayName} />
                  <AvatarFallback>
                    {follower.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{follower.displayName}</p>
                  <p className="text-sm text-gray-500">@{follower.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="following" className="space-y-4">
        {mockFollowing.map((following) => (
          <Card key={following.username}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={following.avatar || "/placeholder.svg"} alt={following.displayName} />
                  <AvatarFallback>
                    {following.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{following.displayName}</p>
                  <p className="text-sm text-gray-500">@{following.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  )
}
