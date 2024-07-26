const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
    name: String,
    description: String,
    members: Array,
    message : Array
})

const groupModel = mongoose.model("groups",groupSchema)

module.exports = groupModel