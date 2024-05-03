import './App.css'
import Navigation from './pages/Navigation'
import MainPage from './pages/MainPage'
import NewReceipts from './pages/NewReceipts'
import Sklad from './pages/Scklad'
import DeletePage from './pages/DeletePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App () {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/NewReceipts' element={<NewReceipts />} />
        <Route path='/Sklad' element={<Sklad />} />
        <Route path='/DeletePage' element={<DeletePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
