const mongoose=require('mongoose');
const {ObjectID}=mongoose.Schema.Types


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    followers:[{type:ObjectID,ref:"User"}],
    following:[{type:ObjectID,ref:"User"}],
    dp:{
        type:String,
        default:"https://i.pinimg.com/originals/ac/a3/27/aca3270e1bfcb034363463172320f63c.png"
    },
    about:{
        type:String,
        default:""
    },
    fullName:{
        type:String,
        default:""
    }
},{timestamps:true})

mongoose.model("User",userSchema);