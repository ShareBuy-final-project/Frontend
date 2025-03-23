import { excuteAPICallPOST, excuteAPICallGET } from './apiCallWrapper';

/**
 * Create a new group
 * @param {Object} groupData - Data for the new group
 * @returns {Promise<Object>} - The newly created group
 */
export const createGroup = async (groupData) => {
  try {
    const res = await excuteAPICallPOST('group/create', groupData);
    if (res.status !== 201) {
      throw new Error('Failed to create group');
    }
    return res.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

/**
 * Get a group by ID
 * @param {String} groupId - ID of the group to fetch
 * @returns {Promise<Object>} - The requested group
 */
export const getGroupById = async (groupId) => {
  try {
    const res = await excuteAPICallGET(`group/get?id=${groupId}`);
    if (res.status !== 200) {
      throw new Error('Failed to fetch group');
    }
    return res.data;
  } catch (error) {
    console.error('Error fetching group:', error);
    throw error;
  }
};

/**
 * Get saved groups for a user
 * @param {Number} [page=1] - Page number
 * @param {Number} [limit=10] - Number of groups per page
 * @returns {Promise<Object[]>} - List of saved groups
 */
export const getSavedGroups = async (page = 1, limit = 10) => {
  try {
    const res = await excuteAPICallPOST('group/getSavedGroups', {
      page,
      limit,
    });
    console.log("saved", res.data);

    if (res.status !== 200) {
      throw new Error('Failed to fetch deals');
    }

    return res.data;
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
};



/**
 * Save a group for a user
 * @param {String} groupId - ID of the group to save
 * @returns {Promise<void>} - Success or failure
 */
export const saveGroup = async (groupId) => {
  try {
    const res = await excuteAPICallPOST('group/saveGroup', { groupId });
    if (res.status !== 200) {
      throw new Error('Failed to save group');
    }
  } catch (error) {
    console.error('Error saving group:', error);
    throw error;
  }
};

/**
 * Save a group for a user
 * @param {String} groupId - ID of the group to save
 * @returns {Promise<void>} - Success or failure
 */
export const unSaveGroup = async (groupId) => {
  try {
    const res = await excuteAPICallPOST('group/unSaveGroup', { groupId });
    if (res.status !== 200) {
      throw new Error('Failed to unsave group');
    }
  } catch (error) {
    console.error('Error unsaving group:', error);
    throw error;
  }
};


/**
 * Join a group
 * @param {String} groupId - ID of the group to join
 * @param {Number} amount - Amount the user wants to buy from the group deal
 * @returns {Promise<void>} - Success or failure
 */
export const joinGroup = async (groupId, amount) => {
  try {
    const res = await excuteAPICallPOST('group/joinGroup', { groupId, amount });
    if (res.status !== 200) {
      throw new Error('Failed to join group');
    }
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};

/**
 * Leave a group
 * @param {String} groupId - ID of the group to leave
 * @returns {Promise<void>} - Success or failure
 */
export const leaveGroup = async (groupId) => {
  try {
    const res = await excuteAPICallPOST('group/leaveGroup', { groupId });
    if (res.status !== 200) {
      throw new Error('Failed to leave group');
    }
  } catch (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
};

/**
 * Get business history
 * @returns {Promise<Object[]>} - List of business history groups
 */
export const getBusinessHistory = async () => {
  try {
    const res = await excuteAPICallPOST('group/businessHistory');
    if (res.status !== 200) {
      throw new Error('Failed to fetch business history');
    }
    return res.data;
  } catch (error) {
    console.error('Error fetching business history:', error);
    throw error;
  }
};

/**
 * Fetch groups based on filters and pagination
 * @param {Object} filters - Filters for searching groups
 * @param {Number} [page=1] - Page number
 * @param {Number} [limit=10] - Number of groups per page
 * @returns {Promise<Object[]>} - List of groups matching the search criteria
 */
export const fetchDeals = async (filters = {}, page = 1, limit = 10) => {
  try {
    const res = await excuteAPICallPOST('group/getPage', {
      filters,
      page,
      limit,
    });

    if (res.status !== 200) {
      throw new Error('Failed to fetch deals');
    }

    return res.data;
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
};

/**
 * Get history groups of a user
 * @param {Number} [page=1] - Page number
 * @param {Number} [limit=10] - Number of groups per page
 * @returns {Promise<Object[]>} - List of saved groups
 */
export const getUserHistory = async (page = 1, limit = 10) => {
  try {
    const res = await excuteAPICallPOST('group/getUserHistory', {
      page,
      limit,
    });

    if (res.status !== 200) {
      throw new Error('Failed to fetch history deals');
    }

    return res.data;
  } catch (error) {
    console.error('Error fetching history deals:', error);
    throw error;
  }
};

/**
 * Get current groups of a user
 * @param {Number} [page=1] - Page number
 * @param {Number} [limit=10] - Number of groups per page
 * @returns {Promise<Object[]>} - List of saved groups
 */
export const getUserCurrentGroups = async (page = 1, limit = 10) => {
  try {
    const res = await excuteAPICallPOST('group/getUserGroups', {
      page,
      limit,
    });

    if (res.status !== 200) {
      throw new Error('Failed to fetch user current deals');
    }

    return res.data;
  } catch (error) {
    console.error('Error fetching user current  deals:', error);
    throw error;
  }
};

export const getBuisnessCurrentGroups = async (page = 1, limit = 10) => {
  try {
    const res = await excuteAPICallPOST('group/getBuisnessGroups', {
      page,
      limit,
    });

    if (res.status !== 200) {
      throw new Error('Failed to fetch user current deals');
    }

    return res.data;
  } catch (error) {
    console.error('Error fetching user current  deals:', error);
    throw error;
  }
};


export const createPaymentIntent = async (groupId, amount) => {
  try{
      const res = await excuteAPICallPOST('group/joinGroup', {groupId, amount});
      if (res.status !== 200) {
        throw new Error('Creating payment intent failed');
      }
      return res.data;
  } 
  catch(error) {
    
      console.log('Creating payment intent failed', error.response.data.error);
      return {error: error.response.data.error};
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


