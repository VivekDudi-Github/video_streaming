import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiRes.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler( async(req , res) => {

 const {fullname , username , email , password}=req.body
console.log(req.body);


    if (
        [fullname , email  ,username , password].some( (field) => field?.trim() == "" )
    ) {
        throw new ApiError(400 , "All fields are required");
    }
    const existedUserEmail = await User.findOne({email})
    const existedUserusername = await User.findOne({username})
    
    
 
    if(existedUserEmail){
        throw new ApiError(409 , "User with same email already exists ")
    }
    if(existedUserusername){
        throw new ApiError(409 , "User with same username already exists ")
    }
    console.log('checked users');
    
    let avatar_localpath ;
    // const coverimage_localpath = req.files?.coverImage[0]?.path 
    
    if( req.files && req.files?.avatar?.length > 0 ){
        avatar_localpath = req.files.avatar[0].path
    }else{
        throw new ApiError(400 , "Avatar not found please checkk your files")
    }


    let coverimage_localpath ;
    let coverFileResponse ;

    if( req?.files && req?.files?.coverImage?.length > 0 ){
        coverFileResponse = null
        coverimage_localpath = req.files.coverImage[0].path

    }else{
        coverFileResponse = "coverImage file wasn't uploaded "
        coverimage_localpath = ''
    }
    
    if( !avatar_localpath){
        throw new ApiError(400 , "Please upload your avatar")
    }

    
    const avatar = await uploadToCloudinary(avatar_localpath)
    const coverImage = await uploadToCloudinary(coverimage_localpath)
 
    if ( !avatar) {
        throw new ApiError(400 , "Please upload your avatar")
   }
    console.log("uploaded");
    
    const user = await User.create({
        fullname , 
        password ,
        avatar : avatar.url  ,
        coverImage : coverImage?.url || '' , 
        email , 
        username : username.toLowerCase() , 
    })
    
     
    const userRef = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if( !userRef ){
        throw new ApiError(500 , "Something went while registring a user ");
        
    }
    

    return res.status(201).json(
        new ApiResponse(200 , userRef , 
            ("operation completed succesfully " + coverFileResponse)
         )
    )

})
//create and add validation for email 



export { registerUser}