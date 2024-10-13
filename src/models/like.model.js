import mongoose , {Schema} from "mongoose";

const like_schmea = new  Schema(
    {
        video : {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "video"
        } , 
        comment : {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "comment"
        } , 
        tweet : {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "tweet"
        } , 
        likedBy : {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "user"
        }  
    } , 
    {timestamps : true }
) 

export const Like = mongoose.model("like" , like_schmea)