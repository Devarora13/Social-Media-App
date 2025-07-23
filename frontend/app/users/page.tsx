"use client"

import { useState } from "react"
import Header from "@/components/header"
import UserCard from "@/components/user-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Mock users data
const mockUsers = [
  {
    id: "1",
    username: "janedoe",
    displayName: "Jane Doe",
    avatar: "https://ui-avatars.com/api/?name=Jane+Doe&background=0ea5e9&color=fff&size=40",
    status: "Recently joined",
    isFollowing: false,
  },
  {
    id: "2",
    username: "alexsmith",
    displayName: "Alex Smith",
    avatar: "https://ui-avatars.com/api/?name=Alex+Smith&background=8b5cf6&color=fff&size=40",
    status: "Active 2h ago",
    isFollowing: true,
  },
  {
    id: "3",
    username: "mariagarcia",
    displayName: "Maria Garcia",
    avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=f59e0b&color=fff&size=40",
    status: "Active 1h ago",
    isFollowing: false,
  },
  {
    id: "4",
    username: "davidwilson",
    displayName: "David Wilson",
    avatar: "https://ui-avatars.com/api/?name=David+Wilson&background=10b981&color=fff&size=40",
    status: "Active 5h ago",
    isFollowing: false,
  },
  {
    id: "5",
    username: "sarahbrown",
    displayName: "Sarah Brown",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Brown&background=ef4444&color=fff&size=40",
    status: "Recently joined",
    isFollowing: true,
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFollowToggle = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)),
    )
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

        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                username={user.username}
                displayName={user.displayName}
                avatar={user.avatar}
                status={user.status}
                isFollowing={user.isFollowing}
                onFollowToggle={handleFollowToggle}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? `No users found for "${searchQuery}"` : "No users to display"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
