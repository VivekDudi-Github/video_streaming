import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Videos } from "../models/videos.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params ;
    const userId = req.user?._id ;

    if(!videoId){
        throw new ApiError(400 , "videoId wasn't provided ");
    }
    if(!userId){
        throw new ApiError(400 , "userId wasn't provided ");
    }

    const response = await Videos.exists({ _id : videoId})
    if(!response){
        throw new ApiError(400 ,"videoId Id is incorrect")
    }

    const likeResponse = await Like.findOne({video : videoId , likedBy : userId})

    if(!likeResponse){
        const likeDoc  = await Like.create({
            video : videoId , 
            likedBy : userId  
        })
    
        if (!likeDoc) {
            throw new ApiError(500 , "there was an error while creating like doc");
        }
    
        return res.status(200).json(
            new ApiResponse(200 , likeDoc , "Liked successfully")
        )
    }else{
        const unlikeDoc = await Like.deleteOne({ _id : likeResponse?._id})
            console.log(unlikeDoc);
            
        if(unlikeDoc.deletedCount === 1){
            return res.status(200).json(
                new ApiResponse(200 , "Unliked")
            )   
        }else{
            throw new ApiError(500 , "error while deleting");
        }
    }
})


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user?._id ;

    if(!commentId){
        throw new ApiError(400 , "commentId wasn't provided ");
    }
    if(!userId){
        throw new ApiError(400 , "userId wasn't provided ");
    }

    const response = await Comment.exists({ _id : commentId})
    if(!response){
        throw new ApiError(400 ,"commentId is incorrect")
    }


    const findResponse = await Like.findOne({comment : commentId , likedBy : userId})

    if(!findResponse){
        const Doc  = await Like.create({
            comment : commentId , 
            likedBy : userId  
        })
    
        if (!Doc) {
            throw new ApiError(500 , "there was an error while creating like doc");
        }
    
        return res.status(200).json(
            new ApiResponse(200 , Doc , "Liked successfully")
        )
    }else{
        const unlikeDoc = await Like.deleteOne({ _id : findResponse?._id})
            console.log(unlikeDoc);
            
        if(unlikeDoc.deletedCount === 1){
            return res.status(200).json(
                new ApiResponse(200 , "Unliked")
            )   
        }else{
            throw new ApiError(500 , "error while deleting");
        }
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params ;
    const userId = req.user?._id ;

    if(!tweetId){
        throw new ApiError(400 , "commentId wasn't provided ");
    }
    if(!userId){
        throw new ApiError(400 , "userId wasn't provided ");
    }

    const response = await Tweet.exists({ _id : tweetId})
    if(!response){
        throw new ApiError(400 ,"commentId is incorrect")
    }


    const findResponse = await Like.findOne({tweet : tweetId , likedBy : userId})

    if(!findResponse){
        const Doc  = await Like.create({
            tweet : tweetId , 
            likedBy : userId  
        })
    
        if (!Doc) {
            throw new ApiError(500 , "there was an error while creating like doc");
        }
    
        return res.status(200).json(
            new ApiResponse(200 , Doc , "Liked successfully")
        )
    }else{
        const unlikeDoc = await Like.deleteOne({ _id : findResponse?._id})
            console.log(unlikeDoc);
            
        if(unlikeDoc.deletedCount === 1){
            return res.status(200).json(
                new ApiResponse(200 , "Unliked")
            )   
        }else{
            throw new ApiError(500 , "error while deleting");
        }
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(400 , "UserId wasn't found")
    }

    const videoFiles = await Like.find(
        {likedBy : userId ,
         video : { $exists : true}}
        )
    
    if(!videoFiles.length > 0){
        throw new ApiError(500 ,"No liked videos found" );
        
    }

    return res.status(200).json(
        new ApiResponse(200 , videoFiles , "videos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} 
