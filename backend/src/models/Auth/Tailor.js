import mongoose from "mongoose";

const tailorSchema = mongoose.Schema({
    tailorName: {
        type: String,
        required: true
    },
    tailorEmail: {
        type: String,
        required: true,
        unique: true
    },
    tailorMobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    tailorPassword: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

const Tailor = mongoose.model("Tailor", tailorSchema)

export default Tailor
