import {mongoose , Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const video_Schema  = new Schema({  
    videofile : { 
        type : true , 
        required : [true , 'Please upload a valid file for upload'] ,
    } , 
    thumbnail : {
        type : String  , 
        required : true , 
    } , 
    title : {
        type : String , 
        required  : true 
    } , 
    description : {
        type : String , 
    } , 
    duration : {
        type : Number , 
        required : true 
    } , 
    views : {
        type : Number , 
        default : 0 ,
    } , 
    isPublished : {
        type : boolean ,
        required : true , 
        default : ture ,
    } , 
    owner : {
        type : Schema.Types.ObjectId , 
        ref : 'user'
    }
    } , {timestamps : true }
)

video_Schema.plugin(mongooseAggregatePaginate)


export const videos = mongoose.model('videos' , video_Schema)