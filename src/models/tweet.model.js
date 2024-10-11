import mongoose , {Schema} from "mongoose"; 

const tweet_schema = new Schema ({
    content : {
        type : String , 
        required : true ,
    } , 
    owner : {
        type : Schema.Types.ObjectId , 
        ref : "user"
    }
} , {timestamps : true })

export const Tweet = mongoose.model("tweet" , tweet_schema)