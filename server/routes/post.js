const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const Post=mongoose.model('Post');

router.get('/subscribedPost',requireLogin,(req,res)=>{
    Post.find({$or:[{postedBy:req.user._id},{postedBy:{$in:req.user.following}}]}).populate("postedBy","_id name dp").populate("comments.postedBy","_id name dp").populate("likes")
    .sort('-createdAt')
    .then(post=>{
        res.json({post})
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/allPost',requireLogin,(req,res)=>{
    Post.find().populate("postedBy","_id name dp").populate("comments.postedBy","_id name dp").populate("likes")
    .sort('-createdAt')
    .then(post=>{
        res.json({post})
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/myPost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id}).populate("postedBy","_id name dp")
    .sort('-createdAt')
    .then(myPost=>{
        res.json({myPost})
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/createPost',requireLogin,(req,res)=>{
    const{title,body,image}=req.body;
    if(!title || !body ||!image ){
       return res.status(422).json({error:" Please Fill all fields!!"})
    }
    const post= new Post({
        title,body,image,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    }).catch(err=>{
        console.log(err);
    })

})

router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{$push:{likes:req.user._id}},{new:true}).populate("postedBy","_id name dp")
    .populate("comments.postedBy","_id name dp")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{$pull:{likes:req.user._id}},{new:true}).populate("postedBy","_id name dp")
    .populate("comments.postedBy","_id name dp")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})

router.put("/comments",requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{$push:{comments:comment}},{new:true})
    .populate("comments.postedBy","_id name dp").populate("postedBy","_id name dp")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})

router.delete("/deletePost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id ")
    .exec((err,post)=>{
        if(err || !post){
            res.status(422).json({error:err})
        }
        else if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

router.delete("/deleteComment/:postId/:commentId",requireLogin,(req,res)=>{

    Post.findByIdAndUpdate(req.params.postId,{$pull:{comments:{_id:req.params.commentId}}},{new:true})
    .populate("postedBy","_id name dp")
    .populate("comments.postedBy","_id name")
    .exec((err,post)=>{
        if(err || !post){
            res.status(422).json({error:err})
        }
        else{
            res.json(post)
        }
    })
})

module.exports=router;