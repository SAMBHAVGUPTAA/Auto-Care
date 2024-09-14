import React,{useState} from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import {useNavigate, useLocation} from 'react-router-dom';
import toast from 'react-hot-toast';
import "../../styles/AuthStyle.css";
import { useAuth } from '../../context/auth';
const Login = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const[auth,setAuth] =useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(
            'http://localhost:8080/api/v1/auth/login',
            { email, password },
            {
              withCredentials: true,
            }
        );
        console.log(res);
        if (res && res.data.success) {
            toast.success(res.data.message);
            setAuth({
                ...auth,
                user: res.data.user,
                token: res.data.token,
            });
            localStorage.setItem('auth', JSON.stringify(res.data));
            navigate(location.state || '/');
        } else {
            toast.error(res.data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
    }
};*/
/*const handleSubmit = async (e) => {
  e.preventDefault();
  await axios.post(
     'http://localhost:8080/api/v1/auth/login',
{
      email,
      password,
    }, { withCredentials: true },)
    .then((res) => {
      //navigate("");
      if (res.data && res.data.success) {
        toast.success(res.data.message);
        setAuth({
            ...auth,
            user: res.data.user,
            token: res.data.token,
        });
        localStorage.setItem('auth', JSON.stringify(res.data));
        navigate(location.state || '/');
    } else {
        toast.error(res.data.message);
    }
      console.log(res)
      toast.success("User Login Successfully");
     // window.location.reload(true);
    }).catch((err)=>{
      console.log(err)
      toast.error(err.response.data.message);
    });
};*/
const handleSubmit = async (e) => {
  e.preventDefault();
  await axios.post(
    'http://localhost:8080/api/v1/auth/login',
    {
      email,
      password,
    },
    console.log(email,password),
    { withCredentials: true },
  )
  .then((res) => {
    if (res && res.data) { // Add a check for res and res.data
      if (res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem('auth', JSON.stringify(res.data));
        navigate(location.state || '/');
      } else {
        toast.error(res.data.message);
      }
    } else {
      toast.error("Something went wrong");
    }
    console.log(res);
    toast.success("User Login Successfully");
  })
  .catch((err) => {
    console.log(err);
    toast.error(err.response.data.message);
  });
};
  return (
    <div>
      <Layout title ="Register Yourself">
      <div className="form-container" style={{ minHeight: "90vh" }}>
      <form onSubmit={handleSubmit}>
        <h4 className='title'>LOGIN FORM</h4>
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
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="form-control"
      id="exampleInputEmail1"
      placeholder='Enter your password'
      required
    />
  </div>
  <div className="mb-3">
  <button type="submit" className="btn btn-primary">
    LOGIN
  </button>
  </div>
  <button type="button" className="btn btn-primary" onClick={()=> {navigate('/forgot-password')}}>
    Forgot Password
  </button>
</form>

      </div>
    </Layout>
    </div>
  )
}

export default Login
