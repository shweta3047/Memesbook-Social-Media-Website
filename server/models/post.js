const mongoose=require('mongoose');
const {ObjectID}=mongoose.Schema.Types

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true   
    },
    likes:[{
        type:ObjectID,
        ref:"User"
    }],
    comments:[{
        text:String,
        postedBy:{
            type:ObjectID,
            ref:"User"
        }
    }],
    image:{
        type:String,
        required:true
    },
    postedBy:{
        type:ObjectID,
        ref:"User"
    }
},{timestamps:true})

mongoose.model("Post",postSchema)