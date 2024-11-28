import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css'
import './styles/BookCard.css'

import BookCard from './components/BookCard'
import HomePage from './pages/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>SAMPLE</h1>
    <BookCard/>
    </>
  )
}

export default App
