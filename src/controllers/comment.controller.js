import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {context} = req.body
    const {videoId} = req.params

    const userId = req.user 

    if( !context || !videoId ){
        throw new ApiError(400 , "context and videoId is missing")
    }
    console.log(context , videoId);
    
    
    try {
        const doc = await Comment.create({
            video : videoId , 
            context : context ,
            owner :  userId        
        })
    
        const comment = await Comment.findById(doc._id).select("--owner")
        console.log(comment)
        
        return res.status(201).json(
            new ApiResponse(201 ,comment , "comment added" )
        )
    } catch (error) {
        throw new ApiError(500 , "error while doing the cooment" , error);
    }

    

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
