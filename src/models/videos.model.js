import {mongoose , Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema  = new Schema({  
    videoFile : { 
        type : String , 
        required : true,
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


export const Videos = mongoose.model('Videos' , videoSchema)