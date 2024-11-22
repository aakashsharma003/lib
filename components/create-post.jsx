"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from 'lucide-react'

export function CreatePost() {
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the note to your backend
    console.log("Submitting note:", note)
    setNote("")
    setIsOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg"
            size="icon"
          >
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">Create Post</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Add your notes about this video..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
            />
            <Button type="submit" className="w-full sm:w-auto">Post</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

