import { createWriteStream } from 'fs';
import path from 'path'
import { rm } from 'fs/promises';
import { ObjectId } from 'mongodb';
import Files from '../models/fileModel.js';
import Folder from '../models/dirModel.js';
import { createGetSignedUrl, createUploadSignedUrl, DeleteSignedUrl } from '../utils/awss3.js';


export const getFileController = async (req, res) => {
    const id = req.params.id

    try {
        const file = await Files.findOne({ _id: id })

        if (!file) throw new Error('file not found')
        const url = await createGetSignedUrl({ key: `${id}${file.extinacen}` })

        // 

        if (req.query.action == "download") {
            const url = await createGetSignedUrl({ key: `${id}${file.extinacen}`, download: true, fileName: file.fileName })
            return res.redirect(url)
        } else {
            const url = await createGetSignedUrl({ key: `${id}${file.extinacen}`, download: false, fileName: file.fileName })
            return res.redirect(url)

        }
    } catch (error) {
        res.json({ message: error.message })
    }
}
// because we are uploading on aws 
// export const postFileController = async (req, res) => {
//     const fileName = req.headers.filename
//     const fileSize = req.headers.filesize


//     const user = req.user;
//     const parentDirId = req.params.parentDirId || user.folderId;
//     const parentDir = await Folder.findOne({ _id: parentDirId })
//     if (!parentDir) {
//         return res.status(404).json({ message: 'directry is not found' })
//     }
//     try {
//         const extinacen = path.extname(fileName)
//         const file = await Files.insertOne({
//             extinacen,
//             parentDirId,
//             fileName,
//             fileSize
//         })
//         const id = file._id;
//         const fullFileName = `${id}${extinacen}`
//         const writeStrem = createWriteStream(`./storage/${fullFileName}`)
//         req.pipe(writeStrem)
//         req.on('end', () => {
//             res.status(201).json({ message: 'file uploaded' })
//         })
//     } catch (error) {
//         res.json({ error })
//     }
// }

export const updateFileController = async (req, res) => {
    const id = req.params.id;
    const { newFileName } = req.body;

    try {

        const file = Files.findOne({ _id: id })
        if (!file) throw new Error('file not found')
        await Files.updateOne({ _id: id }, { $set: { fileName: newFileName } })
        res.json({ message: 'Renamed successfully' });
    } catch (error) {
        console.error('Error renaming file:', error); // Log the actual error
        res.status(400).json({ message: 'Failed to rename file' });
    }
}

export const deleteFileController = async (req, res) => {
    const id = req.params.id;

    try {

        const file = await Files.findOne({ _id: new ObjectId(id) })
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        await Files.deleteOne({ _id: id })
        const response = await DeleteSignedUrl(`${id}${file.extinacen}`)
        console.log(response)

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: error.message });
    }
}

export const initiateUpload = async (req, res) => {
    try {
        console.log(req.body)
        const { fileName, fileSize, contentType } = req.body;

        if (!fileName || !contentType || fileSize == null) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }
        const user = req.user;
        const parentDirId = req.body.parentDirId || user.folderId;
        const parentDir = await Folder.findById(parentDirId);

        if (!parentDir) {
            return res.status(404).json({
                message: "Directory not found"
            });
        }

        const extinacen = path.extname(fileName);

        const file = await Files.create({
            extinacen,
            parentDirId,
            fileName,
            fileSize,
            isUploading: true,
        });

        const key = `${file._id}${extinacen}`;

        const uploadSignedUrl = await createUploadSignedUrl({
            key,
            contentType,
        });

        return res.status(200).json({
            uploadSignedUrl,
            id: file._id,
        });

    } catch (err) {
        console.error("Upload initiation error:", err);

        return res.status(500).json({
            message: "Failed to initiate upload"
        });
    }
};