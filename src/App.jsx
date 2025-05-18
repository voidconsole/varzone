
import LoginCard from './login'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './home'
import RegisterCard from './register'
import CreateVar from './create'
function App() {

  return (
      <>
          <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/login" element={<LoginCard />}></Route>
              <Route path="/register" element={<RegisterCard />}></Route>
              <Route path="/create" element={<CreateVar />}></Route>
          </Routes>
      </>
  )
}

export default App
