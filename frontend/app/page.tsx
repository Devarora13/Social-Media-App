"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        redirect("/timeline")
      } else {
        redirect("/login")
      }
    }
  }, [isAuthenticated, isLoading])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
