const mongoose = require("mongoose")

const chatData = new mongoose.Schema({
    sender: String,
    receiver: String,
    message: Array
})

const chatModel = mongoose.model("chats",chatData)

module.exports = chatModel