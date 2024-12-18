const { Schema, model } = require("mongoose")
const userSchema = new Schema({
    name: {type:String, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
    image: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now()}
})

module.exports = model("User", userSchema)