import nodemailer from "nodemailer";
import Otp from '../models/otpModel.js';


export const sendOtpController = async (req,res)=>{
   const otp = Math.floor(1000 + Math.random() *9000).toString()
   const {email} = req.body
   console.log(email)
     await Otp.findOneAndUpdate(
    {email},
    {otp, createAt:new Date()},
    {upsert : true}

   )
   async function sendOtp (){

   try {
      const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port : 587,
    secure:false,
    auth : {
        user:'aki748434@gmail.com',
        pass :'qtvy zetr dgxl kcpu'
    }
})

const info = await transporter.sendMail({
    to: email,
    subject : 'storage App otp',
    html : `<p>Your Otp Is</p><h1>${otp}</h1>`
})

console.log("message sent", info.messageId) 
   } catch (error) {
      console.log(error)
   }
}
await sendOtp()
return res.status(201).json({message : 'otp send succsfully'})
}







