"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, UserMinus } from "lucide-react"

interface UserCardProps {
  id: string
  username: string
  displayName: string
  avatar: string
  status: string
  isFollowing: boolean
  onFollowToggle: (userId: string) => void
}

export default function UserCard({
  id,
  username,
  displayName,
  avatar,
  status,
  isFollowing,
  onFollowToggle,
}: UserCardProps) {
  const { toast } = useToast()

  const handleFollowClick = () => {
    onFollowToggle(id)

    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing ? `You unfollowed @${username}` : `You followed @${username}`,
    })
  }

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback>
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <Link href={`/profile/${username}`} className="block hover:underline">
                <h3 className="font-semibold text-lg">{displayName}</h3>
                <p className="text-gray-600">@{username}</p>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{status}</p>
            </div>
          </div>

          <Button onClick={handleFollowClick} variant={isFollowing ? "outline" : "default"} size="sm" className="ml-4">
            {isFollowing ? (
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
        </div>
      </CardContent>
    </Card>
  )
}
