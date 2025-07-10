// Utility functions for authenticated fetch with automatic JWT refresh

// Single-flight promise for token refresh
let refreshPromise = null;

// Refresh the access token using the refresh token
export async function refreshAccessToken() {
  if (window.isLoggingOut) return null; // Prevent refresh during logout
  const refreshToken = localStorage.getItem('refresh');
  if (!refreshToken) return null;

  // If a refresh is already in progress, return the same promise
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const response = await fetch('/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access', data.access);
      refreshPromise = null;
      return data.access;
    } else {
      // Refresh token expired or invalid
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      refreshPromise = null;
      // Optionally redirect to login
      window.location.href = '/login';
      return null;
    }
  })();

  return refreshPromise;
}

// Authenticated fetch with automatic token refresh and retry
export async function authFetch(url, options = {}) {
  if (window.isLoggingOut) return new Response(null, { status: 401 }); // Block requests during logout
  let accessToken = localStorage.getItem('access');
  const isFormData = options.body instanceof FormData;
  options.headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${accessToken}`,
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    // Try to refresh the token (single-flight)
    accessToken = await refreshAccessToken();
    if (!accessToken) return response; // User must log in again

    // Retry the original request with new token
    options.headers['Authorization'] = `Bearer ${accessToken}`;
    response = await fetch(url, options);
  }

  return response;
} 