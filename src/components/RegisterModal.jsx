import React, { useState } from 'react';
import Card from './Card';
import TextBox from './TextBox';
import Button from './Button';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (!validatePassword(newPassword)) {
      setPasswordMessage(
        'Password must have at least 8 characters, one uppercase, one lowercase, one digit, and one special character.'
      );
    } else {
      setPasswordMessage('');
    }
  };

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword || !email) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('Password does not meet the requirements.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/register', {
        username,
        password,
        email,
      });
      alert('Registration successful!');
      onClose(); // Close modal after successful registration
    } catch (error) {
      alert('Error during registration:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <div>
          <TextBox
            ph="Username"
            mb="mb-4"
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextBox
            ph="Password"
            mb="mb-4"
            onChange={handlePasswordChange}
            type="password"
          />
          {passwordMessage && <p className="text-red-500 mb-2">{passwordMessage}</p>}
          <TextBox
            ph="Confirm Password"
            mb="mb-4"
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
          />
          <TextBox
            ph="Email"
            mb="mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="flex justify-end space-x-2">
          <Button label="Cancel" onClick={onClose} />
          <Button label="Register" onClick={handleRegister} />
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
