import React, { useState, useEffect } from "react"
import { 
  Loader, 
  SpinnerLoader, 
  DotsLoader, 
  BouncingDotsLoader, 
  WaveLoader, 
  ProgressLoader, 
  SkeletonLoader,
  OrbitLoader,
  RippleLoader
} from "./loader"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

const LoaderDemo = () => {
  const [progress, setProgress] = useState(0)
  const [isAutoProgress, setIsAutoProgress] = useState(true)

  // Auto-increment progress for demo
  useEffect(() => {
    if (!isAutoProgress) return
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isAutoProgress])

  const loaderTypes = [
    { type: "spinner", name: "Spinner", component: SpinnerLoader },
    { type: "dots", name: "Dots", component: DotsLoader },
    { type: "bouncing", name: "Bouncing Dots", component: BouncingDotsLoader },
    { type: "wave", name: "Wave", component: WaveLoader },
    { type: "orbit", name: "Orbit", component: OrbitLoader },
    { type: "ripple", name: "Ripple", component: RippleLoader },
  ]

  const variants = [
    { variant: "default", name: "Default", color: "text-primary" },
    { variant: "secondary", name: "Secondary", color: "text-secondary-foreground" },
    { variant: "muted", name: "Muted", color: "text-muted-foreground" },
    { variant: "accent", name: "Accent", color: "text-accent-foreground" },
  ]

  const sizes = [
    { size: "sm", name: "Small" },
    { size: "default", name: "Default" },
    { size: "lg", name: "Large" },
    { size: "xl", name: "Extra Large" },
  ]

  const LoaderCard = ({ children, title, description }) => (
    <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <div className="flex items-center justify-center h-20">
        {children}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Loader Components Demo</h1>
        <p className="text-lg text-muted-foreground">
          Explore all the beautiful loader animations available in your component library
        </p>
      </div>

      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="types">Loader Types</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Different Loader Types</h2>
            <p className="text-muted-foreground mb-6">
              Each loader type offers a unique animation style for different use cases
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loaderTypes.map(({ type, name, component: Component }) => (
              <LoaderCard
                key={type}
                title={name}
                description={`type="${type}"`}
              >
                <Component size="lg" />
              </LoaderCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Color Variants</h2>
            <p className="text-muted-foreground mb-6">
              Different color variants to match your design system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {variants.map(({ variant, name, color }) => (
              <LoaderCard
                key={variant}
                title={name}
                description={`variant="${variant}"`}
              >
                <div className={color}>
                  <Loader type="spinner" variant={variant} size="lg" />
                </div>
              </LoaderCard>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">All Variants with Different Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {variants.map(({ variant, name }) => (
                <div key={variant} className="space-y-4">
                  <h4 className="text-center font-medium">{name}</h4>
                  <div className="flex flex-col items-center space-y-3">
                    <Loader type="spinner" variant={variant} />
                    <Loader type="dots" variant={variant} />
                    <Loader type="wave" variant={variant} />
                    <Loader type="orbit" variant={variant} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sizes" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Different Sizes</h2>
            <p className="text-muted-foreground mb-6">
              Scalable loaders for different UI contexts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sizes.map(({ size, name }) => (
              <LoaderCard
                key={size}
                title={name}
                description={`size="${size}"`}
              >
                <Loader type="spinner" size={size} />
              </LoaderCard>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Size Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loaderTypes.slice(0, 3).map(({ type, name }) => (
                <div key={type} className="space-y-4">
                  <h4 className="text-center font-medium">{name}</h4>
                  <div className="flex items-center justify-center space-x-4">
                    {sizes.map(({ size }) => (
                      <Loader key={size} type={type} size={size} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="special" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Special Loaders</h2>
            <p className="text-muted-foreground mb-6">
              Progress bars and skeleton loaders for specific use cases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LoaderCard
              title="Progress Loader"
              description="Shows completion percentage"
            >
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <ProgressLoader progress={progress} size="lg" />
                <div className="flex justify-center mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAutoProgress(!isAutoProgress)}
                  >
                    {isAutoProgress ? "Pause" : "Resume"} Auto Progress
                  </Button>
                </div>
              </div>
            </LoaderCard>

            <LoaderCard
              title="Skeleton Loader"
              description="Placeholder for loading content"
            >
              <div className="w-full space-y-2">
                <SkeletonLoader className="h-4 w-3/4" />
                <SkeletonLoader className="h-4 w-1/2" />
                <SkeletonLoader className="h-4 w-2/3" />
              </div>
            </LoaderCard>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Progress Bar Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {variants.map(({ variant, name }) => (
                <LoaderCard
                  key={variant}
                  title={`${name} Progress`}
                  description={`variant="${variant}"`}
                >
                  <div className="w-full">
                    <ProgressLoader progress={progress} variant={variant} />
                  </div>
                </LoaderCard>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Skeleton Variations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LoaderCard title="Text Skeleton" description="For text content">
                <div className="w-full space-y-2">
                  <SkeletonLoader className="h-3 w-full" />
                  <SkeletonLoader className="h-3 w-4/5" />
                  <SkeletonLoader className="h-3 w-3/5" />
                </div>
              </LoaderCard>

              <LoaderCard title="Card Skeleton" description="For card layouts">
                <div className="w-full space-y-2">
                  <SkeletonLoader className="h-12 w-12 rounded-full" />
                  <SkeletonLoader className="h-4 w-full" />
                  <SkeletonLoader className="h-4 w-3/4" />
                </div>
              </LoaderCard>

              <LoaderCard title="Image Skeleton" description="For image placeholders">
                <div className="w-full">
                  <SkeletonLoader className="h-16 w-full rounded-lg" />
                </div>
              </LoaderCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Usage Examples</h3>
        <div className="space-y-2 text-sm font-mono bg-background p-4 rounded border">
          <div>{'<Loader type="spinner" size="lg" variant="default" />'}</div>
          <div>{'<Loader type="dots" size="sm" variant="accent" />'}</div>
          <div>{'<ProgressLoader progress={75} variant="secondary" />'}</div>
          <div>{'<SkeletonLoader className="h-4 w-full" />'}</div>
        </div>
      </div>
    </div>
  )
}

export default LoaderDemo
