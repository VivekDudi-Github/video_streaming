import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body ;
    const user_id = req.user?._id
    if (!content || !user_id) {
        throw new ApiError(400 , "please provide the content");
    }
    const tweet = await Tweet.create({
        owner : user_id ,
        content : content , 
        })

    if(!tweet){
        throw new ApiError(500 , "error while posting the tweet");
    }

    res.status(201).json(
        new ApiResponse(201 , tweet , "successfullly tweet posted")
    )
    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId}  = req.params ;
    const {pageLimit  , page } = req.body


    if ( !pageLimit || !page) {
        throw new ApiError(400 , "check for json file , required content missing");
    }
    if (!userId ) {
        throw new ApiError(400 , "userId missing");
    }

    const limit = pageLimit ;
    const skip = (page - 1) * pageLimit

    const tweets = await Tweet.find({owner : userId})
                    .limit(limit)
                    .skip(skip)
                    .sort({createdAt : -1})
                    .select(" content owner updatedAt ")
        
    if (tweets.length < 1) {
        return res.status(200).json(
            new ApiResponse(200  , "No tweets were found" )
        )
    }
    
    return res.status(200).json(
        new ApiResponse(200 , tweets , "tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params ;
    
    const { content } = req.body ;
    const userId = req.user._id


    if ( !tweetId) {
        throw new ApiError(400 , "check for tweetsId , required params is missing");
    }
    if ( !content) {
        throw new ApiError(400 , "check for json file , required feilds are missing");
    }
    if (!userId ) {
        throw new ApiError(400 , "userId missing");
    }


    const newTweet = await Tweet.findByIdAndUpdate(tweetId , {content : content} , {new : 1} )
    if(!newTweet){
        throw new ApiError(500 ," tweet Didn't found or something went wrong" );
    }
    return res.status(200).json(
        new ApiResponse(200 , newTweet  , "tweet updated ")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {v
    //TODO: delete tweet
    const {tweetId} = req.params ;
    const userId = req.user?._id ;
    
    if (!tweetId) {
        throw new ApiError(400 , "check for tweetsId , required params is missing");
    }
    
    if (!userId ) {
        throw new ApiError(400 , "userId missing");
    }
    
    const tweetRef = await Tweet.findById(tweetId).select(" owner")
    console.log(tweetRef.owner );
    console.log(userId);
    
    
    if(!tweetRef.owner.equals(userId)){
        throw new ApiError(400 , "User id didn't matched to the owner");
    }

    await Tweet.findByIdAndDelete(tweetId)
    
    return res.status(200).json(
        new ApiResponse(200 , "Tweet deleted successfully")
    )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
