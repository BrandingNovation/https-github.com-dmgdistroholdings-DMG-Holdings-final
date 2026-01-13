import { SiteData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * API Service for backend database operations
 * Falls back to IndexedDB if API is unavailable
 */

export const apiService = {
  // Load site data from API
  async loadSiteData(): Promise<SiteData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/site-data`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (error) {
      console.warn('API unavailable, will use fallback:', error);
      return null;
    }
  },

  // Save site data to API
  async saveSiteData(data: SiteData): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/site-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save to API:', error);
      return false;
    }
  },

  // Check if API is available
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // Authentication
  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },

  // Update password
  async updatePassword(username: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, currentPassword, newPassword }),
      });

      return response.ok;
    } catch (error) {
      console.error('Password update failed:', error);
      return false;
    }
  },
};
