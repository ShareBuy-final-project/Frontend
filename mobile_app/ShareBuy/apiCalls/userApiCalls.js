import { excuteAPICall } from './apiCallWrapper';

/**
 * Fetch user personal information.
 * @returns {Promise<Object>} - The user personal information.
 */
export const fetchPersonalInformation = async () => {
    try {
        const res = await excuteAPICall('user/me', {});
        if (res.status !== 200) {
            throw new Error('Failed to fetch personal information');
        }
        return res.data;
    } catch (error) {
        console.error('Error fetching personal information:', error);
        throw error;
    }
};

/**
 * Update user personal information.
 * @param {Object} personalInfo - The personal information to update.
 * @returns {Promise<string>} - The update status.
 */
export const updatePersonalInformation = async (personalInfo) => {
    try {
        const res = await excuteAPICall('user/update', personalInfo);
        if (res.status !== 200) {
            throw new Error('Failed to update personal information');
        }
        return 'Update successful';
    } catch (error) {
        console.error('Error updating personal information:', error);
        throw error;
    }
};

/**
 * Change user password.
 * @param {Object} passwordData - The password data to update.
 * @returns {Promise<string>} - The update status.
 */
export const changePassword = async (passwordData) => {
    try {
        const res = await excuteAPICall('user/change-password', passwordData);
        if (res.status !== 200) {
            throw new Error('Failed to change password');
        }
        return 'Password change successful';
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};
