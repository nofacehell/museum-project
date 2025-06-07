// src/utils/api.js
import axios from 'axios'
import { API_URL, IS_DEV } from './config'

// утилита логирования
const logApi = IS_DEV
  ? (method, url, msg, data) => {
      console.group(`📡 ${method.toUpperCase()} ${url}`)
      if (msg) console.log(msg)
      if (data) console.log('Data:', data)
      console.groupEnd()
    }
  : () => {}

// создаём axios‑инстанс
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15_000,
  withCredentials: true,
})

// логируем все исходящие запросы
api.interceptors.request.use(cfg => {
  // Ensure the URL starts with /api for non-upload requests
  if (!cfg.url.startsWith('/uploads')) {
    cfg.url = cfg.url.startsWith('/') ? cfg.url : `/${cfg.url}`
  }
  logApi(cfg.method, cfg.url, '→ Request', cfg.data)
  return cfg
})

// логируем ответы и сразу отдаем тело
api.interceptors.response.use(
  res => {
    logApi(res.config.method, res.config.url, '← Response', res.data)
    return res.data
  },
  err => {
    const { config, response, request, message } = err
    if (response) {
      logApi(config.method, config.url, `✖ Status ${response.status}`, response.data)
    } else if (request) {
      logApi(config.method, config.url, '✖ No response received')
    } else {
      logApi(config.method, config.url, `✖ Axios error: ${message}`)
    }
    return Promise.reject(err)
  }
)

function handleError(err) {
  console.error('API Error:', err)
  throw err
}

// ——— EXHIBITS —————————————————————————————
export const getExhibits = async () => {
  try { return await api.get('/exhibits') }
  catch (e) { handleError(e) }
}

export const getExhibitById = async id => {
  try { return await api.get(`/exhibits/${id}`) }
  catch (e) { handleError(e) }
}

export const createExhibit = async (formData) => {
  try {
    const response = await fetch('/api/exhibits', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error('Failed to create exhibit');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating exhibit:', error);
    throw error;
  }
};

export const updateExhibit = async (id, formData) => {
  try {
    const response = await fetch(`/api/exhibits/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update exhibit');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating exhibit:', error);
    throw error;
  }
};

export const getExhibit = async (id) => {
  try {
    const response = await fetch(`/api/exhibits/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exhibit');
    }

    const data = await response.json();
    
    // Parse JSON fields
    return {
      ...data,
      technical_specs: typeof data.technical_specs === 'string' 
        ? JSON.parse(data.technical_specs) 
        : data.technical_specs,
      additional_images: typeof data.additional_images === 'string'
        ? JSON.parse(data.additional_images)
        : data.additional_images,
      interesting_facts: typeof data.interesting_facts === 'string'
        ? JSON.parse(data.interesting_facts)
        : data.interesting_facts,
    };
  } catch (error) {
    console.error('Error fetching exhibit:', error);
    throw error;
  }
};

export const toggleFeatured = async (id) => {
  try {
    const response = await fetch(`/api/exhibits/${id}/toggle-featured`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to toggle featured status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling featured status:', error);
    throw error;
  }
};

export const deleteExhibit = async id => {
  try {
    await api.delete(`/exhibits/${id}`)
    return { success: true }
  } catch (e) {
    console.warn(`Failed to delete exhibit ${id}`, e)
    return { success: false, error: e.message }
  }
}

// ——— GAMES ———————————————————————————————
export const getGames = async () => {
  try { return await api.get('/games') }
  catch (e) { handleError(e) }
}

export const getGameById = async id => {
  try { return await api.get(`/games/${id}`) }
  catch (e) { handleError(e) }
}

export const createGame = async data => {
  try { return await api.post('/games', data) }
  catch (e) { handleError(e) }
}

export const updateGame = async (id, data) => {
  try { return await api.put(`/games/${id}`, data) }
  catch (e) { handleError(e) }
}

export const deleteGame = async id => {
  try {
    await api.delete(`/games/${id}`)
    return { success: true }
  } catch (e) {
    console.warn(`Failed to delete game ${id}`, e)
    return { success: false, error: e.message }
  }
}

// ——— QUIZZES —————————————————————————————
export const getQuizzes = async () => {
  try { return await api.get('/quizzes') }
  catch (e) { handleError(e) }
}

export const fetchQuiz = async (id) => {
  try { return await api.get(`/quizzes/${id}`) }
  catch (e) { handleError(e) }
}

export const getQuizById = async id => {
  try { return await api.get(`/quizzes/${id}`) }
  catch (e) { handleError(e) }
}

export const createQuiz = async data => {
  try { return await api.post('/quizzes', data) }
  catch (e) { handleError(e) }
}

export const updateQuiz = async (id, data) => {
  try { return await api.put(`/quizzes/${id}`, data) }
  catch (e) { handleError(e) }
}

export const deleteQuiz = async id => {
  try {
    await api.delete(`/quizzes/${id}`)
    return { success: true }
  } catch (e) {
    console.warn(`Failed to delete quiz ${id}`, e)
    return { success: false, error: e.message }
  }
}

// ——— REVIEWS —————————————————————————————
export const getReviews = async () => {
  try { return await api.get('/reviews') }
  catch (e) { handleError(e) }
}

export const getAdminReviews = async () => {
  try { 
    const result = await api.get('/reviews/admin');
    console.log('Admin reviews API response:', result);
    return result;
  }
  catch (e) { 
    console.error('Error in getAdminReviews:', e);
    handleError(e);
    return []; // Return empty array instead of undefined
  }
}

export const createReview = async data => {
  try {
    const config = data instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};
    return await api.post('/reviews', data, config);
  } catch (e) { 
    handleError(e) 
  }
}

export const updateReviewStatus = async (reviewId, status) => {
  try {
    const response = await api.patch(`/reviews/${reviewId}/status`, {
      status: status
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ——— CATEGORIES ——————————————————————————
export const getCategories = async () => {
  try { return await api.get('/categories') }
  catch (e) { handleError(e) }
}

export const getCategoryById = async id => {
  try { return await api.get(`/categories/${id}`) }
  catch (e) { handleError(e) }
}

export const createCategory = async data => {
  try { return await api.post('/categories', data) }
  catch (e) { handleError(e) }
}

export const updateCategory = async (id, data) => {
  try { return await api.put(`/categories/${id}`, data) }
  catch (e) { handleError(e) }
}

export const deleteCategory = async id => {
  try {
    await api.delete(`/categories/${id}`)
    return { success: true }
  } catch (e) {
    console.warn(`Failed to delete category ${id}`, e)
    return { success: false, error: e.message }
  }
}

// (при необходимости) экспорт самого инстанса:
export default api
