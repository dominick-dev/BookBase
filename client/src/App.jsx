import { useState } from 'react'
import './styles/App.css'
import './styles/BookCard.css'

import HomePage from './pages/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>SAMPLE</h1>
    <HomePage/>
    </>
  )
}

export default App
