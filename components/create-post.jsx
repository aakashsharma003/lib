"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Paperclip, Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useUser } from "@clerk/nextjs"

export function CreatePost({ videoId }) {
  const router = useRouter();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [attachmentType, setAttachmentType] = useState("drive");
  const [driveLink, setDriveLink] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsConsent, setNeedsConsent] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedLink, setUploadedLink] = useState("");
  const [allowAccess, setAllowAccess] = useState(true);

  const [uploadedFileId, setUploadedFileId] = useState("");
  const [isUpdatingAccess, setIsUpdatingAccess] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("pendingNoteState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.videoId === videoId) {
          setIsOpen(true);
          setNoteTitle(parsed.noteTitle || "");
          setNote(parsed.note || "");
          setAttachmentType(parsed.attachmentType || "upload");
        }
      } catch (e) {
        console.error("Failed to parse saved state", e);
      } finally {
        sessionStorage.removeItem("pendingNoteState");
      }
    }
  }, [videoId]);

  const saveStateBeforeRedirect = () => {
    sessionStorage.setItem("pendingNoteState", JSON.stringify({
      videoId,
      noteTitle,
      note,
      attachmentType
    }));
  };

  // Define handleConnectDrive before using it
  const handleConnectDrive = async () => {
    try {
      saveStateBeforeRedirect();
      const googleAccount = user?.externalAccounts?.find(a => a.provider === "oauth_google" || a.provider === "google");
      if (googleAccount) {
        const res = await googleAccount.reauthorize({
          additionalScopes: ["https://www.googleapis.com/auth/drive.file"],
          redirectUrl: window.location.href,
        });
        if (res?.verification?.externalVerificationRedirectURL) {
          window.location.href = res.verification.externalVerificationRedirectURL;
        }
      } else if (user) {
        const externalAccount = await user.createExternalAccount({
          strategy: "oauth_google",
          redirectUrl: window.location.href,
          additionalScopes: ["https://www.googleapis.com/auth/drive.file"]
        });
        if (externalAccount.verification?.externalVerificationRedirectURL) {
          window.location.href = externalAccount.verification.externalVerificationRedirectURL;
        }
      }
    } catch (err) {
      console.error("Failed to re-authorize:", err);
    }
  };

  const uploadToDrive = async (selectedFile, accessAllowed) => {
    if (!selectedFile) return;
    setIsUploading(true);
    setNeedsConsent(false);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("allowAccess", accessAllowed);

    try {
      const res = await fetch("/api/drive-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.needsConsent) {
        setNeedsConsent(true);
        // We will clear the file selection if consent is needed so they try again after
        setFile(null);
        return;
      }

      if (res.ok) {
        setUploadedLink(data.driveLink);
        setUploadedFileId(data.fileId);
        // Pre-fill the standard driveLink so submission works seamlessly
        setDriveLink(data.driveLink);
      } else {
        console.error("Failed to upload file:", data.error);
        alert(data.error || "Failed to upload file.");
      }
    } catch (err) {
      console.error("Error uploading to Drive:", err);
      alert("Error uploading to Drive");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadedLink(""); // Clear previous upload
      setUploadedFileId(""); // Clear previous file id
      uploadToDrive(selectedFile, allowAccess);
    }
  };

  const handleToggleAccess = async (checked) => {
    setAllowAccess(checked);
    // If we've already uploaded the file, hit the API to update the permission explicitly
    if (uploadedFileId) {
      setIsUpdatingAccess(true);
      try {
        const res = await fetch("/api/drive-permission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: uploadedFileId, allowAccess: checked }),
        });
        const data = await res.json();
        if (!res.ok) {
          console.error("Failed to update permissions:", data.error);
          setAllowAccess(!checked);
          alert(data.error || "Failed to update permissions.");
        }
      } catch (err) {
        console.error("Error updating permissions:", err);
        setAllowAccess(!checked);
      } finally {
        setIsUpdatingAccess(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteTitle || !note) return;

    if (attachmentType === "upload" && !uploadedLink) {
      alert("Please wait for the file to upload to Google Drive first.");
      return;
    }

    setIsSubmitting(true);
    setNeedsConsent(false);

    const formData = new FormData();
    formData.append("title", noteTitle);
    formData.append("content", note);
    formData.append("videoId", videoId);
    formData.append("attachmentType", attachmentType);

    // Whether they pasted a link directly or we uploaded it and got a link, 
    // it's stored in `driveLink` by now.
    formData.append("driveLink", driveLink);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.needsConsent) {
        setNeedsConsent(true);
        setIsSubmitting(false);
        return;
      }

      if (res.ok) {
        router.push(`/video/${videoId}/notes/${data.noteId}`);
        setNote("");
        setNoteTitle("");
        setDriveLink("");
        setUploadedLink("");
        setFile(null);
        setIsOpen(false);
      } else {
        console.error("Failed to post note:", data.error);
        alert(data.error || "Failed to post note.");
      }
    } catch (err) {
      console.error("Error submitting post:", err);
    } finally {
      if (!needsConsent) setIsSubmitting(false);
    }
  };

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
                required
              />
            </div>
            <Textarea
              placeholder="Add something..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              required
            />
            <div>
              <Label>Attach Notes</Label>
              <RadioGroup
                value={attachmentType}
                onValueChange={setAttachmentType}
                className="flex flex-col space-y-1 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="drive" id="drive" />
                  <Label htmlFor="drive">Paste Drive Link</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload">Upload to Google Drive</Label>
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
                  Note: It is recommended to use a Google Drive link with
                  unrestricted permissions.
                </p>
              </div>
            )}
            {attachmentType === "upload" && (
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Upload File</Label>
                <Input
                  id="fileUpload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />

                {isUploading && (
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading to Drive...
                  </div>
                )}

                {uploadedLink && !isUploading && (
                  <div className="mt-3 p-3 bg-muted rounded-md border border-border">
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm font-semibold text-green-600">✓ Uploaded successfully</span>
                      <Input value={uploadedLink} readOnly className="text-xs bg-white" />

                      <div className="flex items-center space-x-3 mt-4 mb-2">
                        <Switch
                          id="allowAccess"
                          checked={allowAccess}
                          onCheckedChange={handleToggleAccess}
                          disabled={isUpdatingAccess}
                        />
                        <Label htmlFor="allowAccess" className="text-sm font-medium cursor-pointer">
                          Allow access to everyone (View only)
                          {isUpdatingAccess && <span className="ml-2 text-muted-foreground italic text-xs">Updating...</span>}
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-muted p-3 mt-4 rounded-md border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Drive Consent Info:</strong> We only want your consent to upload your notes file to Google Drive. The file link will automatically be set according to your access preferences, and will be added to this YouTuber's video notes for others to read.
                  </p>
                  {needsConsent && (
                    <Button type="button" variant="default" className="w-full text-xs" onClick={handleConnectDrive}>
                      Grant Google Drive Access
                    </Button>
                  )}
                </div>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting || needsConsent}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</>
              ) : "Post"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

