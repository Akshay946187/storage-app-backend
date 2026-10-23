import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createAt:{
        type:Date,
        default:Date.now,
        expires:600,
    }
})

const Otp = mongoose.model('otp',otpSchema)
export default Otp ;