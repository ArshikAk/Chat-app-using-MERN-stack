import { Routes , Route } from "react-router-dom"
import Login from "./Components/login"
import Home from "./Components/home"
import Register from "./Components/register"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/home" element={<Home/>}></Route>
    </Routes>
  )
}

export default App
