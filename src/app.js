import express from 'express' ;
import cookieParser from 'cookie-parser';
import cors  from 'cors'

const app = express() ;

app.use(cors({
    origin : process.env.CORS_ORIGIN ,
    credentials : true
}))

app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({extended : true , limit : '100kb'}))

app.use(express.static('public'))
app.use(cookieParser())



// Routes import

import userRouter from './routes/user.routes.js';
import healthCheckRouter from './routes/healthcheck.routes.js';
import subscriptionRouter from './routes/subscription.routes.js'
import videoRouter from './routes/video.routes.js'
import commentRouter from "./routes/comment.routes.js"
import dashBoardRouter from "./routes/dashboard.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import likeRouter from "./routes/like.routes.js"

//
app.use("/api/v1/users" , userRouter)
app.use("/api/v1/healthcheck" , healthCheckRouter)
app.use("/api/v1/subscriptions" , subscriptionRouter)  
app.use("/api/v1/videos" , videoRouter)
app.use('/api/v1/comment' ,  commentRouter)
app.use('/api/v1/dashboard' ,  dashBoardRouter)
app.use('/api/v1/tweet' , tweetRouter)
app.use('/api/v1/like' , likeRouter)


export {app}  