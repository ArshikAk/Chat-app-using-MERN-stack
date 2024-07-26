const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    email : String,
    notification : Array
})

const notificationModel = mongoose.model("notification",notificationSchema)

module.exports = notificationModel