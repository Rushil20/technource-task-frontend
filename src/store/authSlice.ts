import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    user: any;
    isLoggedIn: boolean;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload;
            state.isLoggedIn = !!action.payload;
        },
        setUser(state, action: PayloadAction<any>) {
            state.user = action.payload;
        },
        logout(state) {
            state.token = null;
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer; 