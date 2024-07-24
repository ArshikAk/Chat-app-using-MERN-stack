import axios from "axios"
import {useState , useEffect , useRef} from "react";
import '../Styles/home.css'

import logo from "../assets/logo.png"
import personLogo from "../assets/person.png"
import contactLogo from "../assets/contactLogo.png"

import {io} from "socket.io-client"

const socket = io("http://localhost:5175")

function Home()
{

    document.title = "Home Page"

    const [msg , setMsg] = useState("");
    const [receiveMsg, setReceiveMsg] = useState([])
    const [totalMsg, setTotalMsg] = useState([])

    const [contact , setContact] = useState([])
    const [contactName , setContactName] = useState("")

    const [currentReceiver, setCurrentReceiver] = useState("Chats")
    const [currentReceiverStatus, setCurrentReceiverStatus] = useState("")

    const [contactStatus , setContactStatus] = useState([])

    const [tempContact , setTempContact] = useState([])

    const targetRef = useRef(null)


    let email = localStorage.getItem("email");


    useEffect(() => {
        axios.post("http://127.0.0.1:5173/contact")
        .then(result => {
            let variable = result.data
            setContact(variable);
            console.log(contact)
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
            temp.forEach((data) => {
                if(temp3.includes(data.email))
                {
                    temp2.push(data)
                }
            })
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
                if(ele.includes(contactName))
                {
                    temp.push(ele)
                }
            })
            setTempContact(temp)

    },[contactName])

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
            setMsg("")
        }
        
    }


    const searchContact = () => {
        if(contactName == "")
        {
            alert("Please enter a Contact Name")
        }
        else
        {
            let temp = []
            contact.forEach((ele) => {
                if(ele.includes(contactName))
                {
                    temp.push(ele)
                }
            })
            setTempContact(temp)
        }
    }

    socket.on("receive_message",(data) => {
        setReceiveMsg(
            [...receiveMsg,data.message]
        )

        let newMsg = {
            message : data.message,
            type : "receive"
        }

        setTotalMsg([...totalMsg,newMsg])
        
        })

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
                <div className="left">
                    <div className="left-nav">
                            <img src={contactLogo} alt=""/>
                            <h2>Contacts</h2>
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="Search Contacts" className="input-field" onChange={(e) => setContactName(e.target.value)}/>
                        <button className="send-btn" onClick={searchContact}>Search</button>
                    </div>
                    <div className="list">
                            {
                                contactStatus.map((data,index) => {
                                return(
                                    <>
                                        <button key={index} className="contact" value={data.email} onClick={() => {
                                            setCurrentReceiver(data.email)
                                            setCurrentReceiverStatus(data.status)
                                        }} style={currentReceiver == data.email ? {backgroundColor : "rgb(97, 91, 91)",color : "white", border : "2px solid black"} : {display : "block"}}>

                                            <div className="contact-details">
                                                <div className="left-side">
                                                    <img src={personLogo} alt="" />
                                                </div>
                                                <div className="right-side">
                                                    <p> {data.email}</p>
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
                <div className="right">
                    <div className="right-nav">
                        <div className="contact-details-nav">
                                <div className="left-side-nav" style={currentReceiver == "Chats" ? {backgroundColor : "black"} : {backgroundColor : "white"}}>
                                    <img src={currentReceiver == "Chats" ? logo : personLogo} alt="" />
                                </div>
                                <div className="right-side-nav">
                                    <span style={currentReceiver == "Chats" ? {textAlign : "center" , padding : "10px",fontSize : "35px"} : {textAlign : "start"}}> {currentReceiver}</span>
                                    <br />
                                    <span className={currentReceiverStatus}>{`${currentReceiverStatus}`}</span>
                                </div>
                            </div>
                        </div>
                    <div className="messages" ref={targetRef} id="messages">
                        {
                        totalMsg.map((msg,index) => {
                            return(
                                <>
                                    {/* <span key={index}>{msg.type == "send" ? {email} : {currentReceiver}}</span> */}
                                    <div className={msg.type == "send" ? "send" : "receive"} key= {index}>{msg.message}</div>
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