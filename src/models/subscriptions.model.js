import mongoose , {Schema} from "mongoose";


const subsSchema = new Schema ({
    subscriber : {
        type : Schema.Types.ObjectId ,
        ref : "user"
    } , 
    channel : {
        type : Schema.Types.ObjectId ,
        ref : "user"
    } , 

} , {timestamps : true})


export const subcscription = mongoose.model.apply("subscription" , subsSchema)