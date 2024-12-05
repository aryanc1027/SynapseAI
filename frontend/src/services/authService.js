import { API_BASE_URL } from ".";

export const authService = {
    async register(userData) {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }
  
      return await response.json();
    },
    async login(credentials) {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(credentials),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      localStorage.setItem('authToken', data.access_token);

      return data;
    },
    logout() {
      localStorage.removeItem('authToken');
      console.log('Logout successful');
    },
    async getCurrentUser() {
      const token = localStorage.getItem('authToken');
      console.log('Token:', token);
      if (!token) throw new Error('No token found');
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error('Failed to fetch user data');
  
      return await response.json();
    },
  };  