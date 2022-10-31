import { ThemeProvider } from 'styled-components'
import { BookingsProvider } from './contexts/BookingsContext'
import { Bookings } from './pages/Bookings'
import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <BookingsProvider>
        <Bookings />
      </BookingsProvider>
    </ThemeProvider>
  )
}
