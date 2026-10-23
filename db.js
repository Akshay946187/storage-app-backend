// import { MongoClient } from 'mongodb';

// const uri = "mongodb://localhost:27017/storageApp";
// export const client = new MongoClient(uri);

// export async function connectToDatabase() {
//     try {
//         await client.connect();
        
//         // Verify connection
//         await client.db().admin().ping();
//         console.log('Successfully connected to MongoDB server');
        
//         const db = client.db('storageApp'); // Explicitly specify database
//         return db;
//     } catch (error) {
//         console.error('Connection to MongoDB failed:', error);
//         throw error; // Re-throw to handle in calling code
//     }
// }

// process.on('SIGINT', async () => {
//     try {
//         await client.close();
//         console.log('MongoDB connection disconnected');
//         process.exit(0);
//     } catch (error) {
//         console.error('Error closing connection:', error);
//         process.exit(1);
//     }
// });

