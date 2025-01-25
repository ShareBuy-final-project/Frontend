import axios from 'axios';
import { saveToken, isLoggedIn, getToken, deleteAllTokens } from '../utils/userTokens';
import {excuteAPICallPOST, excuteAPICallDELETE} from './apiCallWrapper';
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
      return { message: "login successful", isBusiness: res.data.isBusiness };
  }
  catch(error) {
      console.error('Login failed:', error);
      throw error;
  }
};

export const logout = async () => {
  try {
    console.log("Logging out");
    const refreshToken = await getToken('refreshToken');
    const res = await excuteAPICallDELETE('auth/logout', {token: refreshToken});
    await deleteAllTokens();
    return res;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}
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
      console.log("url:", baseRoute + 'auth/token');
      const response = await axios({
        method: 'post',
        url: baseRoute + 'auth/token',
        headers: {
          'Content-Type': 'application/json',
          },
        data: {refreshToken}
    });
      const {accessToken} = response.data;
      await saveToken('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      return null;
    }
  }
