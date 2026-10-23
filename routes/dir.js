import { Router } from 'express';
import { deleteDirController, getDirController, postDirController, updateDirController } from '../controlers/dir.js';


const router = Router()

router.get('/:id?', getDirController)

router.post('/:parentDirId?', postDirController)


router.patch('/:id', updateDirController)





router.delete('/:id', deleteDirController);

// ai code 
// router.delete('/:id', async (req, res) => {
//     const id = req.params.id;
//     try {
//         // Find the directory to delete
//         const dirIndex = foldersData.findIndex((folder) => folder.id === id);
//         if (dirIndex === -1) {
//             return res.status(404).json({ message: 'Directory not found' });
//         }

//         const dirData = foldersData[dirIndex];

//         // Delete all files in the directory
//         if (dirData.files && Array.isArray(dirData.files)) {
//             for (const fileId of dirData.files) {
//                 const fileIndex = filesData.findIndex((file) => file.id === fileId);
//                 if (fileIndex !== -1) {
//                     const fileData = filesData[fileIndex];
//                     await rm(`./storage/${fileId}${fileData.extinacen}`, { recursive: true });
//                     filesData.splice(fileIndex, 1); // Remove the file from filesData
//                 }
//             }
//         }

//         // Recursively delete subdirectories
//         if (dirData.directories && Array.isArray(dirData.directories)) {
//             for (const dirId of dirData.directories) {
//                 const subDirIndex = foldersData.findIndex((dir) => dir.id === dirId);
//                 if (subDirIndex !== -1) {
//                     // Recursively delete the subdirectory
//                     await router.delete(`/${dirId}`, { params: { id: dirId } }, res);
//                 }
//             }
//         }

//         // Remove the directory from its parent's directories list
//         if (dirData.parentDirId) {
//             const parentDir = foldersData.find((folder) => folder.id === dirData.parentDirId);
//             if (parentDir) {
//                 parentDir.directories = parentDir.directories.filter((dirId) => dirId !== id);
//             }
//         }

//         // Remove the directory itself
//         foldersData.splice(dirIndex, 1);

//         // Update the JSON files
//         await writeFile('./foldersDb.json', JSON.stringify(foldersData));
//         await writeFile('./filesDb.json', JSON.stringify(filesData));

//         res.json({ message: 'Directory deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error occurred while deleting directory', err: error.message });
//     }
// });

export default router;

