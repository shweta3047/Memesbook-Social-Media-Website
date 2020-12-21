import React,{useEffect,useState,useContext} from "react";
import {Link} from 'react-router-dom';
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import DeleteIcon from '@material-ui/icons/Delete';
import {UserContext} from '../../App';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';


const Home = () => {
  const [posts,setPosts]=useState([]);
  const {state,disaptch}=useContext(UserContext);
  const [comment,setComment]=useState([]);

  useEffect(()=>{
    fetch("/subscribedPost",{
      headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}
    }).then(res=>res.json())
    .then(data=>{
      setPosts(data.post);
    }).catch(err=>console.log(err))
  },[])

  const likePost=(id)=>{
    fetch("/like",{
      method:"PUT",
      headers:{"Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({postId:id}),
    }).then(res=>res.json())
    .then(result=>{
      const newData=posts.map((item)=>{
        if(item._id===result._id){
          return result;
        }else{
          return item;
        }
      })
      setPosts(newData)
    })
    .catch(err=>console.log(err))
}

const unlikePost=(id)=>{
  fetch("/unlike",{
    method:"PUT",
    headers:{"Content-Type":"application/json",
    "Authorization":"Bearer "+localStorage.getItem("jwt")
  },
  body:JSON.stringify({postId:id}),
  }).then(res=>res.json())
  .then(result=>{
   const newData=posts.map((item)=>{
     if(item._id===result._id){
       return result;
     }
     else{
       return item;
     }
   }) 
   setPosts(newData)
  })
  .catch(err=>console.log(err))
}

const addComment=(text,postedBy,postId)=>{
  fetch("/comments",{
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({text,postedBy,postId}),
  }).then(res=>res.json())
  .then(res=>{
    const newData=posts.map((item)=>{
      if(item._id===res._id){
        return res;
      }
      else{
        return item;
      }
    })
    setPosts(newData);
    setComment([])
  }).catch(err=>console.log(err))
}

const deletePost=(postId)=>{
  fetch(`/deletePost/${postId}`,{
    method:"DELETE",
    headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}
  }).then(res=>res.json())
  .then(result=>{
    const newData=posts.filter(item=>{
      return item._id!==result._id
    })
    setPosts(newData)
    alert("Post deleted succesfully!!")
  }).catch(err=>console.log(err))
}

const deleteComment=(postId,commentId)=>{
  fetch(`/deleteComment/${postId}/${commentId}`,{
    method:"DELETE",
    headers:{"Authorization":"Bearer "+localStorage.getItem("jwt")}
  }).then(res=>res.json())
  .then(result=>{
      const newPosts= posts.map((post)=>{
         if(post._id===postId){
            return result;}
            else{
              return post;
            }
           })
       setPosts(newPosts);
  }).catch(err=>console.log(err))
}

  return (
    <div>
    {
       posts.map(post=>{
         return(
          <div key={post._id}>
          
            <div className="homeCard">
              <div className="postedBy">
                <img
                  className="dp"
                  alt=""
                  src={post.postedBy.dp}
                />
                <Link to={post.postedBy._id!==state._id?`/profile/${post.postedBy._id}`:"/profile"}>
                <span className="user">{post.postedBy.name}</span></Link>
                {post.postedBy._id===state._id && 
                  <DeleteIcon className="deletePostIcon"  onClick={()=>deletePost(post._id)} />
                }
                  
              </div>
              <img
                alt=""
                className="postimg"
                src={post.image}
              />
              <div className="content">
                <Link to="/home">
                  <FavoriteBorderIcon className="like" onClick={()=>{  
                    post.likes.includes(state._id)?unlikePost(post._id):likePost(post._id)
                  }} />
                  </Link>
      
                <div className="likes">{post.likes.length} likes..</div>
                <div className="title">{post.title} </div>
                <div className="body">{post.body} </div><br/>
                <hr/>
                {
                  post.comments.map((comment)=>{
                    return(
                    <div key={comment._id} className="commentDiv">
                      <span style={{fontWeight:"800"}}>{comment.postedBy.name}: </span>{comment.text}
                      {comment.postedBy._id===state._id &&
                    <DeleteOutlineIcon className="deleteCommentIcon"  onClick={()=>deleteComment(post._id,comment._id)} />
                      }
                    </div>
                    )
                  })
                }
              </div>
              <div className="comment-box">
                <input type="text" placeholder="Add a comment..." value={comment} onChange={(e)=>setComment(e.target.value)} />
                <input type="submit" value="Add" onClick={(e)=>{
                  e.preventDefault();
                  {addComment(comment,state._id,post._id)}
                }} />
              </div>
            </div>
            </div>
        );
        
       })
    }
    </div>
  );
};

export default Home;
