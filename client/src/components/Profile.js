import React, { useEffect, useState } from 'react';
import './style.css';
import axios from 'axios';

function Profile() {
  const [userInfo, setUserInfo] = useState({
    pseudo: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    // Fetch user info
    axios.get('/api/my_info')
      .then(response => {
        const data = response.data.data[0];
        setUserInfo({
          pseudo: data.pseudo,
          email: data.email,
          password: data.password,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user profile
    axios.post('/api/update_my_profile', userInfo)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className='container text-center'>
      <div className='row'>
      <div className='row'></div>
      <div className='col-3'></div>
      <div className='col-6'>

      <h1>Profile</h1>
      <a href="/home">
          <button className='btn btn-primary'>Go home</button>
        </a>
      <form onSubmit={handleSubmit} className='form-control'>
        <label htmlFor="pseudo">Pseudo</label>
        <input className='form-control' type="text" name="pseudo" id="pseudo" placeholder="Pseudo" value={userInfo.pseudo} onChange={handleInputChange} />
        <label htmlFor="email">Email</label>
        <input className='form-control' type="email" name="email" id="email" placeholder="Email" value={userInfo.email} onChange={handleInputChange} />
        <label htmlFor="password">Password</label>
        <input className='form-control' type="password" name="password" id="password" placeholder="Password" value={userInfo.password} onChange={handleInputChange} />
        <input className="btn btn-outline-success" type="submit" value="Update" />
      </form>
      </div> 
      </div>
    </div>
  );
}

export default Profile;
