import React from 'react';
import axios from 'axios';
import './style.css';

const Login = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post(
        'http://localhost/api/login', 
        { "username": username, "password": password }, 
        { withCredentials: true }
      );
      if (response.status === 200) {
        window.location.href = '/home'; // Redirect to /home
      } 
      else if (response.status === 401) {
        console.log('Invalid login'); // Handle login failure
      } else {
        console.log('Login failed'); // Handle login failure
      }
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div className="container text-center">
      <div className="row">
      <div className='row'></div>
        <div className='col-3'></div>
        <div className='col-6'>
        <h2 className='text-center mb-3'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" className='form-control' />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" className='form-control' />
          </div>
          <button type="submit" className="btn btn-outline-success">Login</button>
        </form>
        {/* button to href to register */}
        <a href="/register">
          <button className='btn btn-primary'>Register</button>
        </a>
      </div>
      </div>
    </div>
  );
};

export default Login;
