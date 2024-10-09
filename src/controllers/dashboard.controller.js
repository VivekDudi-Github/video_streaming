import mongoose from "mongoose"
import {Videos} from "../models/videos.model.js"
import {Subscription} from "../models/subscriptions.model.js"
// import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Comment } from "../models/comment.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {userId} = req.user?._id
    const {page , pagesize , sort} = req.body
    
    if (!userId ) {
        throw new ApiError(400 , "userid is missing")
    }

    if (!skip || !limit || !sort) {
        throw new ApiError(400 , "required json.params are missing")
    }
    const limit = pagesize ;
    const skip = page-1 * pagesize ;

    const videosDocs = await Videos.find({owner : userId})
                                        .skip(skip)
                                        .limit(limit)
                                        .sort(sort)
    
    if (!videosDocs) {
        throw new ApiError(500 , "now videos were found");
    }

    return res.status(200).json(
        new ApiResponse(200 , videosDocs , "Videos fetched successfully")
    )

})

export {
    getChannelStats, 
    getChannelVideos
    }