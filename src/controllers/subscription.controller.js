import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Subscription} from "../models/subscriptions.model.js"


const toggleSubscription = asyncHandler(async (req, res) => {

    
        const {channelId} = req.body
        console.log(channelId)
        // TODO: toggle subscription
    
        //check for channel params 
        //check for channel id and userId 
        //check for channel already subscribed or not 
        //create a new doc with both sub and subscriber
    
        
        if( !channelId){
            throw new ApiError(400 , "bad request : please provide a channel id")
        }
        const userId = req.user?._id
        const channel = await User.findById(channelId.trim()).select(" -password -refreshToken -watcHistory")
        if (!channel) {
            throw new ApiError(400 , "channel not found")
        }
        console.log("line:32" , channel);
        
       
        const doc = await Subscription.findOne( {$and : [{channel : channelId} , {subscriber : userId}]})    
        
        if(doc){
                console.log(doc);
            
            const delResponse = await Subscription.deleteOne({_id : doc._id})
            if(delResponse.acknowledged == true){
                return res.status(200).json(
                    new ApiResponse(200 , "Unsubscribed successfully")
                )
            }else{
                throw new ApiError(500 , "error while unsubscribing the channel")
            } 
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
    

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

        const {channelId} = req.body
    
        if( !channelId){
            throw new ApiError(400 , "bad request : please provide a channel id")
        }
        const SubsCount = await Subscription.countDocuments({channel : channelId}) 
        console.log(SubsCount)
        if( SubsCount || SubsCount === 0 ){
            return res.status(200).json(
                new ApiResponse(200 , SubsCount , "subCounts fetched successfully")
            )
        }else  {
            throw new ApiError(500 ,"subs not found" );
        }

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.body

    if(!subscriberId){
        throw new ApiError(400 , "please provide a subscriberId");
    }
    const subscriptionCount = await Subscription.countDocuments({subscriber : subscriberId})

    if(subscriptionCount ||  subscriptionCount === 0){
        return res.status(200).json(
            new ApiResponse(200 ,subscriptionCount , "subscriptions count fetched successfully")
        )
    }else{
        throw new ApiError(500 , "Error occured while fetching the subs count");
    }
    
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}