import { excuteAPICallPOST, excuteAPICallGET } from './apiCallWrapper';
import { io } from 'socket.io-client';

/**
 * Create a new group
 * @param {Object} groupData - Data for the new group
 * @returns {Promise<Object>} - The newly created group
 */
export const getMyChats = async () => {
  try {
    const res = await excuteAPICallGET('chat/group/getGroupChatsOfUser');
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
 * Get a group by ID with pagination and unread messages
 * @param {String} groupId - ID of the group to fetch its chat
 * @param {Number} page - Page number for pagination
 * @param {Number} limit - Number of messages per page
 * @returns {Promise<Object>} - The requested chat messages, including unread and read messages
 */
export const getChatById = async (groupId, page = 1, limit = 10) => {
  try {
    console.log('Fetching chat messages for group id:', groupId, 'Page:', page, 'Limit:', limit);
    const res = await excuteAPICallPOST('chat/group/getGroupChat', { groupId, page, limit });
    if (res.status !== 200) {
      throw new Error('Failed to fetch group chat messages');
    }
    return res.data; // Expecting { unreadMessages: [], readMessages: [] }
  } catch (error) {
    console.error('Error fetching group chat messages:', error);
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



