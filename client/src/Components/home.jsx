import axios from "axios"
import {useState , useEffect , useRef} from "react";
import '../Styles/home.css'

import {io} from "socket.io-client"

const socket = io("http://localhost:5175")

function Home()
{

    document.title = "Home Page"

    const [msg , setMsg] = useState("");
    // const [sendMsg,setSendMsg] = useState([])
    const [receiveMsg, setReceiveMsg] = useState([])
    const [totalMsg, setTotalMsg] = useState([])

    const [contact , setContact] = useState([])
    const [contactName , setContactName] = useState()

    const [currentReceiver, setCurrentReceiver] = useState("Chats")

    // const [contactStatus , setContactStatus] = useState([])

    const targetRef = useRef(null)


    let email = localStorage.getItem("email");

    useEffect(() => {
        axios.post("https://chat-app-api-olive.vercel.app/contact",{email})
        .then(result => {
            let variable = result.data.contacts
            setContact(variable);
        })
        .catch(err => {
            console.log(err)
            console.log("contacts error");
        })
    },[])

    useEffect(() => {
        axios.post("https://chat-app-api-olive.vercel.app/getMsg",{email,currentReceiver})
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

    // useEffect(() => {
    //     axios.get("https://chat-app-api-olive.vercel.app/getContactStatus")
    //     .then(result => {
    //         let temp = result.data
    //         let temp2 = []

    //         temp.forEach((data) =>{
    //             if(contact.includes(data.email))
    //             {
    //                 temp2.push(data)
    //             }
    //         })
    //         setContactStatus(temp2)
    //     })
    //     .catch(err => {
    //         console.log(`getContactStatus error : ${err}`)
    //     })

    // })

    // useEffect(() => {
    //     window.addEventListener("beforeunload",() => {
    //         axios.post("https://chat-app-api-olive.vercel.app/onlineStatus",{email})
    //         .then(result => {
    //             console.log(result.data)
    //         })
    //         .catch(err => {
    //             console.log(`Online Status error : ${err}`)
    //         })
    //     })
    // })

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
            axios.post("https://chat-app-api-olive.vercel.app/chats",{email,currentReceiver,msg})
            .then(result => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err)
            })
            setMsg("")
        }
        
    }


    const addContact = () => {
        if(contactName == "")
        {
            alert("Please enter a valid contact Email ID")
        }
        else
        {
            let flag = 0;
            contact.forEach((ele) => {
                if(ele == contactName)
                {
                    flag = 1;
                }
            })
            if(flag)
            {
                alert("Contact already existed")
            }
            else{
                axios.post("https://chat-app-api-olive.vercel.app/addContact",{email , contactName})
                .then((result) => {
                    console.log(result)
                })
                .catch((err) => {
                    console.log(err)
                })
                window.location.reload()
            }
            setContactName("")
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
    

    return(
        <div className="home">
            <div className="nav">
                <h2>Chat Application</h2>
            </div>

            <div className="chat">
                <div className="left">
                    <div className="contacts">
                        <div className="left-nav">
                            <h2>Contacts</h2>
                        </div>
                        <div className="list">
                            {
                                contact.map((data,index) => {
                                return(
                                    <>
                                        <button key={index} className="contact" value={data} onClick={() => setCurrentReceiver(data)}>{data}</button>
                                    </>
                                )
                                })
                            }
                            {/* {
                                contactStatus.map((data,index) => {
                                return(
                                    <>
                                        <button key={index} className="contact" value={data.email} onClick={() => setCurrentReceiver(data.email)}>{`${data.email} : ${data.status}`}</button>
                                    </>
                                )
                                })
                            } */}
                        </div>
                    </div>
                    <div className="input">
                            <input type="text" placeholder="Enter the Email ID" className="input-field" value={contactName} onChange={(e) => setContactName(e.target.value)}/>
                            <button className="send-btn" onClick={addContact}>Add</button>
                    </div>
                </div>
                <div className="right">
                    <div className="right-nav">
                            <h2>{currentReceiver}</h2>
                        </div>
                    <div className="messages" ref={targetRef}>
                        {
                        totalMsg.map((msg,index) => {
                            return(
                                <div className={msg.type == "send" ? "send" : "receive"} key= {index}>{msg.message}</div>
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