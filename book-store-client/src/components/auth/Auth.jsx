import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';

const Container = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Form = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  width: 80%;
  padding: 10px;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
`;

const Toggle = styled.p`
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
  color: #4CAF50;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const data = await authService.login(formData.username, formData.password);
      console.log('Login response:', data); // Debug log
      
      if (data.accessToken) {
        sessionStorage.setItem('accessToken', data.accessToken);
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error details:', error); // Debug log
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const userData = {
        name: formData.name,
        phoneNumber: formData.phone,
        address: formData.address,
        password: formData.password,
        id: formData.phone // Ensure this matches your backend expectation
      };
      
      console.log('Signup payload:', userData); // Debug log
      
      const response = await authService.signup(userData);
      console.log('Signup response:', response); // Debug log
      
      if (response.id) {
        alert('Sign Up successful! You can now log in.');
        setIsLogin(true);
      } else {
        setError(response.message || 'Sign Up failed');
      }
    } catch (error) {
      console.error('Signup error details:', error); // Debug log
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Container>
      <Form>
        {isLogin ? (
          <>
            <h2>Login</h2>
            <Input
              type="text"
              name="username"
              placeholder="Username or Phone Number"
              onChange={handleChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <Button onClick={handleLogin}>Login</Button>
            {error && <Error>{error}</Error>}
            <Toggle onClick={() => setIsLogin(false)}>
              Don't have an account? Sign Up
            </Toggle>
          </>
        ) : (
          <>
            <h2>Sign Up</h2>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />
            <Input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
            />
            <Input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <Button onClick={handleSignup}>Sign Up</Button>
            {error && <Error>{error}</Error>}
            <Toggle onClick={() => setIsLogin(true)}>
              Already have an account? Login
            </Toggle>
          </>
        )}
      </Form>
    </Container>
  );
};

export default Auth;