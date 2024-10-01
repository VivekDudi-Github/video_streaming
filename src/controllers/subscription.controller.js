import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Subscription} from "../models/subscriptions.model.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    console.log("started")
    const {channelId} = req.params
    // TODO: toggle subscription

    //check for channel params 
    //check for channel id and userId 
    //check for channel already subscribed or not 
    //create a new doc with both sub and subriber

    
    if( !channelId.trim()){
        throw new ApiError(400 , "bad request : please provide a channel id")
    }
    const userId = req.user?._id
    const channel = await User.findById(channelId).select(" -password -refreshToken -watcHistory")
    if (!channel) {
        throw new ApiError(400 , "channel not found")
    }

   
    const doc = await Subscription.findOne( {$and : [{channel : channelId} , {subscriber : userId}]})    
    
    if(doc){
        await Subscription.deleteOne({doc_id} , (err , result)=> {
            if (err){
                throw new ApiError( 500 , "failed to unsubscribe")
            }else if (result.deletedCount == 1 )
               return res.status(200).json(
                new ApiResponse(200 , "unsubscribed")
               )
        })     
    }else {
        let newDoc = await Subscription.create({
            channel : channelId , 
            subscriber : userId
        })
        if(newDoc){
            return res.status(201).json(
                new ApiResponse(
                    201 , "Subscribed successfully"
                )
            )
        }
    }

    return res.status(200).json(req.user)
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}