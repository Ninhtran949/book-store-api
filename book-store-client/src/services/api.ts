import { API_BASE_URL } from '../utils/constant';

export const fetchWithToken = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = sessionStorage.getItem('accessToken');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Network response was not ok');
    }

    return response.json();
};

export default fetchWithToken;