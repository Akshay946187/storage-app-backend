const key = process.env.RESEND_KEY;

import {Resend} from 'resend';
import Otp from '../models/otpModel';

const resend = new Resend(key);

export async function sendOtp(email){
    const otp = Math.floor(1000 + Math.random()*9000).toString()

    //upsert otp (replace otp if it already exists)
    await Otp.findOneAndUpdate(
        {email},
        {otp,createAt:new Date()},
        {upsert:true,new:true}
    );

    const html = `
    <div>
    <h2>your otp is ${otp}</h2>
    <p>this is valid for 10 minutes</p>
    </div>
    `
    
}