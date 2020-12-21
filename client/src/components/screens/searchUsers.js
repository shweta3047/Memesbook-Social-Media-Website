import React,{useState,useContext} from "react";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import {UserContext} from "../../App";

const Search = () => {
    const [search,setSearch]=useState('');
    const [searchedUsers,setSearchedUsers]=useState([]);
    const {state,dispatch}=useContext(UserContext);

  const searchUsers=(query)=>{
    setSearch(query);
    fetch("/searchUsers",{
      headers:{"Authorization":"Bearer "+localStorage.getItem("jwt"),"Content-Type":"application/json"},
      method:"POST",
      body:JSON.stringify({query})
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      setSearchedUsers(result.user)
    })
  }
  return (
    <div className="card">
      <div className="brand">
        <div className="brandName">Search Users...</div>
      </div>
      <div className="search">
      <span ><input type="text" placeholder="Enter username" value={search} onChange={e=>searchUsers(e.target.value)} /></span>
          <span className="searchlogo">
        <SearchIcon/>
      </span> 
      </div>
      <br/>
      {
          searchedUsers.map(user=>{
              return (
                    <div className="searchedUsers" >
                        <hr/>
                        <Link to={user._id===state._id?"/profile":"/profile/"+user._id} className="userLink">
                            <span><img alt="" src={user.dp}/> </span> <span>{user.name}</span></Link>
                    </div>
              )
          })
      }

    </div>
  );
};

export default Search;
