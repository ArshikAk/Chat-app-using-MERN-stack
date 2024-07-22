const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")


const app = express()

const http = require("http")
const {Server} = require("socket.io")

app.use(cors({
    origin: ["https://chat-app-using-mern-stack.vercel.app/"],
    credentials: true
}))

const server = http.createServer(app1)

// const io = new Server(server , {
//     cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST"]
//         }
// })

app.use(express.json())
app.use(cors({
    origin: ["https://chat-app-using-mern-stack.vercel.app"],
    credentials: true
}))

mongoose.connect("mongodb+srv://Arshik:ammukutty123@chatapp.upoqts6.mongodb.net/?retryWrites=true&w=majority&appName=ChatApp");

const userModel = require("./userData")
const chatModel = require("./chatData")
const contactModel = require("./contactData")
const statusModel = require("./statusData")

app.get("/",(req,res) => {
    res.send("Hello World")
})

app.post("/",(req,res) => {
    const {email,password} = req.body

    userModel.findOne({email : email})
    .then((user) => {
        if(user)
        {
            if(user.password == password)
            {
                // statusModel.findOne({email : email})
                // .then((result) => {
                //     if(result)
                //     {
                //         result.status = "Online"
                //         result.save()
                //     }
                //     else
                //     {
                //         statusModel.create({
                //             email : email,
                //             status : true
                //         })
                //     }
                // })
                // .catch((err) =>{
                //     console.log(`status error : ${err}`)
                // })
                res.json("accepted");
            }
            else{
                res.json("incorrect");
            }
        }
        else{
            res.json("notExisted")
        }
    })
})

app.post("/register",(req,res) => {
    const {name,email,password} = req.body

    userModel.findOne({email : email})
    .then((user) => {
        if(user)
        {
            res.json("existed")
        }
        else
        {
            userModel.create({
                name : name,
                email : email,
                password : password
            })
            .then((result) => {
                res.json("success")
            })
            .catch((err) => {
                console.log(err)
            })
        }
    })
    .catch((err) => {
        console.log(err)
    })
})

app.post("/addContact",(req , res) => {
    const {email , contactName} = req.body
    contactModel.findOne({email : email})
    .then((data) => {
        if(data)
        {
            data.contacts.push(contactName)
            data.save()
        }
        else{
            contactModel.create({
                email : email,
                contacts : [contactName]
            })
        }
        statusModel.findOne({email : contactName})
        .then((data) => {
            if(data)
            {
                console.log(data)
            }
            else{
                statusModel.create({
                    email : contactName,
                    status : "Offline"
                })
            }
        })
    })
    .catch((err) => {
        console.log(err)
    })
})

app.post("/contact", (req,res) => {
    const {email} = req.body
    contactModel.findOne({email : email})
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        console.log(err)
    })
})

app.post("/chats",(req,res) => {
    const {email , currentReceiver , msg} = req.body;

    const newEmail = currentReceiver
    const newReceiver = email

    chatModel.findOne({sender : email, receiver : currentReceiver})
    .then((result) => {
        if(result)
        {
            let newMsg = {
                message : msg,
                type : "send"
            }
            result.message.push(newMsg)
            result.save()
        }
        else{
            let newMsg = {
                message : msg,
                type : "send"
            }
            chatModel.create({
                sender : email,
                receiver : currentReceiver,
                message : [newMsg]
        })
        }
                chatModel.findOne({sender : newEmail, receiver : newReceiver})
                .then((result) => {
                if(result)
                {
                    let newMsg = {
                        message : msg,
                        type : "receive"
                    }
                    result.message.push(newMsg)
                    result.save()
                }
            else{
                let newMsg = {
                    message : msg,
                    type : "receive"
                }
                chatModel.create({
                    sender : newEmail,
                    receiver : newReceiver,
                    message : [newMsg]
                })
                }
            })
        .catch((err) => {
            console.log(err)
        })
    })
    .catch((err) => {
        console.log(err)
    })
})

app.post("/getMsg",(req,res) => {
    const {email,currentReceiver} = req.body
    chatModel.findOne({sender : email, receiver : currentReceiver})
    .then((result) => {
        if(result)
        {
            res.json(result)
        }
        else{
            res.json("noMsgFound")
        }
    })
    .catch((err) => {
        console.log(err)
    })
})

// app.post("/onlineStatus",(req,res) => {
//     const {email} = req.body
//     statusModel.findOne({email : email})
//     .then((result) => {
//         if(result)
//         {
//             result.status = "Offline"
//             result.save()
//         }
//         else{
//             statusModel.create({
//                 email : email,
//                 status : "Offline"
//             })
//         }
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// })

// app.get("/getContactStatus",(req,res) => {
//     statusModel.find()
//     .then((result) => {
//         if(result)
//         {
//             res.json(result)
//         }
//         else{
//             res.json("noStatusFound")
//         }
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// })

// io.on("connection",(socket) => {
//     socket.on("send_message",(message) => {
//         socket.broadcast.emit("receive_message",message)
//     })
// })



app.listen(5173 , () => {
    console.log("server is running on port 5173")
})


// server.listen(5175 , () => {
//     console.log("server is running on port 5175")
// })