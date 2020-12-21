import React,{useState} from "react";
import { Link,useParams,useHistory } from "react-router-dom";
import ToysIcon from '@material-ui/icons/Toys';

const ResetPass = () => {
    const history=useHistory();
  const [password,setPassword]=useState("");
  const [confirmpass,setConfirmpass]=useState("");
  const {token}=useParams();

  const PostData=()=>{
      if(password!==confirmpass){
          alert("password and confirm password do not match...");
      }
      else{
        fetch("/resetPassword",{
            method:"POST",
            body:JSON.stringify({password,token}),
            headers:{"Content-Type":"application/json"}
          }).then(res=>res.json())
          .then(data=>{
            if(data.error)
            alert(data.error);
            else{
                alert(data.message)
                history.push('/login')
            }
          })
      } 
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
      <input type="password" name="password" placeholder="Enter new password" value={password} onChange={e=>setPassword(e.target.value)} />
      <input type="password" name="confirmpass" placeholder="Confirm new password" value={confirmpass} onChange={e=>setConfirmpass(e.target.value)} />

        <input type="submit" value="Reset Password" onClick={e=>{
          e.preventDefault();
          PostData();
        }} />
      </form>
      <div className="forgetPassword">
        <Link to="/forgetPassword">Re-enter email</Link>
      </div>
    </div>
  );
};

export default ResetPass;
