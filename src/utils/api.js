import axios from 'axios';

// Debug logging function
const logApiCall = (method, url, data = null, error = null) => {
  console.group(`📡 API ${method.toUpperCase()} ${url}`);
  
  if (data) {
    console.log('Data:', data);
  }
  
  if (error) {
    console.error('Error:', error);
  }
  
  console.groupEnd();
};

// Configure API URL with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

console.log('🔗 API URL configured as:', API_URL);

// Create an Axios instance with common configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Debug mode for development
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    logApiCall(config.method, config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { config, response } = error;
    
    if (response) {
      logApiCall(config.method, config.url, null, `Status: ${response.status} - ${response.statusText}`);
    } else if (error.request) {
      logApiCall(config.method, config.url, null, 'No response received');
    } else {
      logApiCall(config.method, config.url, null, error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with non-2xx status
    console.error('Response data:', error.response.data);
    console.error('Status:', error.response.status);
    return {
      error: error.response.data.message || 'An error occurred with the request',
      status: error.response.status
    };
  } else if (error.request) {
    // Request was made but no response received
    console.error('No response received:', error.request);
    return {
      error: 'Server did not respond. Please check your network connection.',
      status: 0
    };
  } else {
    // Error in setting up request
    console.error('Request setup error:', error.message);
    return {
      error: 'Error setting up request: ' + error.message,
      status: -1
    };
  }
};

// EXHIBITS API
export const getExhibits = async () => {
  try {
    return await api.get('/exhibits');
  } catch (error) {
    console.error('Failed to fetch exhibits:', error);
    throw error;
  }
};

export const getExhibitById = async (id) => {
  try {
    return await api.get(`/exhibits/${id}`);
  } catch (error) {
    console.error(`Error fetching exhibit ${id}:`, error);
    throw error;
  }
};

export const createExhibit = async (formData) => {
  try {
    const response = await api.post('/exhibits', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating exhibit:', error);
    throw error;
  }
};

export const updateExhibit = async (id, formData) => {
  try {
    const response = await api.put(`/exhibits/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating exhibit ${id}:`, error);
    throw error;
  }
};

export const deleteExhibit = async (id) => {
  try {
    return await api.delete(`/exhibits/${id}`);
  } catch (error) {
    console.error(`Error deleting exhibit ${id}:`, error);
    throw error;
  }
};

// GAMES API
export const getGames = async () => {
  try {
    return await api.get('/games');
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const getGameById = async (id) => {
  try {
    return await api.get(`/games/${id}`);
  } catch (error) {
    console.error(`Error fetching game ${id}:`, error);
    throw error;
  }
};

export const createGame = async (gameData) => {
  try {
    return await api.post('/games', gameData);
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

export const updateGame = async (id, gameData) => {
  try {
    return await api.put(`/games/${id}`, gameData);
  } catch (error) {
    console.error(`Error updating game ${id}:`, error);
    throw error;
  }
};

export const deleteGame = async (id) => {
  try {
    return await api.delete(`/games/${id}`);
  } catch (error) {
    console.error(`Error deleting game ${id}:`, error);
    throw error;
  }
};

// QUIZZES API
export const getQuizzes = async () => {
  try {
    return await api.get('/quizzes');
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

export const getQuizById = async (id) => {
  try {
    return await api.get(`/quizzes/${id}`);
  } catch (error) {
    console.error(`Error fetching quiz ${id}:`, error);
    throw error;
  }
};

export const createQuiz = async (quizData) => {
  try {
    return await api.post('/quizzes', quizData);
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

export const updateQuiz = async (id, quizData) => {
  try {
    return await api.put(`/quizzes/${id}`, quizData);
  } catch (error) {
    console.error(`Error updating quiz ${id}:`, error);
    throw error;
  }
};

export const deleteQuiz = async (id) => {
  try {
    return await api.delete(`/quizzes/${id}`);
  } catch (error) {
    console.error(`Error deleting quiz ${id}:`, error);
    throw error;
  }
};

// REVIEWS API
export const getReviews = async () => {
  try {
    return await api.get('/reviews');
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getAdminReviews = async () => {
  try {
    return await api.get('/reviews/admin');
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    console.log('Creating review with data:', reviewData);
    
    // Ensure the review data is properly formatted for the API
    const formattedData = {
      name: reviewData.name,
      comment: reviewData.text || reviewData.comment, // Используем text как comment
      rating: reviewData.rating,
      // Обрабатываем изображения
      images: reviewData.images ? reviewData.images : null,
      // Add approved status if not present (defaults to false/pending)
      approved: false,
      status: 'pending',
      // Ensure createdAt is set if not already
      createdAt: new Date().toISOString()
    };
    
    console.log('Sending formatted review data:', formattedData);
    const response = await api.post('/reviews', formattedData);
    console.log('Review creation API response:', response);
    return response; // Return the response directly
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

/**
 * Обновляет статус отзыва (одобрить/отклонить)
 * @param {number} id - ID отзыва
 * @param {string} status - Новый статус ('approved', 'rejected')
 */
export const updateReviewStatus = async (id, status) => {
  console.log(`Updating review ${id} status to: ${status}`);
  const approved = status === 'approved';
  const data = { status, approved };
  try {
    const response = await api.patch(`/reviews/${id}/status`, data);
    console.log('API Response for review status update:', response.data);
    return response.data;
  } catch (error) {
    logApiCall('PATCH', `/reviews/${id}/status`, data, error.response);
    console.error(`Error updating review status ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteReview = async (id) => {
  try {
    return await api.delete(`/reviews/${id}`);
  } catch (error) {
    console.error(`Error deleting review ${id}:`, error);
    throw error;
  }
};

export const getFeaturedExhibits = async () => {
  try {
    const response = await api.get('/exhibits/featured');
    return response;
  } catch (error) {
    console.error('Error fetching featured exhibits:', error);
    throw error;
  }
};

export const getExhibitsByCategory = async (category) => {
  try {
    const response = await api.get(`/exhibits/category/${category}`);
    return response;
  } catch (error) {
    console.error(`Error fetching exhibits in category ${category}:`, error);
    throw error;
  }
};

export default api; 