"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface NewPostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, description: string) => void
}

export default function NewPostModal({ isOpen, onClose, onSubmit }: NewPostModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and description",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // TODO: API call to create new post
    // const response = await fetch('/api/posts', { ... })

    // Simulate API call
    setTimeout(() => {
      onSubmit(title.trim(), description.trim())
      setTitle("")
      setDescription("")
      setIsLoading(false)
      onClose()

      toast({
        title: "Post created!",
        description: "Your post has been shared successfully",
      })
    }, 500)
  }

  const handleClose = () => {
    if (!isLoading) {
      setTitle("")
      setDescription("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>Share something interesting with your followers</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us more about it..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
