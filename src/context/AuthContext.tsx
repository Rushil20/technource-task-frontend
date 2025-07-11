import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { User } from '../types/user';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'http://localhost:3000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const res = await axios.post(`${API_BASE}/users/login`, { username, password });
            if (res.data && res.data.token && res.data.user) {
                setToken(res.data.token);
                setUser(res.data.user);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                return true;
            }
        } catch {
            // handle error
        }
        return false;
    };

    const register = async (username: string, password: string) => {
        try {
            const res = await axios.post(`${API_BASE}/users/register`, { username, password });
            return res.data && res.data.success;
        } catch {
            // handle error
        }
        return false;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value: AuthContextType = {
        user,
        token,
        isLoggedIn: !!token,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}; 