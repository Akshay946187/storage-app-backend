import Session from "../models/session.js";
import { ObjectId } from "mongodb";
import User from "../models/userModel.js";
import Files from "../models/fileModel.js";
import Folder from "../models/dirModel.js";
import { rm } from "fs/promises";


export const chectRole = (req,res,next)=>{
    if(req.user.role !== "user"){
        return next()
    }else{
        return res.status(403).json({error:"not authrized"})
    }
   
}


//logout user

export const logoutUser = async (req, res) => {
    try {
        const { userId } = req.params;

        console.log("logout called:", userId);

        const session = await Session.findOneAndDelete({
            userId: userId
        });

        return res.status(200).json({
            message: "user logout"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Something went wrong"
        });
    }
};

// delete user 

export const delteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await Session.deleteOne({userId})

    // 1. Find all folders belonging to the user
    const folders = await Folder.find({ userId });

    // 2. Get folder IDs
    const folderIds = folders.map(folder => folder._id);

    // 3. Find all files inside those folders
    const files = await Files.find({
      parentDirId: { $in: folderIds }
    });

    // 4. Delete physical files from storage
    for (const file of files) {
      await rm(`storage/${file.id}${file.extinacen}`);
    }

    // 5. Delete files from MongoDB
    await Files.deleteMany({
      parentDirId: { $in: folderIds }
    });

    // 6. Delete folders from MongoDB
    await Folder.deleteMany({ userId });

    // 7. Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User, folders and files deleted successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Something went wrong"
    });
  }
};