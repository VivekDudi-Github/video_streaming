import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const playlist_schema = new Schema ({
    name : {
        type : String , 
        required : true , 
    } , 
    description : {
        type : String ,
        required : true , 
    } , 
    video : [{
        type : Schema.Types.ObjectId  ,
        ref : "video" ,   
    }] , 
    owner : {
        type : Schema.Types.ObjectId , 
        ref : "user" , 
        requied : true 
    } , 


} , {timestamps : true})

playlist_schema.plugin(mongooseAggregatePaginate)

export const Playlist = mongoose.model("playlist" , playlist_schema)