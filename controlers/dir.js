import { rm } from 'fs/promises';
import Folder from '../models/dirModel.js';
import Files from '../models/fileModel.js';


export const getDirController = async (req, res) => {
    const db = req.db;
    const user = req.user;
    const id = req.params.id || user.folderId;
    const folderData = await Folder.findOne({ _id: id }).lean()
   if(!user){
    
    return res.status(401).json({message:"login to use fetures"})
   }

    if (!folderData) {
        return res.status(401).json({ message: 'no folder found' })
    }
    const fiels = await Files.find({ parentDirId: folderData._id }).lean()
    



    const directories = await Folder.find({ parentDirId: id });

    res.json({ folderData, directories, fiels })
}

export const postDirController = async (req, res) => {
    const user = req.user;
    const db = req.db;

    const parentDirId = req.params.parentDirId || user.folderId
    const dirName = req.body.dirName || 'New Folder';

    try {
        const parentDir = await Folder.findOne({ _id: parentDirId })
        if (!parentDir) {
            return res.status(404).json({ message: 'no folder found' })
        }
        const saveDir = await Folder.insertOne({
            dirName,
            parentDirId,
            userId: user._id
        })

        res.status(201).json({ message: "dir created succfully" })
    } catch (error) {
        res.json({ message: error.message })
    }
}


export const updateDirController = async (req, res) => {

    try {
        const id = req.params.id
        const { newDirName } = req.body
        const db = req.db;
        const result = await Folder.updateOne(
            { _id: id },
            { $set: { dirName: newDirName } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Directory not found' });
        }
        return res.status(200).json({ message: 'dir name updated succfully' })
    } catch (error) {
        res.json({ message: 'error accured while renaming dir' })
    }

}

export const deleteDirController = async (req, res) => {
    const id = req.params.id;
    const db = req.db;
    
    const directoriesData = await Folder.findOne({ _id: id, userId: req.user._id }).select('_id')
    
    if(!directoriesData){
        return res.json({message:'no folder found'})
    }
    const user = await Folder.findOne({userId:req.user._id})
    if(!user){
        return res.json({message:'not allowed to delete'})
    }
    try {
        // Recursive function to get all content
        async function getAllDirContent(currentId) {
            const filesCollection = await Files.find(
                { parentDirId: currentId }
            );
            const folderCollection = await Folder.find(
                { parentDirId: currentId }
            );
            
            // Process subfolders recursively
            for (const {_id} of folderCollection) {
                const {filesCollection: childFiles, folderCollection: childFolders} = await getAllDirContent(_id);
                filesCollection.push(...childFiles);
                folderCollection.push(...childFolders);
            }
            return { filesCollection, folderCollection };
        }
        // Get all files and folders
        const {filesCollection, folderCollection} = await getAllDirContent(id);

        // Delete physical files
        for (const {_id, extinacen} of filesCollection) {
            // console.log({_id,extinacen})
            try {
                await rm(`./storage/${_id.toString()}${extinacen}`);

            } catch (fileError) {
                console.error(`Error deleting file ${_id}:`, fileError);
                // Continue with other files even if one fails
            }
        }
        // Delete database records
        if (filesCollection.length > 0) {
            await Files.deleteMany({
                _id: { $in: filesCollection.map(file => file._id) }
            });
        }
            await Folder.deleteMany({
                _id: { $in: [...folderCollection.map(folder => folder._id),id] }
            });
       
    return res.json({ message: 'Directory deleted successfully' });
    } catch (error) {
        console.error('Error deleting directory:', error);
        return res.status(500).json({ 
            message: 'Error occurred while deleting directory', 
            error: error.message 
        });
    }
}