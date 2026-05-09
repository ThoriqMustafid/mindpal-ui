import { writable } from 'svelte/store';
import api from '../api.js';
import { push } from 'svelte-spa-router';

function createAuthStore() {
    const { subscribe, set } = writable(null);

    return {
        subscribe,
        set,
        login: async (email, password) => {
            await api.get('/sanctum/csrf-cookie');
            const response = await api.post('/login', { email, password });
            localStorage.setItem('auth_token', response.data.token);
            set(response.data.user);
            push('/dashboard');
        },
        register: async (data) => {
            await api.get('/sanctum/csrf-cookie');
            const response = await api.post('/register', data);
            localStorage.setItem('auth_token', response.data.token);
            set(response.data.user);
            push('/dashboard');
        },
        logout: async () => {
            await api.post('/logout');
            localStorage.removeItem('auth_token');
            set(null);
            push('/login');
        }
    };
}

export const auth = createAuthStore();

export const login = (email, password) => auth.login(email, password);
export const register = (data) => auth.register(data);
export const logout = () => auth.logout();
