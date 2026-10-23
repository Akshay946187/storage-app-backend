import mongoose, {Schema} from 'mongoose'

const fileSchema = new Schema({
    extinacen:{
        type:String,
        required:true
    },
    fileName:{
        type:String,
        required:true
    },
    parentDirId:{
        type:Schema.Types.ObjectId,
        ref:'Folder',
        required:true
    },
    fileSize :{
        type : String,
        require:true
    },
    isUploading : {
        type : Boolean,
        default:true
    },
},
    {strict:'throw',
    timestamps:true
})

const Files = mongoose.model('File',fileSchema)
export default Files