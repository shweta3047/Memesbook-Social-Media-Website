import React,{useContext,useRef} from "react";
import { Link } from "react-router-dom";
import ToysIcon from '@material-ui/icons/Toys';
import SearchIcon from '@material-ui/icons/Search';
import HorizontalSplitOutlinedIcon from '@material-ui/icons/HorizontalSplitOutlined';
import {UserContext} from '../App';

const Navbar = () => {
  const searchBar=useRef(null);
  const {state,dispatch}=useContext(UserContext);

  const renderNavs=()=>{
    if(state){
      return [
      <>
        <Link key="8" className="search" to="/searchUsers">
             <span className="profile">Search </span><span className="searchlogo">
        <SearchIcon/>
      </span>
        </Link>
      <Link key="1" to="/allPosts">
      <span className="profile">AllPosts </span>
      </Link>
      <Link key="2" to="/profile">
      <span className="profile">Profile </span>
      </Link>
      <Link key="3" to="/createPost">
        <span className="create">CreatePost </span>
      </Link>
      <Link key="4" to="/login">
        <span className="logout" onClick={()=>{
          localStorage.clear();
          dispatch({type:"CLEAR"})
        }} >Logout </span>
      </Link>
      </>
      ]
    }
    else{
      return [
      <>
      <Link key="5" to="/login">
          <span className="login">Login </span>
      </Link>
       <Link key="6" to="/signup">
          <span className="signup">SignUp </span>
       </Link>
       </>
      ]
      } 
  }

  return (
    <>
      <div className="container">
        <div className="navbar">
          <div className="left item">
            <Link key="7"to={state?"/home":"/login"} className="brand">
              <span className="logo">
                <ToysIcon className="icon" />
              </span>
              <span className="brandName">Memesbook</span>
            </Link>
          </div>
          <div className="right item">
            {renderNavs()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
