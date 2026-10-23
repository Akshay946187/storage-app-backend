import { Schema } from "mongoose";
import mongoose from "mongoose";


const sessionSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:1000 * 60 * 60 * 24 * 7,
    }
})

const Session = mongoose.model('session',sessionSchema)
export default Session;
