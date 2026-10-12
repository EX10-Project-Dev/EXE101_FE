import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Mặc định Dark Mode theo tone màu espresso chocolate đen ấm của Spotly
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('findgo-theme') || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('findgo-theme', mode)
    document.documentElement.setAttribute('data-theme', mode)
    if (mode === 'dark') {
      document.body.style.backgroundColor = '#150A05'
      document.body.style.color = '#FFFFFF'
    } else {
      document.body.style.backgroundColor = '#FFFFFF'
      document.body.style.color = '#1C0A00'
    }
  }, [mode])

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const isDark = mode === 'dark'

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
