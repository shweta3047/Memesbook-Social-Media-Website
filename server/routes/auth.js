const express=require('express');
const router=express.Router();
const mongoose=require("mongoose");
const User=mongoose.model("User");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require("../keys");
const {MAIL_SECRET}=require("../keys");
const requireLogin=require('../middleware/requireLogin');
const nodemailer=require("nodemailer");
const sendgridTransport=require("nodemailer-sendgrid-transport");
const crypto=require('crypto');

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:MAIL_SECRET
    }
}))

router.post('/signup',(req,res)=>{
    const{name,email,password}=req.body;
    if(!name || !email || !password){
        return res.status(422).json({error: " please add all fields"});
    }
    else{
        User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser)
        {
            return res.status(422).json({error: " user already exists!"});
        }
        bcrypt.hash(password,8)
        .then(hashedPass=>{
            const user= new User({
                name,email,
                password:hashedPass
            })
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"shwetachaurasia12@gmail.com",
                    subject:"no-reply...Signup success",
                    html:"<h3>Welcome to Memesbook</h3><h5>Have fun ,share your memes and enjoy others memes...</h5>"
                })
                res.json({message:"saved user details successfully!!"});
            })
            .catch(err=>{
                console.log(err)
            })   
        })
        .catch(err=>{
            console.log(err)
        })

        })
        
    } 
})


router.post('/login',(req,res)=>{
    const{email,password}=req.body;
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error: "Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(passMatch=>{
            if(!passMatch){
                return res.status(422).json({error: "Invalid email or password"})
            }
            else{
               const token= jwt.sign({_id:savedUser._id},JWT_SECRET);
               const {_id,name,email,followers,following,about,dp,fullName}=savedUser;
               res.json({token,user:{_id,name,email,followers,following,about,dp,fullName},message:"succesfully signed in!!"})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/forgetPassword',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
        }
        const token=buffer.toString('hex')
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User does not exist with that email.."})
            }
            else{
                user.resetToken=token;
                user.expireToken=Date.now()+3600000;
                user.save()
                .then(result=>{
                    transporter.sendMail({
                        to:user.email,
                        from:"shwetachaurasia12@gmail.com",
                        subject:"password reset",
                        html:`<p>You requested for password reset ... </p>
                        <h5>click on this <a href="http://localhost:3000/resetPassword/${token}" >link</a> to reset you password.`
                    })
                    res.json({message:"check your email!!"})
                })
            }
        })
    })

})

router.post("/resetPassword",(req,res)=>{
    const newPassword=req.body.password;
    const resetToken=req.body.token;
    User.findOne({resetToken:resetToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            res.status(422).json({error:"Either invalid token or expired token!"})
        }
        else{
            bcrypt.hash(newPassword,12).then(hashPass=>{
                user.password=hashPass;
            user.resetToken=undefined;
            user.expireToken=undefined;
            user.save()
            .then(savedUser=>{
                res.json({message:"Password changed succesfully!"})
            }).catch(err=>console.log(err))
            })
            
        }
    })
})

router.put("/editProfile",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{dp:req.body.dp,about:req.body.about,fullName:req.body.fullName},{new:true})
    .exec((err,result)=>{
        if(err){
            res.status(422).json({err:error})
        }
        else{
            res.json(result)
        }
    })
})

module.exports=router;