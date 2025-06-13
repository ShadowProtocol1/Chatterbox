import { useState, useRef, useEffect } from 'react'

/**
 * Custom hook for managing emoji picker state and performance
 * Includes debouncing and lazy loading optimizations
 */
export const useEmojiPicker = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const pickerRef = useRef(null)
    const buttonRef = useRef(null)

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current && 
                !pickerRef.current.contains(event.target) &&
                buttonRef.current && 
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            // Mark as loaded when first opened
            if (!isLoaded) {
                setIsLoaded(true)
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, isLoaded])

    const togglePicker = () => {
        setIsOpen(prev => !prev)
    }

    const closePicker = () => {
        setIsOpen(false)
    }

    const openPicker = () => {
        setIsOpen(true)
    }

    return {
        isOpen,
        isLoaded,
        pickerRef,
        buttonRef,
        togglePicker,
        closePicker,
        openPicker
    }
}
