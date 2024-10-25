import mongoose from "mongoose"
import {Videos} from "../models/videos.model.js"
import {Subscription} from "../models/subscriptions.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
     // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    
    const {userId} = req.params ;
    const fullname  = 'five'

    const user = await User.aggregate([

            {
                $match : {
                _id : new mongoose.Types.ObjectId(userId)
            }
        } ,
    //like
                {
                    $lookup : {
                    from : "videos" , 
                    localField :"_id" , 
                    foreignField :  "owner",
                    as : "allVideos" ,         
                }
            },
            {
                $addFields : {
                    videoIds : {
                        $map : {
                            input : "$allVideos" , 
                            as : "video" , 
                            in : "$$video._id"
                        }
                    }
                }
            } ,
                {
                    $lookup : {
                    from : "likes" , 
                    foreignField : "video"  , 
                    localField : "videoIds" , 
                    as : "likedVideo" , 
                }
            }  , 
                {
                    $addFields : {
                    totalVideos : {
                        $size : "$allVideos"
                    } , 
                    totalLikedVideos : {
                        $size : "$likedVideo"
                    }
                }
            } , 
                {
                    $project : {
                    fullName: 1,
                    username: 1,
                    totalVideos : 1 ,
                    totalLikedVideos : 1 , 
                }
            }
        
    ]) 
    console.log(user);

    return res.status(200).json(
        new ApiResponse(200 , user , "fecthed successfully")
    )
    

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {userId} = req.params
    const {page , pagesize} = req.body
    
    if (!userId ) {
        throw new ApiError(400 , "userid is missing")
    }

    if (!page || !pagesize ) {
        throw new ApiError(400 , "required json.params are missing")
    }
    const limit = pagesize ;
    const skip = (page-1) * pagesize 
    

    const videosDocs = await Videos.find({owner : userId} )
                                        .skip(skip)
                                        .limit(limit)
                                        .sort({createdAt : -1})
                                        .select(" createdAt _id title thumbnail videoFile duration ")
    
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