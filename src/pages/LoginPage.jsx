import React from 'react'
import Card from '../components/Card'
import TextBox from '../components/TextBox'
import Button from '../components/Button'
import { Link } from 'react-router-dom'

const LoginPage = () => {
    const handleClick = () => {
        alert('Button clicked!');
    };
    return (
        <div className="container-xl lg:container m-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Log in</h2>
                    <TextBox ph = "user name" className="mb-4"/>
                    <TextBox ph = "password" className="mb-4"/>
                    <Button label="Log in" className="mb-4"/>
                    <div >
                        Not a member yet? <Link className="text-indigo-800 hover:text-indigo-400 " to="/register">Click here</Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage