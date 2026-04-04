import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userFullName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userMobileNumber: {
        type: String,
        default: ""
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    preferredStyle: {
        type: String,
        default: "CLASSIC BESPOKE CLIENT"
    },
    deliveryAddress: {
        type: String,
        default: ""
    },
    bodyNotes: {
        type: String,
        default: ""
    },
    stylePreferences: {
        type: [String],
        default: []
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema)

export default User 
