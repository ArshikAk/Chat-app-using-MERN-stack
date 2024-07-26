import { useState } from "react";
import "../Styles/register.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function UpdateProfile(){

    document.title = "Edit Profile Page"

    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [cpassword,setCPassword] = useState("")
    const [image, setImage] = useState()

    const navigate = useNavigate()


    const SubmitHandler = () =>{
        event.preventDefault();

        document.getElementById("nameError").style.display = "none";
        document.getElementById("passwordError").style.display = "none";
        document.getElementById("confirmPasswordError").style.display = "none";

        let email = localStorage.getItem("email")


        if(!name)
        {
            document.getElementById("nameError").style.display = "block";
            return false
        }

        if(!password)
        {
            document.getElementById("passwordError").style.display = "block";
            return false
        }

        if(!(password===cpassword))
        {
            document.getElementById("confirmPasswordError").style.display = "block";
            return false
        }

        let formData = new FormData()
        formData.append("name",name)
        formData.append("email",email)
        formData.append("file",image)
        formData.append("password",password)

        axios.post("http://127.0.0.1:5173/updateProfile",formData)
        .then(result =>{
            if(result.data === "updated")
            {
                alert("Profile Update Completed Successfully")
                navigate("/home")
            }
            else{
                alert("Profile Update Aborted")
            }
        }
        )
        .catch(err => {
            console.log(err)
        })
    }

    return (
            <center>
            <div className="content" >
                <div className="Register">
                    <h2>EDIT PROFILE PAGE</h2>
                    <form  id="form" onSubmit={SubmitHandler}>
                        <label>Name:</label>
                            <br />
                        <input id="name" type="text" placeholder="Name" onChange={(e) => {setName(e.target.value)}}/>
                            <br />
                        <span id="nameError" className="message">Name should be atleast 3 letters</span>
                            <br />
                        <label>Password:</label>
                            <br />
                        <input id="password" type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                            <br />
                        <span id="passwordError" className="message">Password length should be minimum 8</span>
                            <br />
                        <label>Confirm Password:</label>
                            <br />
                        <input id="confirmPassword" type="password" placeholder="Confirm Password" onChange={(e) => {setCPassword(e.target.value)}}/>
                            <br />
                        <span id="confirmPasswordError" className="message">Password doesnt match</span>
                            <br />
                        <label>Upload Profile Image:</label>
                            <br />
                        <input id="image" type="file" onChange={(e) => {setImage(e.target.files[0])}}/>
                        <button type="submit">Update</button>
                       <br />
                    </form>
                </div>
        </div>
    </center>
    )
}

export default UpdateProfile;