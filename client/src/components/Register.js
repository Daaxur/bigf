import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password verification logic
    const { password } = formData;
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(password) || password.length < 8) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one symbol, and be at least 8 characters long.');
      return;
    }

    axios.post('/register', formData)
      .then(response => {
        console.log(response.data);
        setRegistrationSuccess(true);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className='container text-center'>
      <div className='row'>
        <div className='col-3'></div>
        <div className='col-6'>
          <h1 className='text-center mb-3'>Register</h1>
          {!registrationSuccess ? (
            <form onSubmit={handleSubmit}>
              <input
                className='form-control mb-3'
                id="username"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <input
                className='form-control mb-3'
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                className='form-control mb-3'
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {passwordError && <div className="alert alert-danger">{passwordError}</div>}
              <button className="btn btn-outline-success" type="submit">Register</button>
              <button className='btn btn-primary' onClick={() => window.location.href = '/'}>Login</button>
            </form>
          ) : (
            <div>
              <p>Registration successful!</p>
              <button className='btn btn-primary' onClick={() => setRegistrationSuccess(false)}>Register Another</button>
              <button className="btn btn-outline-success" onClick={() => window.location.href = '/'}>Login</button>
            </div>
          )}
        </div>
        <div className='col-3'></div>
      </div>
    </div>
  );
}

export default Register;
