import { fetchWithToken } from './api';
import { AuthResponse } from '../types/auth';
import { LOGIN_ENDPOINT, SIGNUP_ENDPOINT, LOGOUT_ENDPOINT } from '../utils/constant';

export const login = async (username: string, password: string): Promise<string> => {
    const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    sessionStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
};

interface SignUpResponse {
    success: boolean;
    message: string;
}

export const signUp = async (
    name: string, 
    phone: string, 
    address: string, 
    password: string
): Promise<boolean> => {
    const response = await fetchWithToken<SignUpResponse>(SIGNUP_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ 
            name, 
            phoneNumber: phone, 
            address, 
            password,
            id: phone 
        }),
    });

    return response.success;
};

export const logout = async (): Promise<void> => {
    await fetchWithToken<void>(LOGOUT_ENDPOINT, {
        method: 'POST',
        credentials: 'include',
    });
    sessionStorage.removeItem('accessToken');
};