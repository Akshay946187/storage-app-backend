import mongoose from "mongoose";

export async function ConnectDb(){
  try {
    mongoose.connect(process.env.Db_Url || '')
    console.log("mongoose connected")
 } catch (error) {
    console.log(error.message)
    process.exit(1)
 }
}

process.on('SIGINT',async ()=>{
   await mongoose.disconnect();
})