export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken')
  
    if (!token) throw new Error('No access token found')
  
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  }