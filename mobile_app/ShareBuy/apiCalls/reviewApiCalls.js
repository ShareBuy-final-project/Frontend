import { excuteAPICallPOST, excuteAPICallGET } from './apiCallWrapper';

/**
 * Get business details by name.
 * @param {string} businessName
 * @returns {Promise<Object>} business object
 */
export const getBusinessByNumber = async (businessNumber) => {
  try {
    const res = await excuteAPICallGET(`user/get?businessNumber=${businessNumber}`);
    if (res.status !== 200) {
      throw new Error('Business not found');
    }
    return res.data;
  } catch (error) {
    console.error('Error fetching business by number:', error);
    throw error;
  }
}

/**
 * Submit a new review for a business.
 * @param {Object} reviewData - { businessNumber, userEmail, rating, reviewText }
 * @returns {Promise<Object>} the created review
 */
export const submitReview = async (reviewData) => {
    try {
      const res = await excuteAPICallPOST('user/review', reviewData);
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed to submit review');
      }
      return res.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };
  
