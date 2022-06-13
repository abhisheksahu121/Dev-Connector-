import React, { Fragment, useState } from 'react';
// import axios from 'axios';
import {Link} from 'react-router-dom';
const Login = () => {
  const [formDate, setFormData] = useState({
    email: '',
    password: '',
  });

  const {  email, password } = formDate;

  const onChange = e => 
  setFormData({...formDate, [e.target.name]: e.target.value});

  const onSubmit = async e => {
    e.preventDefault();
      console.log('SUCCESS');
      // later do this stuff by redux 
      // const newUser = {
      //   name,
      //   email,
      //   password
      // };
      //   try {
      //     const config = {
      //       headers: {
      //         'Content-Type': 'application/json'
      //       }
      //     };

      //   const body = JSON.stringify(newUser);
      //   const res = await axios.post('/api/users',body,config);
      //   console.log(res.data);


      // } catch(err) {
      //   console.error(err.response.data);
      // }
  };
  return (
    <Fragment>
      <h1 name='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign in to your account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        {/* <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange = {e => onChange(e)}
            required
          />
        </div> */}
        <div className='form-group'>
          <input type='email' placeholder='Email Address' name='email'  value={email}
            onChange = {e => onChange(e)}
            required />
          {/* <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small> */}
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange = {e => onChange(e)}
            required
          />
        </div>
        {/* <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange = {e => onChange(e)}
            required
          />
        </div> */}
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Do not have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;