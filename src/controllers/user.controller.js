import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiRes.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


const options = {
    httpOnly : true , 
    secure : true , 
}


//signUP func
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
    console.log(req.files );
    

    if( req?.files && Array.isArray(req.files.avatar) && req?.files?.avatar?.length > 0 ){
        avatar_localpath = req.files.avatar[0].path ; 
        
    }else{
        throw new ApiError(400 , "Avatar not found please check your files")
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


//generate tokens
const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        
        const accessToken = user.generateAccessToken()
        
        const refreshToken = user.generateRefreshToken()  
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
  

        return {accessToken , refreshToken}

        } catch (error) {
        throw new ApiError(500 , "Something went wrong while gernerating the tokens");
        
    }
}



//login fun
const loginUser = asyncHandler( async(req, res) => {

//get email/username and password and validate them 
    

   const {email , username , password} = req.body
     if(!(username || email)){ 
        throw new ApiError(400 , "atleast username or email is required")
    }


    const user = await User.findOne({
        $or:[{username} ,{email} ] 
    }).select(" -refreshToken")


    if (!user) {
        throw new ApiError(404 , "user does not exists "); 
    }


    const IsPassValid = await user.isPasswordCorrect(password)
    
    if(!IsPassValid){
        
        throw new ApiError(401 , "Password was incorrect"); 
    }


    const {accessToken , refreshToken} = await  generateAccessAndRefreshToken(user._id)

    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(200 ,
            {
                user : user , accessToken , refreshToken 
            } , 
            "User logged In Succesfully"
         )
    )
})

//logout
const logOutUser = asyncHandler(async ( req , res) => {
    
    await User.findByIdAndUpdate(
        req.user._id ,{
           $unset : {refreshToken : 1 } , 
              } , 
        {
            new : true
        }
    )

    const options = {
        httpOnly : true , 
        secure : true , 
    }

    return res 
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(
       new ApiResponse(
        200 , {}  ,"user logged out successfully"
       ) 
    )


    
})

//getting the user
const getCurrentUser = asyncHandler(async (req , res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , req.user , "uesr fetched Succefully"
        )
    )
})

//update tokens
const refreshAccessToken = asyncHandler(async (req , res) => {
    const incomingrRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingrRefreshToken){
        throw new ApiError(401 , "Unauthorized Request");
    }
try {
    
        const decodedToken = jwt.verify(
            incomingrRefreshToken  , 
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401 , "invalid refresh token");
        }
    
        if (user?.refreshToken !== incomingrRefreshToken) {
            throw new ApiError(401 , "Refresh token is expired or used")
        }
    
        const {refreshToken , accessToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("access token" , accessToken , options)
        .cookie("refresh token", refreshToken , options)
        .json(
            new ApiResponse(
                200 , {accessToken , refreshAccessToken } , 
                "Access Token Refreshed"
            )
        )
} catch (error) {
    throw new ApiError(400 , error?.message || " Invalid Refresh Token");

}
})

//change the password
const changeUserPassword = asyncHandler(async (req , res) => {
    const {oldPassword , newPassword} = req.body

    if(oldPassword === newPassword){
        throw new ApiError(400 , "This password is already active");
    }

    const user = await User.findById(req.user._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) {
        throw new ApiError(400 , "Password is invalid")
    }

    user.password = newPassword

    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , "Password changed successfully"
        )
    )
})

//edit other details of user account
const updateAccountDetails = asyncHandler(async (req , res) => {
    const {fullname , email } = req.body

    if( !fullname || !email ){
        throw ApiError(400 , "please provide credentials to change")
    }

    await User.findByIdAndUpdate(
        req.user?._id , 
        {
            $set: {
                fullname , 
                email  ,
            }
        } ,
        {new : true} 

   ).select("-password") 

   return   res
   .status(201)
   .json(
    new ApiResponse(
        200 , "Account details created successfully"
    )
   )
})

//update avatar
const updateAvatar = asyncHandler(async ( req , res) => {
    const avatar_localpath = req.file.path ;

    if (!avatar_localpath) {
        throw new ApiError(400 , "avatar localpath is missing ");
    }

    const uploadresponse = await uploadToCloudinary(avatar_localpath)

    if(!uploadresponse.url){
        throw ApiError(500 , " Error while uploading avatar file , can not get url")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id , {
            $set: {
                avatar : uploadresponse.url
            }
        } , 
        {new : true}
    ).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(
            200 , user  , "Avatar Updated Succcessfully"
        )
    )

})

//update coverImage
const updateCoverImage = asyncHandler(async ( req , res) => {
    const coverImage_localpath = req.file.path ;

    if (!coverImage_localpath) {
        throw new ApiError(400 , "coverImage localpath is missing ");
    }

    const uploadresponse = await uploadToCloudinary(coverImage_localpath)

    if(!uploadresponse.url){
        throw ApiError(500 , " Error after uploading coverImage file , can not get url")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id , {
            $set: {
                coverImage : uploadresponse.url
            }
        } , 
        {new : true}
    ).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(
            200 , user  , "coverImage Updated Succcessfully"
        )
    )

})


export { registerUser ,
        loginUser , 
        logOutUser ,
        refreshAccessToken ,
        changeUserPassword , 
        getCurrentUser ,
        updateAvatar , 
        updateCoverImage , 

        }