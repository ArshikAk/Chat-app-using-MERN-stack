import axios from "axios"
import {useState , useEffect , useRef} from "react";
import '../Styles/home.css'

import logo from "../assets/logo.png"
// import personLogo from "../assets/person.png"


import { useNavigate } from "react-router-dom";


function Home()
{

    document.title = "Home Page"

    const [msg , setMsg] = useState("");
    const [totalMsg, setTotalMsg] = useState([])

    const [contact , setContact] = useState([])
    const [contactName , setContactName] = useState("")

    const [currentReceiver, setCurrentReceiver] = useState("Chats")
    const [currentReceiverStatus, setCurrentReceiverStatus] = useState("")
    const [currentReceiverContact , setCurrentReceiverContact] = useState({})

    const [contactStatus , setContactStatus] = useState([])

    const [tempContact , setTempContact] = useState([])

    const [contactLength , setContactLength] = useState(0)

    const [messagelength , setMessageLength] = useState(0)

    const targetRef = useRef(null)

    const [dropdown , setDropdown] = useState(false)

    const [profile , setProfile] = useState([])


    let email = localStorage.getItem("email");

    const navigate = useNavigate()


    useEffect(() => {
        axios.post("http://127.0.0.1:5173/profile",{email})
        .then(result => {
            setProfile([result.data])
        })
        .catch((err) => {
            console.log(err)
        })
    },[email])

    useEffect(() => {
        axios.post("http://127.0.0.1:5173/contact")
        .then(result => {
            let variable = result.data
            setContact(variable);
        })
        .catch(err => {
            console.log(err)
            console.log("contacts error");
        })
    },[])

    useEffect(() => {
        axios.post("http://127.0.0.1:5173/getMsg",{email,currentReceiver})
        .then(result => {
            if(result.data == "noMsgFound")
            {
                setTotalMsg([])
            }
            else{
                let val = result.data.message
                setTotalMsg(val)
            }

            setMessageLength(totalMsg.length)
            // let lastItem = targetRef.current.lastElementChild;
            // lastItem.scrollIntoView(false);
        })
        .catch(err => {
            console.log(`Get Msg error : ${err}`);
        })
    })

    useEffect(() => {
        axios.get("http://127.0.0.1:5173/contactStatus")
        .then(result => {
            let temp = result.data
            let temp2 = []
            let temp3 = []
            if(contactName == "")
            {
                temp3 = contact
            }
            else{
                temp3 = tempContact
            }

            let temp4 = []
            temp3.forEach((data) => {
                temp4.push(data.email)
            })

            temp.forEach((data) => {
                if(temp4.includes(data.email))
                {
                    let data1 = {
                        email : data.email,
                        status : data.status

                    };
                    temp3.forEach((ele) => {
                        if(ele.email == data.email)
                        {
                            data1.image = ele.image
                        }
                    })
                    temp2.push(data1)
                }
            })
            setContactLength(temp2.length)
            setContactStatus(temp2)
        })
        .catch(err => {
            console.log(err)
            console.log("contacts error");
        })
    })

    useEffect(() => {

        let temp = []
            contact.forEach((ele) => {
                let ele1 = ele.email
                if(ele1.includes(contactName))
                {
                    temp.push(ele)
                }
            })
            setTempContact(temp)

    },[contactName])


    useEffect(() => {
        axios.post("http://127.0.0.1:5173/getNotification",{email})
        .then(result => {
            if(result.data == "nothing")
            {
               return;
            }
            else
            {
                alert(`A new message from ${result.data}`)
            }
        })
        .catch(err => {
            console.log(err)
        })
    })


    const sendMessage = () => {
        if(msg == "")
        {
            alert("Enter a Valid message");
        }
        if(currentReceiver == "")
        {
                alert("Select a Valid Contact");
        }

        else{
            axios.post("http://127.0.0.1:5173/chats",{email,currentReceiver,msg})
            .then(result => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err)
            })
            axios.post("http://127.0.0.1:5173/sendNotification",{email , currentReceiver})
                .then(result => {   
                    console.log(result)
                })
                .catch(err => {
                    console.log(err)
            })
            setMsg("")
        }
        
    }


    // const searchContact = () => {
    //     if(contactName == "")
    //     {
    //         alert("Please enter a Contact Name")
    //     }
    //     else
    //     {
    //         let temp = []
    //         contact.forEach((ele) => {
    //             if(ele.includes(contactName))
    //             {
    //                 temp.push(ele)
    //             }
    //         })
    //         setTempContact(temp)
    //     }
    // }

    // socket.on("receive_message",(data) => {
    //     setReceiveMsg(
    //         [...receiveMsg,data.message]
    //     )

    //     let newMsg = {
    //         message : data.message,
    //         type : "receive"
    //     }

    //     setTotalMsg([...totalMsg,newMsg])
        
    //     })

    window.addEventListener("load", () => {
            let status = "Online"
            axios.post("http://127.0.0.1:5173/status",{email , status})
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err)
            })
        })

    window.addEventListener("beforeunload", () => {
        let status = "Offline"
        axios.post("http://127.0.0.1:5173/status",{email , status})
        .then((result) => {
            console.log(result)
        })
        .catch((err) => {
            console.log(err)
        })
    })
    

    return(
        <div className="home">
            <div className="chat">
                <div className="left" style={dropdown ? {display : "none"} : {display : "block"}}>
                    <div className="left-nav">
                        {
                            profile.map((data) => {
                                return(
                                    <>
                                        <button onClick={() => setDropdown(true)} className="dropdown">☰</button>
                                        <img src={`http://127.0.0.1:5173/`+data.image} alt="" />
                                        <p> {data.email}</p>
                                    </>
                                )
                            })
                        }
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="Search Contacts" className="input-field" id="search" onChange={(e) => setContactName(e.target.value)}/>
                    </div>
                    <div className="list" style={contactLength == 0 ? {display : "block"}:{display : "none"}}>
                        <h2 className="contact" style={{textAlign : "center" , padding : "20px 0px"}}>No Contacts Found</h2>
                    </div>
                    <div className="list" style={contactLength == 0 ? {display : "none"}:{display : "block"}}>
                            {
                                contactStatus.map((data,index) => {
                                return(
                                    <>
                                        <button key={index} className="contact" value={data.email} onClick={() => {
                                            setCurrentReceiver(data.email)
                                            setCurrentReceiverStatus(data.status)
                                            setCurrentReceiverContact(data)
                                        }} style={currentReceiver == data.email ? 
                                                    {backgroundColor : "rgb(97, 91, 91)",color : "white", border : "2px solid black"} : {display : "block"}}>

                                            <div className="contact-details">
                                                <div className="left-side">
                                                    <img src={`http://127.0.0.1:5173/`+data.image} alt="" />
                                                </div>
                                                <div className="right-side">
                                                    <p> {data.email == email ? "You" : data.email}</p>
                                                    <p className={data.status}>{`${data.status}`}</p>
                                                </div>
                                            </div>
                                        </button>
                                    </>
                                )
                                })
                            }
                    </div>
                </div>
                <div className="left" style={dropdown ? {display : "block"} : {display : "none"}}>
                    <div className="left-nav">
                        <button onClick={() => setDropdown(false)} className="dropdown">☰</button>
                        <p style={{fontSize : "30px" , margin : "0" , marginTop : "10px"}}>Profile</p>
                    </div>
                    {
                        profile.map((data,index) => {
                            return(
                                <div className="profile" key={index}>
                                    <div className="profile-img">
                                        <img src={`http://127.0.0.1:5173/`+data.image} alt="" />
                                    </div>

                                <div className="profile-details">
                                    <p>Name : {data.name}</p>
                                    <p>Email Id : {data.email}</p>
                                    <p>Password : {data.password}</p>
                                </div>
                                    
                                </div>
                                )
                        })
                    }
                    <br />
                    <br />

                    <button className="contact" style={{textAlign : "center"}} onClick={() => navigate("/update",)}>Edit</button>
                    <button className="contact" style={{textAlign : "center"}} onClick={() => navigate("/",{replace : true})}>LogOut</button>
                </div>
                <div className="right">
                    <div className="right-nav">
                        <div className="contact-details-nav">
                                <div className="left-side-nav" style={currentReceiver == "Chats" ? {backgroundColor : "black"} : {backgroundColor : "white"}}>
                                    <img src={currentReceiver == "Chats" ? logo : `http://127.0.0.1:5173/`+currentReceiverContact.image} alt="" />
                                </div>
                                <div className="right-side-nav">
                                    <span style={currentReceiver == "Chats" ? {textAlign : "center" , padding : "10px",fontSize : "35px"} : {textAlign : "start"}}> 
                                        {currentReceiver}</span>
                                    <br />
                                    <p className={currentReceiverStatus} id="status">{`${currentReceiverStatus}`}</p>
                                </div>
                            </div>
                        </div>

                        <div className="messages" style={(messagelength == 0 && currentReceiver != "Chats") ? {display : "block"} : {display : "none"}}>

                            <h2 style={
                                {padding : "10px 0px" , textAlign : "center" , color : "white" , backgroundColor : "black" , border : "1px solid gray" }}>
                                    Send a Message to Start the Conversation
                            </h2>

                        </div>


                    <div className="messages" ref={targetRef} id="messages" style={(messagelength == 0 && currentReceiver != "Chats") ? {display : "none"} : {display : "block"}}>
                        {
                        totalMsg.map((msg,index) => {
                            return(
                                <>
                                    <div className={msg.type == "send" ? "send" : "receive"} key= {index}>
                                        {msg.message}
                                        {/* <hr />
                                        {msg.type == "send" ? email : currentReceiver} */}
                                    </div>
                                </>
                                )
                                })
                        }
                    </div>
                    <div className="input">
                            <input type="text" placeholder="Enter your message" className="input-field" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                            <button className="send-btn" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home