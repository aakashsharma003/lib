"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PDFReaderPage() {
  const { id } = useParams()
  const [pdfUrl, setPdfUrl] = useState('https://drive.google.com/file/d/1QXzfDdjdxygK8pF0-qU5qZ3xE2fpimka/view?usp=sharing')

  useEffect(() => {
    // In a real application, you would fetch the PDF URL based on the id
    setPdfUrl(`https://example.com/pdf/${id}.pdf`)
  }, [id])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/quick-revision-materials" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Materials</span>
          </Link>
        </div>
      </header>
      <main className="flex-grow container py-6">
        <h1 className="text-3xl font-bold mb-6">PDF Reader</h1>
        <div className="w-full h-[calc(100vh-200px)] border rounded">
          {pdfUrl && (
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
              className="w-full h-full"
              frameBorder="0"
            ></iframe>
          )}
        </div>
      </main>
    </div>
  )
}

