import 'bootstrap/dist/css/bootstrap.min.css';

import { useState } from 'react'
import './styles/App.css'
import './styles/BookCard.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    // <>
    // <h1>SAMPLE</h1>
    // <HomePage/>
    // </>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/book/:isbn" element={<BookPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
