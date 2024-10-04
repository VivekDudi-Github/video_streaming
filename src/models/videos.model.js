import {mongoose , Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema  = new Schema({  
    videofile : { 
        type : String , 
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
        type : Boolean ,
        required : true , 
        default : true ,
    } , 
    owner : {
        type : Schema.Types.ObjectId , 
        ref : 'user'
    }
    } , {timestamps : true }
)

videoSchema.plugin(mongooseAggregatePaginate)


export const Videos = mongoose.model('videos' , videoSchema)