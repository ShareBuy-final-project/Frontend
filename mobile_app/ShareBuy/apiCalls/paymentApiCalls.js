import {excuteAPICallPOST} from './apiCallWrapper';

export const updatePaymentConfirmed = async (paymentIntentId) => {
    await excuteAPICallPOST('payment/charge', {paymentIntentId});
};

export const createBusinessConnectedAccount = async (businessUserEmail) => {
    const response = await excuteAPICallPOST('payment/create-connected-account', {businessUserEmail});
    return response.data;
};

export const generateBankRegistrationAccountLink = async (accountId) => {
    const response = await excuteAPICallPOST('payment/generate-bank-registration-account-link', {accountId});
    return response.data;
};


 
