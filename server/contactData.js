const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    email : String,
    contacts : Array
})

const contactModel = mongoose.model("contact",contactSchema)

module.exports = contactModel