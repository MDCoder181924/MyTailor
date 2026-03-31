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
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    professionalTitle: {
        type: String,
        default: "MASTER TAILOR & DESIGNER"
    },
    shopName: {
        type: String,
        default: ""
    },
    shopAddress: {
        type: String,
        default: ""
    },
    shopDescription: {
        type: String,
        default: ""
    },
    yearsOfExperience: {
        type: Number,
        default: 0
    },
    specializations: {
        type: [String],
        default: []
    },
    keySkills: {
        type: [String],
        default: []
    },
    identityStatus: {
        type: String,
        default: "Verified"
    }
}, { timestamps: true })

const Tailor = mongoose.model("Tailor", tailorSchema)

export default Tailor
