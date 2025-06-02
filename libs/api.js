export async function fetchWithUserId(url, options = {}) {
  const userId = sessionStorage.getItem('user_id')
  
  // Merge headers
  const headers = {
    'Content-Type': 'application/json',
    'X-User-ID': userId,
    ...options.headers
  }

  // Merge options
  const fetchOptions = {
    ...options,
    headers
  }

  return fetch(url, fetchOptions)
}

export async function fetchWithUserIdAndBody(url, method, body, options = {}) {
  return fetchWithUserId(url, {
    method,
    body: JSON.stringify(body),
    ...options
  })
}

// Convenience methods
export const api = {
  get: (url, options) => fetchWithUserId(url, { ...options, method: 'GET' }),
  post: (url, body, options) => fetchWithUserIdAndBody(url, 'POST', body, options),
  put: (url, body, options) => fetchWithUserIdAndBody(url, 'PUT', body, options),
  delete: (url, options) => fetchWithUserId(url, { ...options, method: 'DELETE' })
} 