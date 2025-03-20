import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: null,  // ✅ Set error to `null` instead of `false`
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;  // ✅ Reset error when a new login attempt starts
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;  // ✅ Clear error on successful login
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;  // ✅ Keep error message as a string
        }
    }
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;
export default userSlice.reducer;
