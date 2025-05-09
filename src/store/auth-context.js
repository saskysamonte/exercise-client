import React, { createContext, useContext, useMemo } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children, accessToken, refreshToken }) => {
    const headers = useMemo(() => ({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'app-refresh-token': refreshToken,
    }), [accessToken, refreshToken]);

    return (
        <AuthContext.Provider value={headers}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthHeaders = () => {
    return useContext(AuthContext); 
};