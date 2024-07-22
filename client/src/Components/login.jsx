import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/login.css"
import axios from "axios";

function Login() {

    document.title = "Login Page"

    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const navigate = useNavigate()

    const loginSubmitHandler = () => {

        event.preventDefault();
        document.getElementById("emailError").style.display = "none"
        document.getElementById("passwordError").style.display = "none"
        document.getElementById("userError").style.display = "none"

        if(!email)
        {
            document.getElementById("emailError").style.display = "block"
            return false
        }

        if(!password)
        {
            document.getElementById("passwordError").style.display = "block"
            return false
        }

        axios.post("https://chat-app-api-olive.vercel.app/",{email,password})
            .then(result => {
                console.log(result.data)
                if(result.data === "accepted"){
                    localStorage.setItem("email",email);
                    alert("Login Successfully Completed")
                    navigate("/home",{replace : true})
                }
                else if(result.data === "incorrect"){
                    document.getElementById("userError").style.display = "block"
                }
                else if(result.data === "notExisted"){
                    document.getElementById("userError").innerHTML = "Email Not Found"
                    document.getElementById("userError").style.display = "block"
                }
            })
            .catch(err =>{
                if(err)
                {
                    alert(err)
                }
            })
    }
    return (
        <center>
            <div className="content">
                <div className="Login" onSubmit={loginSubmitHandler}>
                    <h2>LOGIN PAGE</h2>
                    <form>
                        <label>Email:</label>
                        <br />
                        <input id="email" type="text" placeholder="Email Id" onChange={(e) => {setEmail(e.target.value)}}/>
                        <br />
                        <span id="emailError" className="message">Enter a Valid mail id</span>
                        <br />
                        <label>Password:</label>
                        <br />
                        <input id="password" type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                        <br />
                        <span id="passwordError" className="message">Enter a valid password</span>
                        <br />
                        <p>Not a Member  
                            <Link to="/register" id="link">Sign Up?</Link>
                        </p>
                        <span id="userError" className="message">Password mismatch</span>
                        <button type="submit">Log In</button>
                        <br />
                    </form>
                </div>
        </div>
        </center>
    )
}

export default Login;