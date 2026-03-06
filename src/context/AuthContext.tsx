'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
    id: string;
    _id?: string;
    name: string;
    username: string;
    image?: string;
    isVerified?: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);

        // Refresh user data from server in background
        if (storedToken) {
            refreshUserData(storedToken);
        }
    }, []);

    const refreshUserData = async (authToken: string) => {
        try {
            const baseUrl = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/settings/me`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await response.json();

            if (data?.success && data?.data?.user) {
                const freshUser = data.data.user;
                setUser(prev => {
                    if (!prev) return prev;
                    const merged = { ...prev };
                    if (freshUser.name) merged.name = freshUser.name;
                    if (freshUser.username) merged.username = freshUser.username;
                    if (freshUser.isVerified !== undefined) merged.isVerified = freshUser.isVerified;
                    if (freshUser.image && typeof freshUser.image === 'string') {
                        merged.image = freshUser.image;
                    }
                    localStorage.setItem('user', JSON.stringify(merged));
                    return merged;
                });
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
        }
    };

    const login = (newToken: string, userData: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        // Ensure API client has the token
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    const logout = async () => {
        try {
            // Ensure the API client uses the current token for the logout request
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            router.push('/login');
        }
    };

    const updateUser = (userData: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...userData };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    const refreshUser = async () => {
        const currentToken = token || localStorage.getItem('token');
        if (currentToken) {
            await refreshUserData(currentToken);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
