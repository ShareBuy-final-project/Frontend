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
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    // https://www.w3resource.com/javascript/form/password-validation.php
    // Password must contain the following:
    // -------------------------------------
    // At least 8 characters long
    // Contain at least one uppercase letter
    // Contain at least one lowercase letter
    // Contain at least one digit
    // Contain at least one special character
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);

        if (!validatePassword(newPassword)) {
            setPasswordMessage('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character');
        } else {
            setPasswordMessage('');
        }
    };

    const handleClick = async () => {
        if (!username || !password || !confirmPassword || !state || !city || !streetAddress || !houseNumber || !email) {
            setErrorMessage('The required fields are not filled in');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('Password does not meet the requirements');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                username,
                password,
                state,
                city,
                streetAddress,
                houseNumber,
                zipCode,
                email
            });
            alert('Registration successful:', response.data);
        } catch (error) {
            alert('Error during registration:', error);
        }
    };

    return (
        <div className="container mx-auto px-4">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg"> */}
            <div className="flex justify-center items-center h-screen">
                <Card width="w-full max-w-full">
                    <h2 className="text-2xl font-bold mb-4">Register new Business</h2>
                    <div className="mb-4">
                        <p>Already have an account? <Link className="text-indigo-800 hover:text-indigo400 " to="/log-in">Log in</Link></p>
                    </div>
                    <div className="mt-8">
                        <div className="flex">
                            <TextBox
                                ph="user name"
                                mb="mb-4"
                                onChange={(event) => setUsername(event.target.value)}
                            />
                            <span className="text-red-500 ml-2">*</span>
                        </div>
                        <div className="flex">
                            <TextBox 
                                ph = "password" 
                                mb = "mb-4"
                                onChange={handlePasswordChange}
                            />
                            <span className="text-red-500 ml-2 mr-6">*</span>
                            {passwordMessage && <p className="text-red-500 mb-2">{passwordMessage}</p>}
                        </div>
                        <div className="flex">
                            <TextBox
                                ph = "confirm password" 
                                mb = "mb-4"
                                border={`${password !== confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                            />
                            <span className="text-red-500 ml-2">*</span>
                        </div>
                        <h6 className="text-l font-bold mb-4">Business details</h6>
                        <div className="flex">
                            <div className="flex">
                            <TextBox
                                ph="business name"
                                mb="mb-4 flex-1 min-w-0"
                                onChange={(event) => setBusinessName(event.target.value)}
                            />
                            <span className="text-red-500 ml-2 mr-6">*</span>
                            </div>
                            <div className="flex">
                                <TextBox
                                    ph="category"
                                    mb="mb-4 flex-1 min-w-0"
                                    onChange={(event) => setCategory(event.target.value)}
                                />
                                <span className="text-red-500 ml-2">*</span>
                            </div>
                        </div>
                        <div className="flex">
                            <TextBox
                                ph = "description" 
                                mb = "mb-4 flex-1"
                                width = "w-full"
                                isTextarea={true}
                                onChange={(event) => setDescription(event.target.value)}
                            />
                            <span className="text-red-500 w-1/2 ml-2">*</span>
                        </div>
                        <div className="flex">
                            <div className="flex">
                                <TextBox
                                    ph = "house number" 
                                    mb = "mb-4 min-w-0"
                                    onChange={(event) => setHouseNumber(event.target.value)}
                                />  
                                <span className="text-red-500 ml-2 mr-6">*</span>
                            </div>
                            <div className="flex">
                                <TextBox
                                    ph = "zip code" 
                                    mb = "mb-4 min-w-0"
                                    onChange={(event) => setZipCode(event.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex">
                            <TextBox
                                ph = "email" 
                                mb = "mb-4"
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <span className="text-red-500 ml-2">*</span>
                        </div>
                    </div>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <Button label="Register" className="mb-4" onClick={handleClick}/>
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage