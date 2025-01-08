import { getToken, saveToken } from "../utils/userTokens";
import { refreshAccessToken } from "./authApiCalls";
require('dotenv').config();

const baseRoute = process.env.BASE_ROUTE;

export const excuteAPICall = async (route, params) => {
    let body = JSON.stringify(params);
    let accessToken = await getToken('accessToken');
    let headers = {};
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
        let res = await axios.post(baseRoute + route, body, { headers });
        return res;
        
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token might be invalid, try to refresh it
            accessToken = await refreshAccessToken();
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
                try {
                    let res = await axios.post(baseRoute + route, body, { headers });
                    return res;
                } catch (retryError) {
                    console.error('Retry failed:', retryError);
                    throw retryError;
                }
            } else {
                console.error('Failed to refresh token');
                throw error;
            }
        } else {
            console.error('API call failed:', error);
            throw error;
        }
    }
};

