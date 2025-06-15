import React, { createContext, useContext, useEffect, useState, useRef } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('chatterbox-theme')
    if (savedTheme) {
      return savedTheme
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  })

  const [isAnimating, setIsAnimating] = useState(false)
  const overlayRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    
    if (!isAnimating) {
      // Remove previous theme classes
      root.classList.remove('light', 'dark')
      
      // Add current theme class
      root.classList.add(theme)
      
      // Save to localStorage
      localStorage.setItem('chatterbox-theme', theme)
    }
  }, [theme, isAnimating])

  const toggleTheme = (buttonElement) => {
    if (isAnimating) return
    
    const newTheme = theme === 'light' ? 'dark' : 'light'
    
    if (buttonElement) {
      startExpandingAnimation(buttonElement, newTheme)
    } else {
      // Fallback to simple theme change
      setTheme(newTheme)
    }
  }

  const startExpandingAnimation = (buttonElement, newTheme) => {
    setIsAnimating(true)
    
    // Add animation class to body to prevent scrolling issues
    document.body.classList.add('theme-animating')
    
    // Get button position
    const rect = buttonElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Calculate the maximum distance from center to any corner of the screen
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(centerX, window.innerWidth - centerX), 2) +
      Math.pow(Math.max(centerY, window.innerHeight - centerY), 2)
    )
    
    // Create a container for the new theme
    const themeContainer = document.createElement('div')
    themeContainer.className = `theme-container ${newTheme}`
    themeContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9998;
      pointer-events: none;
    `
    
    // Set the theme colors for the container
    if (newTheme === 'dark') {
      themeContainer.style.backgroundColor = 'hsl(224, 71.4%, 4.1%)'
      themeContainer.style.color = 'hsl(210, 20%, 98%)'
    } else {
      themeContainer.style.backgroundColor = 'hsl(0, 0%, 100%)'
      themeContainer.style.color = 'hsl(224, 71.4%, 4.1%)'
    }
    
    // Create circular mask overlay
    const mask = document.createElement('div')
    mask.className = 'theme-mask'
    mask.style.cssText = `
      position: fixed;
      top: ${centerY}px;
      left: ${centerX}px;
      width: 0px;
      height: 0px;
      border-radius: 50%;
      z-index: 9999;
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      background: transparent;
    `
    
    // Apply circular mask to reveal the new theme gradually
    themeContainer.style.clipPath = `circle(0px at ${centerX}px ${centerY}px)`
    themeContainer.style.transition = 'clip-path 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    
    document.body.appendChild(themeContainer)
    document.body.appendChild(mask)
    overlayRef.current = { container: themeContainer, mask }
    
    // Trigger animation with even more delay
    setTimeout(() => {
      requestAnimationFrame(() => {
        const size = maxDistance * 1.2
        themeContainer.style.clipPath = `circle(${size}px at ${centerX}px ${centerY}px)`
        mask.style.width = `${size * 2}px`
        mask.style.height = `${size * 2}px`
      })
    }, 300)
    
    // Change theme immediately - right after click
    setTimeout(() => {
      setTheme(newTheme)
    }, 20)
    
    // Clean up after animation
    setTimeout(() => {
      if (overlayRef.current) {
        if (overlayRef.current.container) {
          document.body.removeChild(overlayRef.current.container)
        }
        if (overlayRef.current.mask) {
          document.body.removeChild(overlayRef.current.mask)
        }
        overlayRef.current = null
      }
      document.body.classList.remove('theme-animating')
      setIsAnimating(false)
    }, 950)
  }

  const setLightTheme = () => setTheme('light')
  const setDarkTheme = () => setTheme('dark')

  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark',
    isAnimating
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
