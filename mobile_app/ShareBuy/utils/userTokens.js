import * as SecureStore from 'expo-secure-store';

/**
 * Save a key-value pair to secure storage.
 * @param {string} key - The key to store the value under (type of token-'access token' or 'refresh token').
 * @param {string} value - The value to store.
 */
export async function saveToken(key, value) {
  try {
    console.log("key: ", key, "value: ", value);
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

/**
 * Retrieve a value from secure storage.
 * @param {string} key - The key to retrieve the value for.
 * @returns {Promise<string|null>} - The retrieved value or null if not found.
 */
export async function getToken(key) {
  return await SecureStore.getItemAsync(key);
}

/**
 * Delete a value from secure storage.
 * @param {string} key - The key to delete the value for.
 */
export async function deleteToken(key) {
  await SecureStore.deleteItemAsync(key);
}

/**
 * Delete all tokens from secure storage.
 */
export async function deleteAllTokens() {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}

/**
 * Check if the user is logged in.
 * @returns {Promise<boolean>} - True if the user is logged in, false otherwise.
 */
export async function isLoggedIn() {
  const accessToken = await getToken('accessToken');

  return accessToken !== null;
}