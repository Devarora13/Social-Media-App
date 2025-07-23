"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { useWebSocket } from "@/hooks/use-websocket"
import { Plus, Home, User, Bell, LogOut, Wifi, WifiOff } from "lucide-react"

interface HeaderProps {
  onNewPost?: () => void
}

export default function Header({ onNewPost }: HeaderProps) {
  const { user, logout } = useAuth()
  const { isConnected, notifications } = useWebSocket()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) return null

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
            <Link href="/notifications" className="flex items-center text-gray-600 hover:text-gray-900 relative">
              <Bell className="h-5 w-5 mr-1" />
              Notifications
              {notifications.length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  {notifications.length}
                </Badge>
              )}
            </Link>
            <Link href="/users" className="flex items-center text-gray-600 hover:text-gray-900">
              <User className="h-5 w-5 mr-1" />
              Users
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* WebSocket Connection Status */}
            <div className="flex items-center" title={isConnected ? "Connected" : "Disconnected"}>
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </div>

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
                    <AvatarImage src="/placeholder-user.jpg" alt={user.username} />
                    <AvatarFallback>
                      {user.username
                        .split("")
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.username}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.username}`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="md:hidden" asChild>
                  <Link href="/notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                    {notifications.length > 0 && (
                      <Badge variant="destructive" className="ml-auto h-5 w-5 rounded-full p-0 text-xs">
                        {notifications.length}
                      </Badge>
                    )}
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
