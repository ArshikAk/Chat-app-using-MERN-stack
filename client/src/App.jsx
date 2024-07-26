import { Routes , Route } from "react-router-dom"
import Login from "./Components/login"
import Home from "./Components/home"
import Register from "./Components/register"
import UpdateProfile from "./Components/updateProfile"
import CreateGroup from "./Components/createGroup"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/home" element={<Home/>}></Route>
      <Route path="/update" element={<UpdateProfile/>}></Route>
      <Route path="/group" element={<CreateGroup/>}></Route>
    </Routes>
  )
}

export default App
