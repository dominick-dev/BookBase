import { useState } from 'react'
import './styles/App.css'
import './styles/BookCard.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'

import HomePage from './pages/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  )
}

export default App
