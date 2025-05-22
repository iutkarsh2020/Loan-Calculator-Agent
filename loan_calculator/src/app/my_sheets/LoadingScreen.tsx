"use client"
import Lottie from "lottie-react"
import loadingAnimation from "@/Animation/DocumentProcessing.json"
import { useEffect, useState } from "react"

export default function LoadingScreen() {
  const messages = ["Processing your data...", "Analyzing your statement...", "Calculating loan options..."]

  // State to track the current message index
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    // Create an interval that changes the message every second
    const interval = setInterval(() => {
      // Update the index, wrapping around to 0 when we reach the end
      setMessageIndex((current) => (current + 1) % messages.length)
    }, 2000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)
  }, []) // Empty dependency array means this effect runs once on mount

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Lottie animationData={loadingAnimation} height={400} width={400} />
      <p className="text-gray-600 text-lg -mt-25">{messages[messageIndex]}</p>
    </div>
  )
}