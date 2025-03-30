import { excuteAPICallPOST, excuteAPICallGET } from './apiCallWrapper';
import { io } from 'socket.io-client';

/**
 * Create a new group
 * @param {Object} groupData - Data for the new group
 * @returns {Promise<Object>} - The newly created group
 */
export const getMyChats = async () => {
  try {
    const res = await excuteAPICallGET('chat/getGroupChatsOfUser');
    if (res.status !== 200) {
      throw new Error('Failed to fetch chats');
    }
    return res.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

/**
 * Get a group by ID
 * @param {String} groupId - ID of the group to fetch its chat
 * @returns {Promise<Object>} - The requested chat
 */
export const getChatById = async (groupId, pageNumber = 1) => {
  try {
    const res = await excuteAPICallPOST('chat/group/getGroupChat',{groupId, pageNumber});
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
 * @param {Number} groupId - ID of the group to send message to
 * @param {String} message - Message to send
 * @returns {Promise<Object[]>} - groups chat messages
 */
export const sendMessage = async (groupId, message) => {
  try {
    const res = await excuteAPICallPOST('chat/sendMessage', {
      groupId,
      message,
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



