import React, { useState,useEffect,useContext} from "react";
import {useHistory } from "react-router-dom";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import {UserContext} from '../../App';


const EditProfile = () => {

const history =useHistory();
const {state,dispatch}=useContext(UserContext);
const [fullName,setFullName]=useState("");
const [about,setAbout]=useState("");
const [image,setImage]=useState("");
const [imageUrl,setImageUrl]=useState("");

useEffect(()=>{
  if(imageUrl){
    fetch("/editProfile",{
      method:"PUT",
      body:JSON.stringify({fullName:fullName,about:about,dp:imageUrl}),
      headers:{"Content-Type":"application/json",
       "Authorization":"Bearer "+localStorage.getItem("jwt")}
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        alert(data.error)
      }
      else{
        dispatch({type:"EDIT",payload:{fullName:fullName,about:about,dp:image}})
        localStorage.setItem("user",JSON.stringify(data))
        alert("Edited succesfully!!")
        history.push("/profile")
      }
    }).catch(err=>console.log(err))
  }
},[imageUrl,fullName,about])

const editProfile=()=>{
  const data=new FormData();
  data.append("file",image);
  data.append("upload_preset","memesbook");
  data.append("cloud_name","sh24sh25");

  fetch("https://api.cloudinary.com/v1_1/sh24sh25/image/upload",{
    method:"POST",
    body:data
  }).then(res=>res.json())
  .then(data=>{
    setImageUrl(data.url)})
  .catch(err=>console.log(err))
}

  return (
    <>
      <div className="createPost">
        <div className="content">
          <div className="head">
            Edit Profile <BorderColorIcon className="icon" />
          </div>
          <div className="title">
            <input type="text" placeholder="Full name" value={fullName} onChange={e=>{setFullName(e.target.value)}} />
          </div>
          <div className="body">
            <input type="text" placeholder="About me....." value={about} onChange={e=>{setAbout(e.target.value)}}/>
          </div>
          <div className="file">
            <span>Upload Image: </span>
            <input type="file" onChange={e=>setImage(e.target.files[0])} />
          </div>
          <div className="submit">
            <input type="submit" value="Save Changes" onClick={()=>editProfile()} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
