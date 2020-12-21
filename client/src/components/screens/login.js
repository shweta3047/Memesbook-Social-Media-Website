import React,{useState,useContext} from "react";
import { Link,useHistory } from "react-router-dom";
import ToysIcon from '@material-ui/icons/Toys';
import {UserContext} from '../../App';

const Login = () => {

  const {state,dispatch}=useContext(UserContext);

  const history=useHistory();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const PostData=()=>{
    fetch("/login",{
      method:"POST",
      body:JSON.stringify({email,password}),
      headers:{"Content-Type":"application/json"}
    }).then(res=>res.json())
    .then(data=>{
      if(data.error)
      alert(data.error);
      else{
        localStorage.setItem("jwt",data.token);
        localStorage.setItem("user",JSON.stringify(data.user))
        dispatch({type:'USER',payload:data.user})
        history.push('/home')
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
        <input type="password" name="password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input type="submit" value="Login" onClick={e=>{
          e.preventDefault();
          PostData();
        }} />
      </form>
      <div className="forgetPassword">
        <Link to="/forgetPassword">Forgot Password?</Link>
      </div>
      <hr />
      <div className="sign">Not yet Registered?</div>
      <div className="button">
        <Link to="/signup">
          {" "}
          <input type="submit" value="Signup" />
        </Link>
      </div>
    </div>
  );
};

export default Login;
