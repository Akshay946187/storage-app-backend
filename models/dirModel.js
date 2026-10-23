import mongoose from "mongoose";

const dirSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    dirName:{
        type:String,
        required:true,
        default:"root"
    },
    parentDirId:{
        type:mongoose.Types.ObjectId,
        default:null,
        
    }
},{
    strict:'throw'
})

const Folder = mongoose.model('Folder',dirSchema)
export default Folder;