"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/lib/types"

interface Post {
  id: string
  title: string
  description: string
  timestamp: string
}

interface ProfileTabsProps {
  posts: Post[]
  followers: User[]
  following: User[]
}

export default function ProfileTabs({ posts, followers, following }: ProfileTabsProps) {
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
        {followers.length > 0 ? (
          followers.map((follower) => (
            <Card key={follower.id}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={`https://ui-avatars.com/api/?name=${follower.username}&background=0ea5e9&color=fff&size=40`} 
                      alt={follower.username} 
                    />
                    <AvatarFallback>
                      {follower.username
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{follower.username}</p>
                    <p className="text-sm text-gray-500">@{follower.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No followers yet</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="following" className="space-y-4">
        {following.length > 0 ? (
          following.map((followingUser) => (
            <Card key={followingUser.id}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={`https://ui-avatars.com/api/?name=${followingUser.username}&background=0ea5e9&color=fff&size=40`} 
                      alt={followingUser.username} 
                    />
                    <AvatarFallback>
                      {followingUser.username
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{followingUser.username}</p>
                    <p className="text-sm text-gray-500">@{followingUser.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Not following anyone yet</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
