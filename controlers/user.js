
import {z} from "zod/v4"
import User from '../models/userModel.js';
import Folder from '../models/dirModel.js'
import crypto from 'crypto'
import Session from '../models/session.js';
import Otp from '../models/otpModel.js';
import { verifyIdToken } from '../utils/googleAuth.js';
import { loginSchema, otpSchema, signupSchema } from "../validaters/authSchema.js";



export const signupController = async (req, res) => {
  //  const session = await mongoose.startSession();
  //  session.startTransaction();
 
   try {
    const{data,error} = signupSchema.safeParse(req.body)
  
    if(error){
      return res.status(400).json({error})
    }
     const { name, email, password } = data;
 
     if (!name || !email || !password) {
      //  await session.abortTransaction();
       return res.status(400).json({ message: "All fields are required" });
     }
 
     const emailExist = await User.findOne({ email })
     if (emailExist) {
      //  await session.abortTransaction();
       return res.status(409).json({ message: "User already exists" });
     }
    
    const hashPassword = crypto.createHash("sha256").update(password).digest('base64url')
     const user = await User.create([{
       name,
       email,
       password:hashPassword, 
     }]);
 
     const userId = user[0]?._id;
     
   
     const folder = await Folder.create([{
       userId,
       dirName: "root",
       parentDirId: null,
     }]);
 
     const folderId = folder[0]._id;
     
 
     await User.updateOne(
       { _id: userId },
       { $set: { folderId } },
      
     );
 
    //  await session.commitTransaction();
     
     res.status(201).json({
       status: 'success',
       message: "User created ",
       userId,
       folderId,
     });
   }catch (error) {
  
} finally {
    //  session.endSession();
   }
 };

 export const loginControler = async (req, res) => {
   try {
      const {success,error,data} = loginSchema.safeParse(req.body)
      console.log({success,error,data})
      if(error){
        return res.status(400).json({error:error.message})
      }
      const { email, password } = data;
     const user = await User.findOne({email})
     if (!user) {
       return res.status(400).json({ message: 'no user found with this email' })
    }
    const hashPassword = crypto.createHash("sha256").update(password).digest('base64url')
    if(hashPassword !== user.password){
      return res.json({message : "your password is increct"})
    }

    const allSessions = await Session.find({userId : user.id} )
    console.log(allSessions.length)
    if(allSessions.length >=1){
      await allSessions[0].deleteOne()
    }

    const session = await Session.create({userId:user._id})
  
       res.cookie('sid', session.id, { httpOnly: true,signed:true, maxAge: 1000 * 60 * 60 * 24 * 7 });
      return res.status(200).json({ message: 'logdin succfully' })
   } catch (error) {
    res.status(400).json({message:"something went wrong 96 userjs"})
   }
    
 }

 export const getUserControler = (req, res) => {
    const { name, email } = req.user;
    res.status(200).json({ name, email })
 }
 export const getAllUsersControler = async(req, res) => {
   const allUsers = await User.find()
   const allSessions = await Session.find()
   const allSessionUserId = allSessions.map(({userId})=>userId.toString());
   console.log(allSessionUserId)
   const editUsers = allUsers.map(({_id,name , email})=>{
    return {
      _id,
      name,
      email,
      isLogedIn:allSessionUserId.includes(_id.toString())
    }
   })
   console.log(editUsers)
    res.status(200).json(editUsers)
 }

 export const logoutControler = async (req, res) => {
    try {
       const { sid } = req.signedCookies
      console.log(sid)
      await Session.findByIdAndDelete(sid)
       res.cookie('sid', '', {
          maxAge: 0
       })
       res.status(200).json({ message: 'user Logout succfully' })
    } catch (error) {
       res.json({ error: error.message })
    }
 }

 export const verifyEmail = async (req,res)=>{
     const {data,error} = otpSchema.safeParse(req.body)
     console.log({error})
     if(error){
      return res.status(400).json({error:"error"})
     }
     const {otp,email} = data
     const emailOtp = await Otp.findOne({email})
     console.log(emailOtp.otp)
     if(emailOtp.otp !== otp){
      return res.status(400).json({message : "your otp was encorrect"})
     }
     res.status(200).json({message : "email verified"})
 }

//login with google
  export const loginWithGoogle = async (req,res)=>{
 try {
     const idToken = req.body.idToken;
    const userData = await verifyIdToken(idToken)
    const {email,picture,name} = userData;
    const user = await User.findOne({email}).lean()
    if(user){
      const allSessions = await Session.find({userId : user.id} )
    console.log(allSessions.length)
    if(allSessions.length >=1){
      await allSessions[0].deleteOne()
    }

    const session = await Session.create({userId:user._id})
  
       res.cookie('sid', session.id, { httpOnly: true,signed:true, maxAge: 60 * 60 * 60 * 24 * 7 });
      return res.status(200).json({ message: 'logdin succfully' })
    }
    
    const newUser = await User.create([{
       name,
       email,
       picture 
     }]);
 
     const userId = newUser[0]?._id;
     
   
     const folder = await Folder.create([{
       userId,
       dirName: "root",
       parentDirId: null,
     }]);
 
     const folderId = folder[0]._id;
     
 
     await User.updateOne(
       { _id: userId },
       { $set: { folderId } },
      
     );
     const allSessions = await Session?.find({userId : user.id} )
   
    if(allSessions.length >=1){
      await allSessions[0].deleteOne()
    }

    const session = await Session.create({userId:user._id})
  
       res.cookie('sid', session.id, { httpOnly: true,signed:true, maxAge: 1000*60 * 60 * 60 * 24 * 7 });
     

     res.status(200).json({userData})
 } catch (error) {
  console.log(error)
 }
 }

