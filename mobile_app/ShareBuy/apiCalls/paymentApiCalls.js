import {excuteAPICallPOST} from './apiCallWrapper';

export const updatePaymentConfirmed = async (paymentIntentId) => {
    await excuteAPICallPOST('payment/charge', {paymentIntentId});
};

 
