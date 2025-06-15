import React from "react"
import { Loader } from "./loader"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeContext"

const LoadingScreen = ({
  message = "Loading...",
  className,
  loaderType = "spinner",
  loaderSize = "xl",
  showMessage = true,
  overlay = true,
  ...props
}) => {
  const { isDark } = useTheme()
  
  const containerClasses = overlay
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex items-center justify-center min-h-screen bg-background"

  return (
    <div className={cn(containerClasses, className)} {...props}>
      <div className="flex flex-col items-center space-y-4">        {/* Logo or Brand Area */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              src="/favicon.svg"
              alt="Chatterbox Logo"
              className="w-8 h-8"
            />
          </div>          <h1 className="text-2xl font-bold poppins-bold text-foreground">
            Chatterbox
          </h1>
        </div>

        {/* Loader */}
        <Loader
          type={loaderType}
          size={loaderSize}
          variant="default"
          className="mb-4 text-foreground [&>*]:text-foreground [&_svg]:text-foreground [&_circle]:stroke-foreground [&_path]:stroke-foreground [&_div]:bg-foreground"
        />

        {/* Loading Message */}
        {showMessage && (
          <div className="text-center space-y-2">            <p className="text-sm text-foreground/90 poppins-medium animate-pulse">
            {message}
          </p>
            <div className="flex space-x-1 justify-center">
              <div className="w-1 h-1 bg-foreground/90 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-foreground/90 rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="w-1 h-1 bg-foreground/90 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { LoadingScreen }
