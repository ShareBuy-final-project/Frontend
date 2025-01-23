import {excuteAPICallPOST} from './apiCallWrapper';

export const updatePaymentConfirmed = async (paymentIntentId) => {
    excuteAPICallPOST('payment/charge', {paymentIntentId});
};

 
