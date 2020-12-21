import React,{useState} from "react";
import { Link } from "react-router-dom";
import ToysIcon from '@material-ui/icons/Toys';

const ForgetPass = () => {
  const [email,setEmail]=useState("");

  const PostData=()=>{
    fetch("/forgetPassword",{
      method:"POST",
      body:JSON.stringify({email}),
      headers:{"Content-Type":"application/json"}
    }).then(res=>res.json())
    .then(data=>{
      if(data.error)
      alert(data.error);
      else{
          alert(data.message)
      }
    })
  }
  return (
    <div className="card">
      <div className="brand">
        <div className="logo">
          <ToysIcon className="icon" />
        </div>
        <div className="brandName">Memesbook</div>
      </div>
      <form>
        <input type="email" name="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="submit" value="Submit" onClick={e=>{
          e.preventDefault();
          PostData();
        }} />
      </form>
      <div className="forgetPassword">
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default ForgetPass;
