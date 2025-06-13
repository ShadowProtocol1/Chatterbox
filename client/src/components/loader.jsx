import React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

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

// Spinning circle loader
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
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
)

// Pulsing dots loader
const DotsLoader = ({ className, variant, size, ...props }) => (
  <div
    className={cn(loaderVariants({ variant, size }), "space-x-1", className)}
    {...props}
  >
    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
    <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:0.2s]" />
    <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:0.4s]" />
  </div>
)

// Bouncing dots loader
const BouncingDotsLoader = ({ className, variant, size, ...props }) => (
  <div
    className={cn(loaderVariants({ variant, size }), "space-x-1", className)}
    {...props}
  >
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
  </div>
)

// Wave loader
const WaveLoader = ({ className, variant, size, ...props }) => (
  <div
    className={cn(loaderVariants({ variant, size }), "space-x-1", className)}
    {...props}
  >
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="w-1 bg-current rounded-full animate-pulse"
        style={{
          height: size === "sm" ? "16px" : size === "lg" ? "32px" : size === "xl" ? "48px" : "24px",
          animationDelay: `${i * 0.1}s`,
          animationDuration: "1s"
        }}
      />
    ))}
  </div>
)

// Progress bar loader
const ProgressLoader = ({ className, variant, size, progress = 0, ...props }) => (
  <div
    className={cn(
      "w-full bg-secondary rounded-full overflow-hidden",
      size === "sm" ? "h-1" : size === "lg" ? "h-3" : size === "xl" ? "h-4" : "h-2",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "h-full bg-current transition-all duration-300 ease-out",
        loaderVariants({ variant })
      )}
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
  </div>
)

// Skeleton loader
const SkeletonLoader = ({ className, ...props }) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-muted",
      className
    )}
    {...props}
  />
)

// Main Loader component
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
  SkeletonLoader 
}
