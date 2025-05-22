"use client"

import type React from "react"

import { useState, useRef, Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { FormHookState, states } from "../page"

export type PdfUploadFormProps = {
  currentState: FormHookState,
  changeCurrentState?: Dispatch<SetStateAction<FormHookState>>
  onUploadComplete?: (fileUrl: string) => void
  changeFile: Dispatch<SetStateAction<File | null>>
}

export const PdfUploadForm = ({ changeCurrentState, onUploadComplete, changeFile , currentState}: PdfUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
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
      changeFile(file)
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
      // const fileUrl = uploadResult.url

      // Simulate upload completion after 2 seconds
      setTimeout(() => {
        clearInterval(interval)
        setProgress(100)
        setStatus("success")

      //   // Mock file URL - replace with actual S3 URL in production
      //   const mockFileUrl = `https://your-s3-bucket.s3.amazonaws.com/${file.name}`

      //   // Call the callback if provided
      //   if (onUploadComplete) {
      //     onUploadComplete(mockFileUrl)
      //   }

      //   // Change state if needed
      //   if (changeCurrentState) {
      //     // changeCurrentState()
      //   }
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

  const handleContinue = async () => {
    if (!file) return;
    if (changeCurrentState)
      changeCurrentState({state: states.PARSE_STATEMENT_STATE, message: "Passed Initial Filtering", amount: currentState.amount})
    const formData = new FormData();
    formData.append("file", file);
    formData.append("loanAmount", currentState.amount.toString());
    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    })
    .then((res)=> res.json())
    .then((data) => {
      console.log(data);
      if (changeCurrentState)
        changeCurrentState({state: states.STATEMENT_RESULT_STATE, message: "Passed Initial Filtering"})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pdf-upload">Upload Loan Document (PDF)</Label>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        {status === "idle" && !file && (
          <div
            onClick={triggerFileInput}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <FileText className="h-10 w-10 text-primary" />
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
                Submit
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
            {/* <Button variant="outline" size="sm" onClick={resetUpload} className="w-full">
              Upload another PDF
            </Button> */}
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

      <div className="flex justify-end space-x-2">
        {status !== "uploading" && (
          <Button variant="outline" onClick={() => changeCurrentState && changeCurrentState((prev) => ({...prev, state: states.LOAN_PROPOSAL_FORM}))}>
            Back
          </Button>
        )}
        {status === "success" && (
          <Button onClick={handleContinue}>Continue</Button>
        )}
      </div>
    </div>
  )
}

// Type definition for use in the LoanProposalCard
export const PdfUploadFormType = "PdfUploadForm"
