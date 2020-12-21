import React, { useState } from "react";
import { Link,useHistory } from "react-router-dom";
import ToysIcon from '@material-ui/icons/Toys';

const Signup = () => {

  const history=useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const PostData = () => {
    fetch("/signup",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,email,password})
    }).then(res=>res.json())
      .then(data=>{
        console.log(data)
        if(data.error)
        alert(data.error)
        else{
          alert(data.message);
          history.push("/login")
        }
      })
  };

  return (
    <div className="card">
      <div className="brand">
        <div className="logo">
          <ToysIcon className="icon" />
        </div>
        <div className="brandName">Memesbook</div>
      </div>
      <form>
        <input
          type="text"
          name="name"
          placeholder="Enter your Username"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="submit"
          value="Signup"
          onClick={e => {
            e.preventDefault();
            PostData();
          }}
        />
      </form>
      <hr />
      <div className="sign">Already a User?</div>
      <div className="button">
        <Link to="/Login">
          {" "}
          <input type="submit" value="Login" />
        </Link>
      </div>
    </div>
  );
};

export default Signup;
