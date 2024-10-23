import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10 , sortBy = 'desc'} = req.query

    const skip = (page- 1) * limit
    const sort = sortBy == "desc" ? -1  : 1
    console.log(sort);
    
    if(!videoId){
        throw new ApiError(400 , "videoId missing")
    }
    
    const comments = await Comment.find({video : videoId})
    .limit(limit)
    .skip(skip)
    .sort({ createdAt : sort })
    console.log(comments);
    

    if(!comments.length > 0){
        throw new ApiError(500 , "no comments found")
    }
    return res.status(200).json(
        new ApiResponse(200 , comments , "comments fetched successfully")
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {context} = req.body
    const {videoId} = req.params

    const userId = req.user 

    if( !context || !videoId ){
        throw new ApiError(400 , "context and videoId is missing")
    }
    if (context.length > 200) {
        throw new Error(400 , "context length is higher than limit");
    }
    

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
    const { context } = req.body
    const {commentId} = req.params

    if(!commentId || !context){
        throw new ApiError(400 , " context is missing");
    }
    console.log(context);
    
    if(context.length > 200 ){
        throw new ApiError(400 , "context length is longer thaan the limit");
    }

    const comment = await Comment.findOneAndUpdate( {_id : commentId }, {context : context} , {new : true})
    
    if (!comment) {
        throw new ApiError(500 , `Error while updating the comment `);  
    }
    
    return res.status(200).json(
        new ApiResponse(200 , comment , "comment created")
    )
    

})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!commentId ){
        throw new ApiError(400 , "comment id is missing");
    }

    try {
        const doc = await Comment.findByIdAndDelete(commentId)
        if(!doc){
            throw new ApiError(400 , "comment id is not correct");
        }
        
        return res.status(200).json(
            new ApiResponse(200 ,doc , "deleted comment")
        )

    } catch (error) {
        throw new ApiError(500 , error || "error in deleting");
    }

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
