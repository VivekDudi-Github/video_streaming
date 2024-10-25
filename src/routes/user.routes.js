import {Router} from 'express'
import { loginUser,   
        logOutUser,   
        refreshAccessToken,   
        registerUser  ,   
        getWatchHistory,   
        changeUserPassword,  
        updateAccountDetails,   
        getCurrentUser,    
        updateAvatar,   
        updateCoverImage,    
        getUserChannelProfile
            } from '../controllers/user.controller.js'

import { upload } from '../middlewares/multer.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
        {
         name : "avatar" ,
         maxCount : 1   
        } , 
        {
         name : "coverImage"  ,
         maxCount : 1
        }
    ]) ,    
    registerUser
)

userRouter.route("/login").post( loginUser)

//secure routes
userRouter.route("/logout").post(verifyJWT  , logOutUser)
userRouter.route("/refreshToken").post(refreshAccessToken)
userRouter.route("/change-password").post(verifyJWT  , changeUserPassword)
userRouter.route("/get_watch_history").get(verifyJWT  , getWatchHistory )
userRouter.route("/current-user").post(verifyJWT  , getCurrentUser)
userRouter.route("/update-account").patch(verifyJWT  , updateAccountDetails)

userRouter.route("/update-avatar").patch(verifyJWT , upload.single("avatar") , updateAvatar)
userRouter.route("/update-cover-image").patch(verifyJWT , upload.single("coverImage") , updateCoverImage)

userRouter.route("/c/:username").get(verifyJWT , getUserChannelProfile) 
userRouter.route("/history").get(verifyJWT , getWatchHistory)

export default userRouter 