import { useNavigate } from 'react-router-dom';
import '../Styles/Welcome.css';
import axios from 'axios';

function Welcome() {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    };

    const handleLogin = async () => {
        try {
            console.log('Login process started...');
            const response = await axios.post('http://localhost:5000/api/login', {
                username: 'admin', // Hardcoded username
                password: 'admin-password', // Hardcoded password
            });
            console.log('Login successful:', response.data);
            //navigateTo('/login');
        } catch (error) {
            console.error('Error during login:', error);
        }
    };


    return (
    <div className="welcome-container">
        <h1>Welcome to Group Purchase Platform</h1>
        <div className="button-group">
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => navigateTo('/register/user')}>Register as User</button>
        <button onClick={() => navigateTo('/register/business')}>Register as Business</button>
        </div>
    </div>
    );
}

export default Welcome;