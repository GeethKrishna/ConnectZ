import React, { useState } from 'react';
import LinkedinLogo from "../assets/LinkedinLogo.png"
import GoogleButton from 'react-google-button';
import { LoginApi, GoogleSigninApi } from "../api/AuthApi";
import { useNavigate } from 'react-router-dom';
import "../Sass/LoginComponent.scss"; 
import { toast } from 'react-toastify';

export default function LoginComponent() {

  let navigate = useNavigate();

  const [credentials, setCredentials] = useState({});
  
  const login = async () => {
    try{
      let res = await LoginApi(credentials.email,credentials.password);
      toast.success('Signed in successfully!');
      localStorage.setItem('userEmail', res.user.email);
      navigate('/home');
    }catch(err){ 
      toast.error("Please check your credentials!!!");
    }
  };
  const  googleSignIn = async ()=>{
    let response = await GoogleSigninApi();
    toast.success('Signed in successfully!');
    localStorage.setItem('userEmail', response.user.email);
    navigate('/home');
  };
  return (
    <div className='login-wrapper'>
      <img src={LinkedinLogo} className='LinkedinLogo'/>
      <div className='login-wrapper-inner'>
        <h1 className='heading'>Login</h1>
        <p className='subheading'>Login to your proffessional world.</p>
        <div className='auth-inputs'>
          <input 
            onChange={(event) => 
              setCredentials({...credentials, email: event.target.value, })
            }
            type='email'
            className='common-input'
            placeholder='Email'
          />
          <input 
            onChange={(event) => 
              setCredentials({...credentials, password: event.target.value, })
            }
            type='password'
            className='common-input'
            placeholder='Password'
          />
        </div>
        <button onClick={login} className='login-btn'>
          Login
        </button>
        <hr className="hr-text" data-content="or"></hr>
        <GoogleButton 
          className='google-btn'
          onClick={googleSignIn}
        />
        <p className='new-linkedin'>
          New to LinkedIn! <span className='join-now' onClick={() => navigate('/register')}>Join now</span>
        </p>
      </div>

    </div>
  )
}
