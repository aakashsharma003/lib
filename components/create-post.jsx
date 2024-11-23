"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Paperclip } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function CreatePost() {
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [attachmentType, setAttachmentType] = useState("drive")
  const [driveLink, setDriveLink] = useState("")
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the note and attachment to your backend
    console.log("Submitting note:", note)
    console.log("Note title:", noteTitle)
    console.log("Attachment type:", attachmentType)
    console.log("Drive link:", driveLink)
    console.log("File:", file)
    setNote("")
    setNoteTitle("")
    setDriveLink("")
    setFile(null)
    setIsOpen(false)
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg"
            size="icon"
          >
            <Paperclip className="h-6 w-6" />
            <span className="sr-only">Create Post</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Publish Notes</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 mb-4">
              <Label htmlFor="noteTitle">Title</Label>
              <Input
                id="noteTitle"
                placeholder="Enter the title of your notes"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </div>
            <Textarea
              placeholder="Add your notes about this video..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
            />
            <div>
              <Label>Attach Notes</Label>
              <RadioGroup value={attachmentType} onValueChange={setAttachmentType} className="flex flex-col space-y-1 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="drive" id="drive" />
                  <Label htmlFor="drive">Paste Drive Link</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload">Upload from Device</Label>
                </div>
              </RadioGroup>
            </div>
            {attachmentType === "drive" && (
              <div className="space-y-2">
                <Label htmlFor="driveLink">Drive Link</Label>
                <Input
                  id="driveLink"
                  type="url"
                  placeholder="Paste your Google Drive link here"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Note: It is recommended to use a Google Drive link with unrestricted permissions.
                </p>
              </div>
            )}
            {attachmentType === "upload" && (
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Upload File</Label>
                <Input
                  id="fileUpload"
                  type="file"
                  onChange={handleFileChange}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Note: The upload from device feature is currently in the fixing phase and is temporarily disabled.
                </p>
              </div>
            )}
            <Button type="submit" className="w-full">Post</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

