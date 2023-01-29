const mongoose = require("mongoose")
const Collection = require("./Collection")
const Song = require("./Song")

const userSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email cannot be empty."],
        unique: [true, "Email has already been taken."]
    },
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    password: {
        type: String,
        required: [true, "Password cannot be empty."],
        minLength: [8, "Password must be at least 8 characters"]
    },
    pfpUrl: {
        type: String
    },
    username: {
        type: String,
        required: [true, "Must provide username."],
        unique: [true, "Username taken."],
        lowercase: true,
        maxLength: [30, "Username must not exceed 30 characters"]
    }
})

userSchema.path("email").validate((email) => {
    const regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    return email.match(regex)
}, "Email is not in a valid format.")

userSchema.path("username").validate((username) => {
    return username.match(/^[0-9A-z_]+$/)
}, "Username must only contain, letters, numbers, and underscores.")

module.exports = mongoose.model("User", userSchema)