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
    const {userId} = req.params
    const {page , pagesize , sort} = req.body
    
    if (!userId ) {
        throw new ApiError(400 , "userid is missing")
    }

    if (!page || !pagesize || !sort) {
        throw new ApiError(400 , "required json.params are missing")
    }
    const limit = pagesize ;
    const skip = page-1 * pagesize ;

    //sort : Sets the sort order. If an object is passed, values allowed are asc, desc, ascending, descending, 1, and -1.
    const videosDocs = await Videos.find({owner : userId})
                                        .skip(skip)
                                        .limit(limit)
                                        .sort(sort)
    
    if (videosDocs.length < 1) {
        throw new ApiError(500 , "no videos were found");
    }

    return res.status(200).json(
        new ApiResponse(200 , videosDocs , "Videos fetched successfully")
    )

})

export {
    getChannelStats, 
    getChannelVideos
    }