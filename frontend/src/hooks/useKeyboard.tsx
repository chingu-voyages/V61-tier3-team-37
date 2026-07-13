import { useCallback, useEffect } from 'react'

export function useKeyboard(onKey: (key: string) => void, enabled = true) {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!enabled) return
        if (e.key === 'Enter' || e.key === 'Backspace') {
            onKey(e.key)
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            onKey(e.key.toLowerCase())
        }
    }, [onKey, enabled])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])
}

