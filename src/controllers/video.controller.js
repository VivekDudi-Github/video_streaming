import mongoose, {isValidObjectId} from "mongoose"
import {Videos} from "../models/videos.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadToCloudinary , deleteOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    
    console.log(page , limit , query , sortBy , sortType , userId );
    
    await Videos.find()

})


const publishAVideo = asyncHandler(async (req, res) => {
    
    
    const { title, description} = req.body
    const {thumbnail , videoFile} = req.files 
    
    // TODO: get video, upload to cloudinary, create video


    if (!( title && thumbnail  &&  videoFile )) {
        throw new ApiError(400 , "Please provide the proper data , please check your title  ,thumbnail or videoFile")
    }
    const thumbnail_localpath = thumbnail[0].path
    const videofile_localpath = videoFile[0].path

    if(!(videofile_localpath && thumbnail_localpath)){
        throw new ApiError(500 , "problem in getting the right path , Please try again" )
    }

    const thumbnailUPLOADED = await uploadToCloudinary(thumbnail_localpath)
    const videoUPLOADED = await uploadToCloudinary(videofile_localpath)
    
    
    const userId = req.user?._id

    const video = await Videos.create({
        videoFile : videoUPLOADED.url , 
        thumbnail : thumbnailUPLOADED.url , 
        title : title , 
        description : description || "", 
        duration : 0 , 
        isPublished : true , 
        owner : userId 
    })

    const videoRef = await Videos.findById(video._id)

    return res.status(200).json(
        new ApiResponse(200 , videoRef , "video uploaded successfully")
    )
    
    
})



const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params 

    const videoRef = await Videos.findById(videoId)
    
    if(!videoRef){
        throw new ApiError(404 , "The video is no longer available")
    }
    
    return res.status(200).json(
        new ApiResponse(200 , videoRef, "All ok")
)
})



const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail , isPublished ,  
    const { title, description, thumbnail } = req.body
    
    console.log(videoId);
    
    if( !(title ||  description || thumbnail )){
        throw new ApiError(400 , "please provide atleast one feild of data to update")
    }

    const doc = await Videos.findByIdAndUpdate({_id : videoId} , 
        {description , title , thumbnail } , 
        { new : true }
    )
    if(!doc){
        throw new ApiError(500 , "Error while updating the feilds")
    }

    return res.status(200).json(
        new ApiResponse(200 , doc )
    )
})



const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!videoId){
        throw new ApiError(400 , "VideoId is missing from params");
    }
    const videoRef = await Videos.findById(videoId)

    if(!videoRef){
        throw new ApiError(400 , "couldn't find any doc with the videoId ")
    }

    const public_id = videoRef.videoFile.split("/").pop().split(".").shift()
    
    const response = await deleteOnCloudinary(public_id.trim() , "image")


    if(response.result === "ok"){
        try {
           await Videos.deleteOne({_id : videoId})
        } catch (error) {
            throw new ApiError (500 , "something went wrong while deleting the doc" ,error )
        }

        return res.status(200).json(
            new ApiResponse(200 , "File successfully deleted")
        )

    }else{
        throw new ApiError(400 , response?.result || "something went wrong while deleting")
    }
    
})



const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const videoRef = await Videos.findOne({_id : videoId})
    try {
        if(!videoRef.isPublished){
            const newVideoRef = await Videos.findByIdAndUpdate(
                {_id : videoId} , 
                {isPublished  : true} , 
                {new : true}
            )
            return res.status(200).json(
                new ApiResponse(200 , newVideoRef , "Successfully Updated" )
            )
        }else{
            const newVideoRef = await Videos.findByIdAndUpdate(
                {_id : videoId} , 
                {isPublished  : false} , 
                {new : true}
            )
            return res.status(200).json(
                new ApiResponse(200 , newVideoRef , "Successfully Updated" )
            )
        }
    } catch (error) {
        throw new ApiError(500 , "error while changing the Publish status" , error );
    }

})  

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
}
