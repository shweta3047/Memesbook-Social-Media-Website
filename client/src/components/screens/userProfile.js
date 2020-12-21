import React,{useEffect,useState,useContext} from "react";
import { Link,useParams} from "react-router-dom";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import GroupIcon from '@material-ui/icons/Group';
import {UserContext} from '../../App';


const UserProfile = () => {
const {userId}=useParams();
const {state,dispatch}=useContext(UserContext);
const [profile,setProfile]=useState(null);
const [followed,setFollowed]=useState(state?state.following.includes(userId):false);

useEffect(()=>{
  fetch(`/profile/${userId}`,{
    headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}
  }).then(res=>res.json())
  .then(result=>{
    console.log(result)
    setProfile(result)
  }).catch(err=>console.log(err))
},[])

const followUser=()=>{
  fetch("/follow",{
    headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem("jwt")},
    method:"PUT",
    body:JSON.stringify({followId:userId})
  }).then(res=>res.json())
  .then(result=>{
    console.log(result)
    dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
    localStorage.setItem("user",JSON.stringify(result))
    setProfile(prevState=>{
      return {...prevState,user:{...prevState.user,followers:[...prevState.user.followers,result._id]}}
    })
    setFollowed(true);
  }).catch(err=>console.log(err))
}

const unfollowUser=()=>{
  fetch("/unfollow",{
    headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem("jwt")},
    method:"PUT",
    body:JSON.stringify({unfollowId:userId})
  }).then(res=>res.json())
  .then(result=>{
    console.log(result)
    dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
    localStorage.setItem("user",JSON.stringify(result))
    setProfile(prevState=>{
      const newFollowers=prevState.user.followers.filter(item=>item!==result._id)
      return {...prevState,user:{...prevState.user,followers:newFollowers}}
    })
    setFollowed(false);
  }).catch(err=>console.log(err))
}

const setDp=()=>{
  return({backgroundImage : "url(" + profile.user.dp + ")"}
  )
}

  return (
    <>
    {profile? <div className="p_container">
        <div className="info">
        {profile?
      <div className="dp"  style={setDp()} />:"Loading...."}
      
      <div className="user">
        <p>{profile?profile.user.name:"loading"} </p>
        <p>{profile?profile.user.fullName:"loading"}</p>
        <p>
          <i>{profile?profile.user.about:"loading"}</i>
        </p>
            {followed?  <button className="followicon" onClick={(e)=>{return unfollowUser()}} >
             <span>Unfollow </span> <GroupIcon className="groupAddIcon" />
            </button>
            :<button className="followicon" onClick={(e)=>{return followUser()}} >
            <span>Follow </span> <GroupAddIcon className="groupAddIcon" /></button>}
           
           
          </div>
        </div>
        <div className="follow">
          <div className="numPosts">
            <Link to="/x"><b>{profile.posts.length}</b> Posts</Link>
          </div>
          <div className="followers">
            <Link to="/x"><b>{profile.user.followers.length}</b> Followers</Link>
          </div>
          <div className="following">
            <Link to="/x"><b>{profile.user.following.length}</b> Following</Link>
          </div>
        </div>
        <div className="posts">
          {
            profile.posts.map((post)=>{
              return (
                <img key={post._id}
                   alt=""
                   src={post.image}
                  />
              )
            })
          }
        </div>
      </div>
    :<h2>Loading.....!</h2>}
    </>
  );
};

export default UserProfile;
