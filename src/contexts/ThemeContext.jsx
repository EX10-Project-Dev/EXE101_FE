import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'

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
      document.body.style.backgroundColor = '#FFF4EB'
      document.body.style.color = '#1C0A00'
    }
  }, [mode])

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const isDark = mode === 'dark'

  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: '#EA580C',
          light: '#FF7A1A',
          dark: '#C2410C',
          contrastText: '#FFFFFF'
        },
        background: {
          default: isDark ? '#150A05' : '#FFF4EB',
          paper: isDark ? '#1C0D06' : '#FFFFFF'
        },
        text: {
          primary: isDark ? '#FFFFFF' : '#1C0A00',
          secondary: isDark ? '#D6CDC6' : '#57534E'
        },
        divider: isDark ? '#3E1F12' : '#FDE8CC'
      },
      typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          '"Open Sans"',
          '"Helvetica Neue"',
          'sans-serif'
        ].join(',')
      },
      components: {
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? '#1C0D06' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : '#1C0A00',
              backgroundImage: 'none'
            }
          }
        },
        MuiDialogContent: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? '#1C0D06' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : '#1C0A00'
            }
          }
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none'
            }
          }
        }
      }
    })
  }, [isDark])

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme, isDark }}>
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
