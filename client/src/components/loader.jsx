import React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import "./loader.css"

const loaderVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-primary",
        secondary: "text-secondary-foreground",
        muted: "text-muted-foreground",
        accent: "text-accent-foreground",
      },
      size: {
        sm: "w-4 h-4",
        default: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Enhanced spinning circle loader with gradient
const SpinnerLoader = ({ className, variant, size, ...props }) => (
  <div
    className={cn(loaderVariants({ variant, size }), className)}
    {...props}
  >
    <svg
      className="animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="stop-current opacity-100" />
          <stop offset="100%" className="stop-current opacity-20" />
        </linearGradient>
      </defs>
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        className="opacity-90 drop-shadow-sm"
        fill="none"
        stroke="url(#spinner-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        d="M12 2a10 10 0 0 1 10 10"
      />
    </svg>
  </div>
)

// Enhanced pulsing dots loader with staggered animation
const DotsLoader = ({ className, variant, size, ...props }) => {
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : size === "lg" ? "w-2.5 h-2.5" : size === "xl" ? "w-3 h-3" : "w-2 h-2"
  
  return (
    <div
      className={cn(loaderVariants({ variant, size }), "flex items-center space-x-1", className)}
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <div 
          key={i}
          className={cn(
            "rounded-full bg-current animate-pulse",
            dotSize
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.4s"
          }}
        />
      ))}
    </div>
  )
}

// Enhanced bouncing dots loader with smooth motion
const BouncingDotsLoader = ({ className, variant, size, ...props }) => {
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : size === "lg" ? "w-2.5 h-2.5" : size === "xl" ? "w-3 h-3" : "w-2 h-2"
  
  return (
    <div
      className={cn(loaderVariants({ variant, size }), "flex items-end space-x-1", className)}
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full bg-current animate-bounce",
            dotSize
          )}          style={{
            animationDelay: `${i * 0.16}s`,
            animationDuration: "1.4s"
          }}
        />
      ))}
    </div>
  )
}

// Enhanced wave loader with fluid motion
const WaveLoader = ({ className, variant, size, ...props }) => {
  const barWidth = size === "sm" ? "w-0.5" : size === "lg" ? "w-1" : size === "xl" ? "w-1.5" : "w-1"
  const barHeight = size === "sm" ? "h-4" : size === "lg" ? "h-8" : size === "xl" ? "h-12" : "h-6"
  
  return (
    <div
      className={cn(loaderVariants({ variant, size }), "flex items-end space-x-0.5", className)}
      {...props}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-current rounded-full animate-pulse origin-bottom",
            barWidth,
            barHeight
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1.5s",
            transform: "scaleY(0.4)"
          }}
        />
      ))}
    </div>
  )
}

// Enhanced progress bar loader with glow effect
const ProgressLoader = ({ className, variant, size, progress = 0, ...props }) => (
  <div
    className={cn(
      "relative w-full bg-secondary rounded-full overflow-hidden",
      size === "sm" ? "h-1" : size === "lg" ? "h-3" : size === "xl" ? "h-4" : "h-2",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "h-full bg-current transition-all duration-500 ease-out rounded-full",
        loaderVariants({ variant })
      )}
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
    {progress === 0 && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 animate-pulse rounded-full" />
    )}
  </div>
)

// Enhanced skeleton loader with shimmer effect
const SkeletonLoader = ({ className, ...props }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-md bg-muted animate-pulse",
      className
    )}
    {...props}
  />
)

// Orbit loader with rotating circles
const OrbitLoader = ({ className, variant, size, ...props }) => (
  <div
    className={cn(loaderVariants({ variant, size }), "relative", className)}
    {...props}
  >
    <div className="relative w-full h-full">
      <div className="absolute inset-0 border-2 border-current border-opacity-20 rounded-full animate-spin">
        <div 
          className="absolute w-2 h-2 bg-current rounded-full shadow-lg"
          style={{ 
            top: "-4px", 
            left: "50%", 
            transform: "translateX(-50%)",
            animation: "spin 2s linear infinite reverse"
          }} 
        />
      </div>
    </div>
  </div>
)

// Ripple loader with expanding circles
const RippleLoader = ({ className, variant, size, ...props }) => (
  <div
    className={cn(loaderVariants({ variant, size }), "relative", className)}
    {...props}
  >
    {[0, 1].map((i) => (
      <div
        key={i}
        className="absolute inset-0 border-2 border-current rounded-full animate-ping"
        style={{
          animationDelay: `${i * 1}s`,
          animationDuration: "2s"
        }}
      />
    ))}
  </div>
)

// Main Loader component with enhanced types
const Loader = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  type = "spinner",
  progress,
  ...props 
}, ref) => {
  const loaderProps = { className, variant, size, ref, ...props }

  switch (type) {
    case "dots":
      return <DotsLoader {...loaderProps} />
    case "bouncing":
      return <BouncingDotsLoader {...loaderProps} />
    case "wave":
      return <WaveLoader {...loaderProps} />
    case "progress":
      return <ProgressLoader {...loaderProps} progress={progress} />
    case "skeleton":
      return <SkeletonLoader {...loaderProps} />
    case "orbit":
      return <OrbitLoader {...loaderProps} />
    case "ripple":
      return <RippleLoader {...loaderProps} />
    case "spinner":
    default:
      return <SpinnerLoader {...loaderProps} />
  }
})

Loader.displayName = "Loader"

export { 
  Loader, 
  SpinnerLoader, 
  DotsLoader, 
  BouncingDotsLoader, 
  WaveLoader, 
  ProgressLoader, 
  SkeletonLoader,
  OrbitLoader,
  RippleLoader
}
