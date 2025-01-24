import { getToken, saveToken } from "../utils/userTokens";
import { refreshAccessToken } from "./authApiCalls";
import axios from 'axios';
import Constants from 'expo-constants';

const baseRoute = Constants.expoConfig.extra.BASE_ROUTE;

// request interceptor for debbug purposes
// axios.interceptors.request.use(
//     (config) => {
//         console.log('Sending request:', config);
//         return config;
//     },
//     (error) => {
//         console.error('Error in request:', error);
//         return Promise.reject(error);
//     }
// );


const excuteAPICall = async (route, type, params) => {
    if (!baseRoute) {
        throw new Error('BASE_ROUTE is not defined');
    }

    let body = JSON.stringify(params);
    let accessToken = await getToken('accessToken');
    let headers = {
        'Content-Type': 'application/json'
    };
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
        const response = await axios({
            method: type,
            url: baseRoute + route,
            headers: headers,
            data: body
        });
        //console.log('Response:', response);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token might be invalid, try to refresh it
            accessToken = await refreshAccessToken();
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
                try {
                    const retryResponse = await axios({
                        method: type,
                        url: baseRoute + route,
                        headers: headers,
                        data: body
                    });
                    return retryResponse;
                } catch (retryError) {
                    console.error('Retry failed:', retryError);
                    throw retryError;
                }
            } else {
                console.error('Failed to refresh token');
                throw error;
            }
        } else {
            throw error;
        }
    }
};

export const excuteAPICallGET = async (route, params) => {
    return await excuteAPICall(route, 'get', params);
};

export const excuteAPICallPOST = async (route, params) => {
    return await excuteAPICall(route, 'post', params);
};

export const excuteAPICallDELETE = async (route, params) => {
    return await excuteAPICall(route, 'delete', params);
};