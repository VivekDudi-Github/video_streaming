import {mongoose , Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"


const user_Schema  = new Schema({
    username : {
        type : String , 
        required : true  , 
        unique : true , 
        lowerCase : true ,
        index : true  , //learn about the indexes and trim 
    } , 
    email : {
        type : String , 
        unique : true , 
        index : true  , 
        lowerCase : true , 
        required : true , 
    } , 
    fullname : {
        type : Text , 
        required : true , 
        index : true , 
    } ,
    password : {
        type : String , 
        unique : true , 
        required : [true , 'Password is required'] ,

    } , 
    avatar : {
        type : String , 
        unique : true , 
        required : true ,
    } , 
    coverImage : {
        type : String , 
        unique : true , 
        required : true ,
    } , 
    watchHistory : [{
        type : Schema.Types.ObjectId , 
        ref : 'videos'
    }] , 
    refreshToken : {
        type : String , 
    } , 

} , {timestamps : true })


user_Schema.pre('save' , async function (next) {
    if( !this.isModified('password'))
        return next  

    this.password = bcrypt.hash(this.password , 8)
    next()
})

user_Schema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)
}

user_Schema.methods.generateAccessToken = function(){
    return  jwt.sign(
        {
        _id : this.id , 
        email : this.email , 
        username : this.username  ,
        fullname : this.fullname 
    } , 
    process.env.ACESS_TOKEN_SECRET ,
    {
      expiresIn : process.env.ACCESS_TOKEN_EXPIRY  
    }
)
}

user_Schema.methods.generateRefreshToken = function(){
    return  jwt.sign(
        {
        _id : this.id , 
    } , 
    process.env.ACESS_TOKEN_SECRET ,
    {
      expiresIn : process.env.ACCESS_TOKEN_EXPIRY  
    }
)
}


export const user = mongoose.model('user' , user_Schema)