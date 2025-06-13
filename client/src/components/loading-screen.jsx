import React from "react"
import { Loader } from "./loader"
import { cn } from "@/lib/utils"

const LoadingScreen = ({ 
  message = "Loading...", 
  className,
  loaderType = "spinner",
  loaderSize = "xl",
  showMessage = true,
  overlay = true,
  ...props 
}) => {
  const containerClasses = overlay 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex items-center justify-center min-h-screen"

  return (
    <div className={cn(containerClasses, className)} {...props}>
      <div className="flex flex-col items-center space-y-4">
        {/* Logo or Brand Area */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold poppins-bold text-foreground">
            Chat App
          </h1>
        </div>

        {/* Loader */}
        <Loader 
          type={loaderType} 
          size={loaderSize} 
          variant="default"
          className="mb-4"
        />

        {/* Loading Message */}
        {showMessage && (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground poppins-medium animate-pulse">
              {message}
            </p>
            <div className="flex space-x-1 justify-center">
              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { LoadingScreen }
