import React from 'react'
import Card from '../components/Card'
import TextBox from '../components/TextBox'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleClick = async () => {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                username,
                password
            });
            alert('Registration successful:', response.data);
        } catch (error) {
            alert('Error during registration:', error);
        }
    };

    return (
        <div className="container-xl lg:container m-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Register</h2>
                    <div className="mb-4">
                        <p>Register a new business? <Link className="text-indigo-800 hover:text-indigo-400 " to="/registerBusiness">Click here</Link></p>
                        <p>Already have an account? <Link className="text-indigo-800 hover:text-indigo-400 " to="/log-in">Log in</Link></p>
                    </div>
                    <div className="mt-8">
                        <TextBox
                            ph = "user name" 
                            mb = "mb-4"
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        <TextBox 
                            ph = "password" 
                            mb = "mb-4"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <TextBox
                            ph = "confirm password" 
                            mb = "mb-4"
                            border={`${password !== confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                    </div>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <Button label="Register" className="mb-4" onClick={handleClick}/>
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage