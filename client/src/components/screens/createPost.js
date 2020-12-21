import React, { useState,useEffect } from "react";
import {useHistory } from "react-router-dom";
import BorderColorIcon from "@material-ui/icons/BorderColor";

const Create = () => {

const history =useHistory();
const [title,setTitle]=useState("");
const [body,setBody]=useState("");
const [image,setImage]=useState("");
const [imageUrl,setImageUrl]=useState("");

useEffect(()=>{
  if(imageUrl){
    fetch("/createPost",{
      method:"POST",
      body:JSON.stringify({title:title,body:body,image:imageUrl}),
      headers:{"Content-Type":"application/json",
       "Authorization":"Bearer "+localStorage.getItem("jwt")}
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        alert(data.error)
      }
      else{
        alert("uploaded succesfully!!")
        history.push("/home")
      }
    }).catch(err=>console.log(err))
  }
},[imageUrl,title,body])

const UploadPost=()=>{
  const data=new FormData();
  data.append("file",image);
  data.append("upload_preset","memesbook");
  data.append("cloud_name","sh24sh25");

  fetch("https://api.cloudinary.com/v1_1/sh24sh25/image/upload",{
    method:"POST",
    body:data
  }).then(res=>res.json())
  .then(data=>{
    console.log(data)
    setImageUrl(data.url)})
  .catch(err=>console.log(err))
}

  return (
    <>
      <div className="createPost">
        <div className="content">
          <div className="head">
            Create post <BorderColorIcon className="icon" />
          </div>
          <div className="title">
            <input type="text" placeholder="Title" value={title} onChange={e=>{setTitle(e.target.value)}} />
          </div>
          <div className="body">
            <input type="text" placeholder="Body" value={body} onChange={e=>{setBody(e.target.value)}}/>
          </div>
          <div className="file">
            <span>Upload Image: </span>
            <input type="file" onChange={e=>setImage(e.target.files[0])} />
          </div>
          <div className="submit">
            <input type="submit" value="Submit Post" onClick={()=>UploadPost()} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
