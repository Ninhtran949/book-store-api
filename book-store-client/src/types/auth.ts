// filepath: /book-store-client/src/types/index.ts

export interface User {
    id: string;
    name: string;
    phoneNumber: string;
    address: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignupCredentials {
    name: string;
    phoneNumber: string;
    address: string;
    password: string;
}