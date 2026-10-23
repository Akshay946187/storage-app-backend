

import {  Router } from 'express';

import { deleteFileController, getFileController, initiateUpload,  updateFileController } from '../controlers/file.js';

const router = Router()


//this is a middleware which runs on every dynamic route which match /:id route
// router.param('id',(req,res,next,id)=>{
//     console.log(id)
//     if(id.length !== 36){
//         return res.status(400).json({error:`invalid id ${id}`})
//     }
//     next()
// })
router.post("/initiateUpload",initiateUpload)
router.get('/:id', getFileController)



// router.post('/:parentDirId?', postFileController)

router.patch('/:id',updateFileController);





router.delete('/:id', deleteFileController);


export default router ;