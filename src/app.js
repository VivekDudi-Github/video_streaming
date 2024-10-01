import express from 'express' ;
import cookieParser from 'cookie-parser';
import cors  from 'cors'

const app = express() ;

app.use(cors({
    origin : process.env.CORS_ORIGIN ,
    credentials : true
}))

app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({extended : true , limit : '32kb'}))

app.use(express.static('public'))
app.use(cookieParser())



// Routes import

import userRouter from './routes/user.routes.js';
import healthCheckRouter from './routes/healthcheck.routes.js';
import subscriptionRouter from './routes/subscription.routes.js'

//
app.use("/api/v1/users" , userRouter)
app.use("/api/v1/" , healthCheckRouter)
app.use("/api/v1/" , subscriptionRouter)  


export {app}  