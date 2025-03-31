// Mock API endpoints
const API_BASE_URL = 'https://api.messagebottle.com/v1';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API service for wish bottle functionality
export const api = {
  // Send a wish to the server
  sendWish: async (wish) => {
    try {
      // Simulate API call
      await delay(1000);
      return {
        success: true,
        message: 'Wish sent successfully',
        data: {
          id: Date.now().toString(),
          ...wish,
          createTime: new Date().toISOString(),
        }
      };
    } catch (error) {
      throw new Error('Failed to send wish');
    }
  },

  // Get a random wish from the server
  getRandomWish: async () => {
    try {
      // Simulate API call
      await delay(1000);
      return {
        success: true,
        data: {
          id: Date.now().toString(),
          content: 'This is a random wish from another user',
          createTime: new Date().toISOString(),
          location: 'Somewhere in the world',
        }
      };
    } catch (error) {
      throw new Error('Failed to get random wish');
    }
  },

  // Get wishes count from server
  getWishesCount: async () => {
    try {
      // Simulate API call
      await delay(500);
      return {
        success: true,
        data: {
          totalWishes: Math.floor(Math.random() * 1000),
          activeUsers: Math.floor(Math.random() * 100),
        }
      };
    } catch (error) {
      throw new Error('Failed to get wishes count');
    }
  }
}; 