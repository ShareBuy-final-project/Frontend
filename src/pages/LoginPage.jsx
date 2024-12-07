import React from 'react'
import Card from '../components/Card'
import TextBox from '../components/TextBox'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleClick = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/login', {
                    username: username,
                    password: password, 
                });
                alert('Login successful:', response.data);
            } catch (error) {
                alert('Error during login:', error);
            }
            
    };
    return (
        <div className="container-xl lg:container m-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Log in</h2>
                    <TextBox
                        ph = "user name" 
                        className="mb-4"
                        onChange={(event) => setUsername(event.target.value)}
                     />
                    <TextBox 
                        ph = "password" 
                        className="mb-4"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Button label="Log in" className="mb-4" onClick={handleClick}/>
                    <div >
                        Not a member yet? <Link className="text-indigo-800 hover:text-indigo-400 " to="/register">Click here</Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage