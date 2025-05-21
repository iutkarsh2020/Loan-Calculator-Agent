"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type UploadStatus = "idle" | "uploading" | "success" | "error"

export default function PdfUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setStatus("uploading")

      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      // This is where you would implement your S3 upload logic
      // const uploadResult = await uploadToS3(file)

      // Simulate upload completion after 2 seconds
      setTimeout(() => {
        clearInterval(interval)
        setProgress(100)
        setStatus("success")
      }, 2000)
    } catch (error) {
      console.error("Upload failed:", error)
      setStatus("error")
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const resetUpload = () => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />

          {status === "idle" && !file && (
            <div
              onClick={triggerFileInput}
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <FileText className="h-12 w-12 text-primary" />
              <p className="text-sm text-gray-500">Click to select a PDF file</p>
            </div>
          )}

          {file && status === "idle" && (
            <div className="w-full">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="default" size="sm" onClick={handleUpload} className="flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          )}

          {status === "uploading" && (
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file?.name}</p>
                  <div className="mt-2">
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
              <p className="text-xs text-center text-muted-foreground">Uploading... {progress}%</p>
            </div>
          )}

          {status === "success" && (
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file?.name}</p>
                  <p className="text-xs text-green-600">Successfully uploaded</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <Button variant="outline" size="sm" onClick={resetUpload} className="w-full">
                Upload another PDF
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-red-50">
                <FileText className="h-8 w-8 text-red-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file?.name}</p>
                  <p className="text-xs text-red-600">Upload failed</p>
                </div>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetUpload} className="flex-1">
                  Try another file
                </Button>
                <Button variant="default" size="sm" onClick={handleUpload} className="flex-1">
                  Try again
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}