"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import ProfileTabs from "@/components/profile-tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, UserMinus } from "lucide-react"

// Mock user data - TODO: Replace with API calls
const mockUser = {
  username: "johndoe",
  displayName: "John Doe",
  bio: "Software developer passionate about creating amazing user experiences. Love hiking, photography, and good coffee. ☕📸🏔️",
  avatar: "/placeholder.svg?height=120&width=120",
  followers: 1234,
  following: 567,
  posts: 89,
  isFollowing: false,
}

const mockUserPosts = [
  {
    id: "1",
    title: "Beautiful sunset today",
    description: "Just witnessed the most amazing sunset from my balcony. Nature never fails to amaze me! 🌅",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Weekend hiking adventure",
    description: "Completed a 10-mile hike today through the mountain trails. The views were absolutely breathtaking!",
    timestamp: "1 day ago",
  },
]

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [user, setUser] = useState(mockUser)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // TODO: Fetch user data based on username
  // useEffect(() => {
  //   fetchUserProfile(username)
  // }, [username])

  const handleFollowToggle = async () => {
    setIsLoading(true)

    // TODO: API call to follow/unfollow user
    // const response = await fetch(`/api/users/${username}/follow`, { method: 'POST' })

    // Simulate API call
    setTimeout(() => {
      setUser((prev) => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
      }))

      toast({
        title: user.isFollowing ? "Unfollowed" : "Following",
        description: user.isFollowing
          ? `You unfollowed ${user.displayName}`
          : `You are now following ${user.displayName}`,
      })

      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                <AvatarFallback className="text-2xl">
                  {user.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{user.displayName}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                </div>

                <p className="text-gray-700">{user.bio}</p>

                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold">{user.posts}</span>
                    <span className="text-gray-600 ml-1">Posts</span>
                  </div>
                  <div>
                    <span className="font-semibold">{user.followers}</span>
                    <span className="text-gray-600 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-semibold">{user.following}</span>
                    <span className="text-gray-600 ml-1">Following</span>
                  </div>
                </div>

                <Button
                  onClick={handleFollowToggle}
                  disabled={isLoading}
                  variant={user.isFollowing ? "outline" : "default"}
                  className="w-full md:w-auto"
                >
                  {isLoading ? (
                    "Loading..."
                  ) : user.isFollowing ? (
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
            </div>
          </CardContent>
        </Card>

        <ProfileTabs posts={mockUserPosts} />
      </main>
    </div>
  )
}
