import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  const [loginUser] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!userFormData.email || !userFormData.password) {
      setValidated(true);  
      return;  
    }

    try {
      const { data } = await loginUser({
        variables: { input: { ...userFormData } }, 
      });

      const user = data.login; 
      Auth.login(user.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        console.error('Server Error:', err.graphQLErrors[0].message);
      }
    }

    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        {showAlert && <div className='alert alert-danger'>Something went wrong with your login credentials!</div>}
        <div>
          <label htmlFor='email'>Email</label>
          <input 
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
        </div>

        <div>
          <label htmlFor='password'>Password</label>
          <input 
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
        </div>
        <button type='submit' disabled={!(userFormData.email && userFormData.password)}>Submit</button>
      </form>
    </>
  );
};

export default LoginForm;
