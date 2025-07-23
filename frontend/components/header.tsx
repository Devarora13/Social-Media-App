"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Home, User, Bell, LogOut } from "lucide-react"

interface HeaderProps {
  onNewPost?: () => void
}

export default function Header({ onNewPost }: HeaderProps) {
  // TODO: Get current user from auth context
  const currentUser = {
    username: "currentuser",
    displayName: "Current User",
    avatar: "/placeholder.svg?height=32&width=32",
  }

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/timeline" className="text-xl font-bold text-primary">
            SocialApp
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/timeline" className="flex items-center text-gray-600 hover:text-gray-900">
              <Home className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link href="/notifications" className="flex items-center text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5 mr-1" />
              Notifications
            </Link>
            <Link href="/users" className="flex items-center text-gray-600 hover:text-gray-900">
              <User className="h-5 w-5 mr-1" />
              Users
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {onNewPost && (
              <Button onClick={onNewPost} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.displayName} />
                    <AvatarFallback>
                      {currentUser.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{currentUser.displayName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">@{currentUser.username}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${currentUser.username}`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="md:hidden" asChild>
                  <Link href="/notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
