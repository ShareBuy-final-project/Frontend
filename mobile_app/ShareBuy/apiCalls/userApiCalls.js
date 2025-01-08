import { excuteAPICallPOST } from './apiCallWrapper';

export const registerUser = async (params) => {
  return await excuteAPICallPOST('user/register', params);
};

export const registerBusiness = async (params) => {
  return await excuteAPICallPOST('user/registerBusiness', params);
};
