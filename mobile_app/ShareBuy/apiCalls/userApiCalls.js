import { excuteAPICall } from './apiCallWrapper';

export const registerUser = async (params) => {
  return await excuteAPICall('user/register', params);
};

export const registerBusiness = async (params) => {
  return await excuteAPICall('user/registerBusiness', params);
};
