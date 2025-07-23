"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react"

interface PostCardProps {
  id: string
  username: string
  avatar: string
  timestamp: string
  title: string
  description: string
}

export default function PostCard({ id, username, avatar, timestamp, title, description }: PostCardProps) {
  // TODO: Implement like, comment, and share functionality
  const handleLike = () => {
    console.log("Like post:", id)
  }

  const handleComment = () => {
    console.log("Comment on post:", id)
  }

  const handleShare = () => {
    console.log("Share post:", id)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
              <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${username}`} className="font-semibold hover:underline">
                {username}
              </Link>
              <p className="text-sm text-gray-500">{timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleLike} className="text-gray-500 hover:text-red-500">
                <Heart className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button variant="ghost" size="sm" onClick={handleComment} className="text-gray-500 hover:text-blue-500">
                <MessageCircle className="h-4 w-4 mr-1" />
                Comment
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-gray-500 hover:text-green-500">
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
