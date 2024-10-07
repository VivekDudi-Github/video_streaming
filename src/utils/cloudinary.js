import {v2 as cloudinary} from 'cloudinary' ;
import fs from 'fs' ;
import { ApiError } from './apiErrors.js';
 

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        if(! localFilePath) return null 

        //uploading file on cloudinary
        //learn more about upload options on coudinary 
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type : 'auto'
        })
            console.log('file successfully uploaded to cloudinary' , response.url )
            fs.unlinkSync(localFilePath)
            return response ;

  
    } catch (error) {
        fs.unlinkSync(localFilePath) ; 
        return null ;
    }
}

const deleteOnCloudinary = async(public_id , type) => {
   try {
     if(!public_id) {
        console.log(public_id , "public not found")
        return null }
 
    const res = await cloudinary.uploader.destroy(public_id , {resource_type: type})
    .then((result)=> {
        if(result){
            console.log("line:41" , result);
            return result
        }
    })
    return res 

   } catch (error) {
    console.log("error while deleting the file" , error)
   }
}

export { uploadToCloudinary , deleteOnCloudinary }

