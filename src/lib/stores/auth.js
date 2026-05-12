import { writable } from 'svelte/store';
import api from '../api.js';
import { push } from 'svelte-spa-router';

function createAuthStore() {
    const storedUser = localStorage.getItem('auth_user');
    const initialState = storedUser ? JSON.parse(storedUser) : null;

    const { subscribe, set } = writable(initialState);

    return {
        subscribe,
        set,
        login: async (email, password) => {
            await api.get('/sanctum/csrf-cookie');
            const response = await api.post('/login', { email, password });
            
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('auth_user', JSON.stringify(response.data.user));
            
            set(response.data.user);
            push('/dashboard');
        },
        register: async (data) => {
            await api.get('/sanctum/csrf-cookie');
            const response = await api.post('/register', data);
            
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('auth_user', JSON.stringify(response.data.user));
            
            set(response.data.user);
            push('/dashboard');
        },
        logout: async () => {
            await api.post('/logout');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            set(null);
            push('/login');
        }
    };
}

export const auth = createAuthStore();

export const login = (email, password) => auth.login(email, password);
export const register = (data) => auth.register(data);
export const logout = () => auth.logout();