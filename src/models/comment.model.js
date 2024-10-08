import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const comment_schema = new mongoose.Schema(
    {
        context : { 
            type : String  , 
            required : true 
        } , 
        video : {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "vidoes" , 
            required : true , 
        } ,
        owner : {
            type : mongoose.Schema.Types.ObjectId , 
            ref : "user"
        } , 
    }
    , 
    {timestamps : true }
)

comment_schema.plugin(mongooseAggregatePaginate)


export const Comment = mongoose.model("comment" , comment_schema)