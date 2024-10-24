import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiRes.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Videos } from "../models/videos.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body ;
    const userId =  req?.user._id ;
    console.log(req.body);
    

    if(!name || !description){
        throw new ApiError(400 , "all feilds are required , (name , description)");
    }
    if (!userId) {
        throw new ApiError(400 , "User Id was missing");
    }

    const playlist = await Playlist.create({
        name : name , 
        description : description ,
        owner : userId ,
    })

    if (!playlist) {
        throw new ApiError(500 , "Error while creating the playlist")
    }
    return res.status(200).json(
        new ApiResponse(200 , playlist ,"Playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if (!userId) {
        throw new ApiError(400 , "userId was missing")
    }

    const  playlist = await Playlist.find({owner : userId}) 

    if(playlist.length < 1){
         throw new ApiError(500 , "No playlist were found")
    }

    return res.status(200).json(
        new ApiResponse(200 , playlist  , "playlist fetched successfully")
       )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!playlistId) {
        throw new ApiError(400 , "please provide a playlistId");        
   }

   const playlist = await Playlist.findById(playlistId)
   if(!playlist){
    throw new ApiError(500 , "No playlist were found")
   }

   return res.status(200).json(
    new ApiResponse(200 , playlist  , "playlist fetched successfully")
   )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!playlistId || !videoId) {
        throw new ApiError(400 , "all params are required (playlistId , videoId)");
    }

    const videoRef = await Videos.exists({_id : videoId})
    if(!videoRef){
        throw new ApiError(400 , "provided videoId is wrong")
    }
    const PlaylistRef = await Playlist.exists({_id : playlistId})
    if(!PlaylistRef){
        throw new ApiError(400 , "provided PlaylistId is wrong")
    }
    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId , {
        $addToSet : { video : videoId}
    } , {new : true})

    if(!updatedPlaylist){
        throw new ApiError(500 , "error while adding the video to the playlist")
    }
    console.log(updatedPlaylist);
    
    return res.status(200).json(
        new ApiResponse(200 , updatedPlaylist , "playlist updated !")
    )
})

//
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!playlistId || !videoId) {
        throw new ApiError(400 , "all params are required (playlistId , videoId)");
    }

    const videoRef = await Videos.exists({_id : videoId})
    if(!videoRef){
        throw new ApiError(400 , "provided videoId is wrong")
    }
    const PlaylistRef = await Playlist.exists({_id : playlistId})
    if(!PlaylistRef){
        throw new ApiError(400 , "provided PlaylistId is wrong")
    }

    console.log("line:117")
    console.log(videoId , playlistId);
    
    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId , {
        $pull : { video : videoId }
    } , {new : true} )

    if(!updatedPlaylist){
        throw new ApiError(500 , "error while adding the video to the playlist")
    }
    return res.status(200).json(
        new ApiResponse(200 , updatedPlaylist , "playlist updated !")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if (!playlistId ) {
        throw new ApiError(400 , "all params are required (playlistId )");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId) ; 

    if (!deletedPlaylist) {
        throw new ApiError(500 , "error while deleting the playlist (Id can be wrong)")
    }

    return res.status(200).json(
        new ApiResponse(200 , deletedPlaylist)
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
   
    if (!playlistId ) {
        throw new ApiError(400 , "all params are required (playlistId )");
    }
    if (!name || !description) {
        throw new ApiError(400 , "all body feilds are required (description , name)");
    }

    const IsPlaylistexist = await Playlist.exists({_id : playlistId}) 
    
    if(!IsPlaylistexist){
        throw new ApiError(400 , "No playlist found")
    }
    
    const newPlaylist = await Playlist.findByIdAndUpdate(playlistId , {
        name : name , 
        description : description 
    } , {new : true})

    if(!newPlaylist){
        throw new ApiError(500 , "there was error while updating the playlist")
    }

    return res.status(200).json(
        new ApiResponse(200 , newPlaylist , "Updated Successfully!")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
