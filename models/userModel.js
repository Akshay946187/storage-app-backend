import mongoose, {Schema} from 'mongoose'


const userSchema = new Schema({
    name:{
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
        
    },
    picture:{
        type:String,
        default: "https://lh3.googleusercontent.com/a/ACg8ocI0ET3VHY-iKGPeaRR9yuk4NlusrL2zWKAGxQHYqAQ80Qp47Wsx=s96-c"
        
    },
    role :{
        type:String,
        enum : ["admin","manager","user"],
        default : "user"
    },
    folderId:{
        type:Schema.Types.ObjectId,
        ref:'Folder'
        
    }
},{
    strict:'throw'
})

const User = mongoose.model('User',userSchema)
export default User