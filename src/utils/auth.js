export const refreshAccessToken = async (refreshToken, headers) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_USER_REFRESH_TOKEN, {
        method: 'POST',
        headers,
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      return data.accessToken; 
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
};