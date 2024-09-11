import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler( async(req , res) => {


//if else to validate wheter data is correct 
//check if the user is already register 
//if correct : do try upload the data and provide a response 
// // if catch provide a response regarding the issue :  primiarly internal error 

//if incorrect : do send a response regarding the data isn't right 


 const {fullname , username , email , password}=req.body
    console.log(email , password)

    if (
        [fullname , email  ,username , password].some( (field) => field?.trim() == "" )
    ) {
        throw new ApiError(400 , "All fields are required");
    }
    
    const existedUserEmail = User.findOne(email)
    const existedUserusername = User.findOne(username)
    

    if(existedUserEmail){
        throw new ApiError(409 , "User with same email already exists already exists")
    }
    if(existedUserusername){
        throw new ApiError(409 , "User with same username already exists already exists")
    }


    const avtar_localpath = req.files?.avatar[0]?.path
    const coveeerimage_localpath = req.files?.coverImage[0]?.path

    if( !avtar_localpath){
        throw new ApiError(400 , "Please upload your avatar")
    }
    




})
//create and add validation for email 



export { registerUser}