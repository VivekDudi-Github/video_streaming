import {v2 as cloudinary} from 'cloudinary' ;
import fs from 'fs' ;

//how does unlinking deletes in file system 

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

export { uploadToCloudinary }

