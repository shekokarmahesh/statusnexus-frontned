/**
 * Application configuration
 */

// For Vite projects, we need to use import.meta.env instead of process.env
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Other configuration variables can be added here
export const APP_NAME = 'UpTime App';