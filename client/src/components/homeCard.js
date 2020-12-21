import React from "react";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import {Link} from 'react-router-dom';


const HomeCard = ({post,likePost,unlikePost}) => {

  var like=false;

  return (
    <>
      <div className="homeCard">
        <div className="postedBy">
          <img
            className="dp"
            alt=""
            src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
          />
          <span className="user">{post.postedBy.name}</span>
        </div>
        <img
          alt=""
          className="postimg"
          src={post.image}
        />
        <div className="content">
          <Link to="/home">
            <FavoriteBorderIcon className="like" onClick={()=>{
              like=!like;
              if(like){
                {likePost(post._id)}
              } else{
                {unlikePost(post._id)}
              }
            }} />
            </Link>

          <div className="likes">{post.likes.length} likes..</div>
          <div className="title">{post.title} </div>
          <div className="body">{post.body} </div>
        </div>
        <div className="comment-box">
          <input type="text" placeholder="Add a comment..." />
          <input type="submit" value="Add" />
        </div>
      </div>
    </>
  );
};

export default HomeCard;
