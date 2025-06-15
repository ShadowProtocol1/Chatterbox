import React, { useRef } from 'react'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import { useTheme } from '@/context/ThemeContext'
import { Button } from './ui/button'

const ThemeToggle = ({ className = '', size = 'default' }) => {
  const { theme, toggleTheme, isDark, isAnimating } = useTheme()
  const buttonRef = useRef(null)

  const handleToggle = () => {
    if (buttonRef.current && !isAnimating) {
      toggleTheme(buttonRef.current)
    }
  }

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size={size === 'icon' ? 'icon' : 'default'}
      onClick={handleToggle}
      disabled={isAnimating}
      className={`relative transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-105 ${
        isAnimating ? 'animate-pulse cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <div className="relative overflow-hidden">
        <div className={`transition-all duration-300 ${isAnimating ? 'rotate-180' : ''}`}>
          {isDark ? (
            <MdLightMode className="h-8 w-8 transition-all duration-300 transform" />
          ) : (
            <MdDarkMode className="h-8 w-8 transition-all duration-300 transform" />
          )}
        </div>
      </div>
      {size !== 'icon' && (
        <span className="ml-2 hidden sm:inline transition-all duration-300">
          {isDark ? 'Light' : 'Dark'} Mode
        </span>
      )}
    </Button>
  )
}

export default ThemeToggle
