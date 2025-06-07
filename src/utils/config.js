// src/config.js

// Helper to strip leading and trailing slashes
const stripSlashes = (str) => str ? str.replace(/^\/+|\/+$/g, '') : '';

// Get base API URL from environment variables
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// API URL includes /api suffix
export const API_URL = `${API_BASE}/api`;

// Static URL is the base URL with /api prefix for static files
export const STATIC_URL = `${API_BASE}/api`;

// Debug flag
export const IS_DEV = import.meta.env.DEV;

/**
 * Get full URL for a static asset
 * @param {string} path - Path to the asset (e.g. '/uploads/exhibits/image.jpg')
 * @returns {string|null} Full URL to the asset
 */
export const getStaticUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Для dev-режима через Vite: просто /uploads/xxx.jpg
  if (path.startsWith('/uploads/')) {
    return path;
  }
  // Для production/SSR: полный путь
  const cleanPath = stripSlashes(path.replace(/^\/api/, ''));
  return `${STATIC_URL}/api/${cleanPath}`;
};
