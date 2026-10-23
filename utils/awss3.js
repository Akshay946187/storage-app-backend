import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

export const s3Client = new S3Client({   region: process.env.AWS_REGION || "ap-south-1",})


export const createUploadSignedUrl = async ({ key,contentType})=>{

    const command = new PutObjectCommand({
        Bucket : "storageapp-bucket",
        Key:key,
        ContentType : contentType

    })
    //get url
    const url = await getSignedUrl(s3Client,command,{
        expiresIn:3600,
        signableHeaders : new Set(["content-type"])
    })
    return url
}
export const createGetSignedUrl = async ({ key,download = false,fileName})=>{

    const command = new GetObjectCommand({
        Bucket : "storageapp-bucket",
        Key:key,
        ResponseContentDisposition : `${download ? "attachment" :"inline"};filename=${fileName}`

    })
    //get url
    const url = await getSignedUrl(s3Client,command,{
        expiresIn:3600,
        
    })
    return url
}
export const DeleteSignedUrl = async ( key)=>{

    const command = new DeleteObjectCommand({
        Bucket : "storageapp-bucket",
        Key:key,
        

    })
    //get url
    s3Client.send(command)
    
}