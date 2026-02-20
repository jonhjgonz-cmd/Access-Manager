import { create } from 'zustand';

const useAuthStore = create((set) => ({
    isAuthenticated: localStorage.getItem('access_token') !== null,
    accessToken: localStorage.getItem('access_token') || null,
    login: (token) => {
        localStorage.setItem('access_token', token);
        set({ isAuthenticated: true, accessToken: token });
    },
    logout: () => {
        localStorage.removeItem('access_token');
        set({ isAuthenticated: false, accessToken: null });
    }
}));

export default useAuthStore;
