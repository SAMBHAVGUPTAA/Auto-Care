import React,{useState} from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import "../../styles/AuthStyle.css";


const ForgotPassword = () => {
    const [email,setEmail] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [answer,setAnswer] = useState("")

  
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(
           'http://localhost:8080/api/v1/auth/forgot-password',
      {
            email,
            newPassword,
            answer,
          }, { withCredentials: true },)
          .then((res) => {
            //navigate("");
            if (res && res.data.success) {
              toast.success(res.data.message);
              
              navigate('/login');
          } else {
              toast.error(res.data.message);
          }
            console.log(res)
            toast.success("User Login Successfully");
           // window.location.reload(true);
          }).catch((err)=>{
      
            toast.error(err.response.data.message);
          });
      };
  return (
    <div>
      <Layout title ="Forgot Password">
      <div className="form-container" style={{ minHeight: "90vh" }}>
      <form onSubmit={handleSubmit}>
        <h4 className='title'>RESET PASSWORD</h4>
  <div className="mb-3">
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="form-control"
      id="exampleInputEmail1"
      placeholder='Enter your email'
      required
    />
  </div>
  <div className="mb-3">
    <input
      type="text"
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      className="form-control"
      id="exampleInputEmail1"
      placeholder='Enter your key Answer'
      required
    />
  </div>
  <div className="mb-3">
    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="form-control"
      id="exampleInputEmail1"
      placeholder='Enter your new password'
      required
    />
  </div>
  <button type="submit" className="btn btn-primary">
    RESET PASSWORD
  </button>
</form>

      </div>
    </Layout>
    </div>
  )
}

export default ForgotPassword
