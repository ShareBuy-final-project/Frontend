import axios from 'axios';
import { saveToken, isLoggedIn } from '../utils/userTokens';

export const login = async (email, password) => {
    try {
        if(await isLoggedIn()) {
            console.log("Already logged in");
            throw new Error('Already logged in');
        }
        console.log("Logging in");
        const res = await axios.post('http://192.168.56.1:8080/auth/login', { email, password });
        if(res.status !== 200 || !res.data.accessToken || !res.data.refreshToken) {
            console.log("Login fdsfsfsfsdfdsfailed");
            throw new Error('Login failed');
        }
        console.log("Login successful");
        saveToken('accessToken', res.data.accessToken);
        saveToken('refreshToken', res.data.refreshToken);
        return "login successful";
    } catch{
        console.log("Login failed");
    }
};