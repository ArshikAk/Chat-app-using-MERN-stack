import { useEffect, useState } from "react"
import axios from "axios"
import "../Styles/createGroup.css"
import { useNavigate } from "react-router-dom"

function CreateGroup(){

    const [name , setName] = useState("")
    const [description , setDescription] = useState("")
    const [members , setMembers] = useState([])

    const [contact , setContact] = useState([])

    const navigate = useNavigate()

    let email = localStorage.getItem("email")

    useEffect(() => {
        axios.post("http://127.0.0.1:5173/contact",{email})
        .then((res) => {
            setContact(res.data)
            console.log(contact)
        })
        .catch((err) => {
            console.log(err)
        })
    },[])

    const handleClick = (email) => {

        event.preventDefault()

        if(members.includes(email))
        {
            const valuesToRemove = [email];
            const filteredArr = members.filter(item => !valuesToRemove.includes(item));
            setMembers(filteredArr)
        }
        else{
            setMembers([...members,email])
        }
    }

    const submitHandler = (e) => {

        e.preventDefault()

        axios.post("http://127.0.0.1:5173/createGroup",{name,description,members})
        .then((res) => {
            if(res.data == "created")
            {
                alert("Group Created")
                navigate("/home",{replace : true})

            }
        })
        .catch((err) => {
            console.log(err)
        })
        
        
    }

    return(
        <div className="createGroup">
            <h1>Create group</h1>
            <form>
                <label>Group Name :</label>
                <input type="text" placeholder="Group name" onChange={(e) => setName(e.target.value)}/>
                <br />
                <label>Group Description :</label>
                <input type="text" placeholder="Group description" onChange={(e) => setDescription(e.target.value)}/>
                <br />
                <label>Group Members :</label>
                {
                    contact.map((item,index) => {
                        return(
                            <div key={index} className="groupFields">
                                <button className="btn">{item.email}</button>
                                <button onClick={() => handleClick(item.email)}>{members.includes(item.email) ? "Remove" : "Add"}</button>
                            </div>
                        )
                        })
                }
                <br />
                <br />
                <button onClick={(e) => submitHandler(e)}>Create Group</button>
            </form>
        </div>
    )
}

export default CreateGroup;