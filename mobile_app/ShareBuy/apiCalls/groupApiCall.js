import {excuteAPICallPOST} from './apiCallWrapper';

export const createPaymentIntent = async (groupId, amount) => {
  try{
      const res = await excuteAPICallPOST('group/joinGroup', {groupId, amount});
      return res.data;
  }
  catch(error) {
      console.error('Creating payment intent failed', error);
      throw error;
  }
};

export const cancelPaymentIntent = async (groupId, paymentIntentId) => {
    try{
        const res = await excuteAPICallPOST('group/leaveGroup', {groupId, paymentIntentId});
        return res;
    }
    catch(error) {
        console.error('Creating payment intent failed', error);
        throw error;
    }
  };
 
