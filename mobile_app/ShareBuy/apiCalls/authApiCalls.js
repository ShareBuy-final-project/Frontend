import axios from 'axios';
import { saveToken, isLoggedIn, getToken } from '../utils/userTokens';
import {excuteAPICallPOST} from './apiCallWrapper';
import Constants from 'expo-constants';

const baseRoute = Constants.expoConfig.extra.BASE_ROUTE;

export const login = async (email, password) => {
  console.log("Logging in with email:", email , "password :", password);  
  if(await isLoggedIn()) {
        console.log("Already logged in");
        throw new Error('Already logged in');
    }
  try{
      const res = await excuteAPICallPOST('auth/login', {email, password});
      console.log("login res:\n" ,res);
      if(res.status !== 200 || !res.data.accessToken || !res.data.refreshToken) {
          console.log("Login failed");
          throw new Error('Login failed');
      }
      console.log("Login successful");
      saveToken('accessToken', res.data.accessToken);
      saveToken('refreshToken', res.data.refreshToken);
      saveToken('email', email);
      return "login successful";
  }
  catch(error) {
      console.error('Login failed:', error);
      throw error;
  }
};

/**
 * Refresh the access token using the refresh token.
 * @returns {Promise<string|null>} - The new access token or null if refresh failed.
 */
export async function refreshAccessToken() {
    const refreshToken = await getToken('refreshToken');
    if (!refreshToken) {
      return null;
    }
  
    try {
        const response = await axios.post(`${baseRoute}/auth/token`, 
            {
                refreshToken
            }, 
            {
                headers: {
                'Content-Type': 'application/json',
                },
            }
        );
  
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      const newAccessToken = data.accessToken;
      await saveToken('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }
