const mongoose = require("mongoose")

const statusSchema = new mongoose.Schema({
    email : String,
    status : String
})

const statusModel = mongoose.model("status",statusSchema)

module.exports = statusModel