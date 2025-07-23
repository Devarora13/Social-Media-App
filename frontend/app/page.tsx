import { redirect } from "next/navigation"

export default function HomePage() {
  // TODO: Check if user is authenticated
  // For now, redirect to timeline (in real app, would check auth state)
  redirect("/timeline")
}
