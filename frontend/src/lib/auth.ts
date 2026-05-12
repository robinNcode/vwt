import api from './axios';

export interface User {
    id: number;
    name: string;
    email: string;
    type: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

export const authService = {
    async login(email: string, password: string, type: string = 'admin'): Promise<AuthResponse> {
        const response = await api.post('/auth/login', { email, password, type });

        const data = response.data;
        if (data.success && data.data.token) {
            localStorage.setItem('vwt_token', data.data.token);
            localStorage.setItem('vwt_user', JSON.stringify(data.data.user));
        }
        return data;
    },

    logout() {
        localStorage.removeItem('vwt_token');
        localStorage.removeItem('vwt_user');
        window.location.href = '/login';
    },

    getToken(): string | null {
        return localStorage.getItem('vwt_token');
    },

    getUser(): User | null {
        const user = localStorage.getItem('vwt_user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};
