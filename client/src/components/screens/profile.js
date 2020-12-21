import React,{useEffect,useState,useContext} from "react";
import { Link } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import {UserContext} from '../../App';

const Profile = () => {

const {state,dispatch}=useContext(UserContext);
const [posts,setPosts]=useState([]);

useEffect(()=>{
  fetch("/myPost",{
    headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}
  }).then(res=>res.json())
  .then(posts=>{
    setPosts(posts.myPost);

  })
},[])

const setDp=()=>{
  return({backgroundImage : "url(" + state.dp + ")"}
  )
}

  return (
    <>
    {state? 
    <div className="p_container">
    <div className="info">
      {state?
      <div className="dp"  style={setDp()} />:"Loading...."}
      
      <div className="user">
        <p>{state?state.name:"loading"} </p>
        <p>{state?state.fullName:"loading"}</p>
        <p>
          <i>{state?state.about:"loading"}</i>
        </p>
        <div className="editicon">
          <Link to="/editProfile">Edit profile</Link>
          <CreateIcon />
        </div>
      </div>
    </div>
    <div className="follow">
      <div className="numPosts">
        <Link to="/x"><b>{posts.length}</b> Posts</Link>
      </div>
      <div className="followers">
        <Link to="/x"><b>{state?state.followers.length:"0"}</b> Followers</Link>
      </div>
      <div className="following">
        <Link to="/x"><b>{state?state.following.length:"0"}</b> Following</Link>
      </div>
    </div>
    {posts?<div className="posts">
      {
        posts.map((post)=>{
          return (
            <img key={post._id}
               alt=""
               src={post.image}
              />
          )
        })
      }
    </div>
    :"Loading...."}
    
  </div>:"Loading....."}
      
    </>
  );
};

export default Profile;
