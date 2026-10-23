import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dirRouter from './routes/dir.js'
import fileRouter from './routes/file.js'
import userRouter from './routes/user.js'
import checkAuth from './auth.js'
import { ConnectDb } from './mongooseDb.js'

ConnectDb()
const mySecret = '_0(+&845'
const port = process.env.PORT

try {
    
    const app = express()
app.use(cors({
    origin:process.env.CLIENT_URL,
   credentials:true
}))
app.use(express.json())
app.use(cookieParser(mySecret))
 
// app.use((req,res,next)=>{
//     console.log(req.url)
//    res.set({
//          'Access-Control-Allow-Origin':'*',
//          'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,PATCH',
//          'Access-Control-Allow-Headers':'Content-Type'
//    })
//     next()
// })
// app.use((req,res,next)=>{
//     req.db = db
//     next()
// })

app.use('/dir',checkAuth, dirRouter)
app.use('/file',checkAuth, fileRouter)
app.use('/user', userRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
} catch (error) {
    console.log(error)
}

// 729137006106-v610b0sp423349g04hec0mkf5cooj7th.apps.googleusercontent.com














