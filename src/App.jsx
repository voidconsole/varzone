
import LoginCard from './login'
import { Route, Routes } from 'react-router-dom'
import Home from './home'
import RegisterCard from './register'
import CreateVar from './create'
import JoinVar from './join'
import Varzone from './varzone'
import './App.css'
function App() {
	console.log(
        `%c✦  W E L C O M E   T O   H E L L  ✦\n%c  “Abandon all hope, ye who enter here.”`,
        'font-weight: 800;  color:rgb(252, 46, 46);  font-size: 1.5rem;  margin: 0;  filter: drop-shadow(-20px -10px 10px #dd02392c)    drop-shadow(10px 10px 20px #006be633);  transition: all 1s ease-in-out;',
        'color: #a29bfe; font-size: 14px; font-style: italic; font-family: "Courier New", monospace;'
    )
	      
  return (
      <>
          <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/login" element={<LoginCard />}></Route>
              <Route path="/register" element={<RegisterCard />}></Route>
              <Route path="/create" element={<CreateVar />}></Route>
              <Route path="/join" element={<JoinVar />}></Route>
              <Route path="/var" element={<Varzone />}></Route>
          </Routes>
      </>
  )
}

export default App
