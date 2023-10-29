import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [addUser] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);  
      return; 
    }

    try {
      const { data } = await addUser({
        variables: { input: { ...userFormData } },
      });

      const user = data.addUser;

      Auth.login(user.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        console.error('Server Error:', err.graphQLErrors[0].message);
      }
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        {showAlert && <div className='alert alert-danger'>Something went wrong with your signup!</div>}
        
        <div>
          <label htmlFor='username'>Username</label>
          <input 
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
        </div>

        <div>
          <label htmlFor='email'>Email</label>
          <input 
            type='email'
            placeholder='Your email address'
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
        <button type='submit' disabled={!(userFormData.username && userFormData.email && userFormData.password)}>Submit</button>
      </form>
    </>
  );
};

export default SignupForm;


