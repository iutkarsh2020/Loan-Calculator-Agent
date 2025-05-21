"use client"
import Lottie from "lottie-react"
import loadingAnimation from "@/Animation/DocumentProcessing.json"

export default function LoadingScreen() {

    
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Lottie 
        animationData = {loadingAnimation}   
        height={400}
        width={400}
      />
      <p className="mt-4 text-gray-600 text-sm">Processing your data...</p>
    </div>
  )
}