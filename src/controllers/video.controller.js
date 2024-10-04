import mongoose, {isValidObjectId} from "mongoose"
import {Videos} from "../models/videos.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadToCloudinary} from "../utils/cloudinary.js"
// import {ffmpeg} from "fluent-ffmpeg"
const ffmpeg = require('fluent-ffmpeg');

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})


const publishAVideo = asyncHandler(async (req, res) => {
    
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    
    const { videoFile , thumbnailFile } = req.files
    
    
    if (!title || !description || !videoFile || !thumbnailFile ){
        throw new ApiError(400 , "All feilds are required , please recheck the following feilds : title , description , thumbnailFile , videoFile");
    }
    const thumbnail_localpath = thumbnailFile[0].path
    const video_localpath = videoFile[0].path
    
    if(!video_localpath){
        throw new ApiError(400 , "thumbnailFile file is missing , please try again");
    }
    if(!thumbnail_localpath){
        throw new ApiError(400 , "video file is missing , please try again");
    }
    
    const video = await uploadToCloudinary(video_localpath)
    const thumbnail = await uploadToCloudinary(thumbnail_localpath)
    
    await Videos.create({
        description : description , 
        title : title , 
        video : video.url , 
        thumbnail : thumbnail.url ,
        owner : req.user._id ,
        duration : ""
    })
    
    ffmpeg.setFfprobePath(video_localpath)


    const videoRef = Videos.findOne({video : video.url})

    return res.status(200).json(
        new ApiResponse(200 , videoRef , "videofile files uploaded successfully")
    )

})



const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnailFile

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
