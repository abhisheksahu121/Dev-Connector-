import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';  // so by using this connect package we are connect our component to redux 
import { Link,Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
// import axios from 'axios';
const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formDate, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formDate;

  const onChange = e =>
    setFormData({ ...formDate, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      // console.log('Passwords do not match');
      setAlert('Passwords do not match', 'danger');
    } else {
      //we  pass object with (name email password) and we can access these bcs we are pulling them out from the component state 'formData' 
      register({name, email, password});
      // console.log('SUCCESS')
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
    }
  };

  if(isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <Fragment>
      {/* <div style={{ marginTop: "60px" }}> */}
        <h1 className='large text-primary'>Sign Up</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Create Your Account
        </p>
        <form className='form' onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Name'
              name='name'
              value={name}
              onChange={e => onChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input type='email' placeholder='Email Address' name='email' value={email}
              onChange={e => onChange(e)}
              required 
              />
            <small className='form-text'>
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              minLength='6'
              value={password}
              onChange={e => onChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Confirm Password'
              name='password2'
              minLength='6'
              value={password2}
              onChange={e => onChange(e)}
              required
            />
          </div>
          <input type='submit' className='btn btn-primary' value='Register' />
        </form>
        <p className='my-1'>
          Already have an account? <Link to='/login'>Sign In</Link>
        </p>
      {/* </div> */}
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});
//so the connect takes an two thinks one is any state that you want to match second is an object with any action that you want to use 
//use connect to connect setalert register to our Register component
export default connect(mapStateToProps, { setAlert,register })(Register); //it allow us to access propes.setAlert
