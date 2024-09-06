const ayncHandler = async(fn) => {
    (req , res , next) => {
        Promise.resolve(fn(req , res, next))
        .catch((error) => next(error))
    }
}


export {ayncHandler}


// const ayncHandler = (fn) => async(req , res , next) => {
//     try {
//         await fn(req , res , next)
//     } catch (error) {
//        res.status(err.code || 400).json({
//         success : false , 
//         message : err.message ,
//        })
//     }
// }

