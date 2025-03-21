import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null, // ✅ Set error to `null` instead of `false`
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null; // ✅ Reset error when a new login attempt starts
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null; // ✅ Clear error on successful login
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // ✅ Keep error message as a string
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // ✅ Keep error message as a string
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // ✅ Keep error message as a string
    },
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    updateProfilePictureStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProfilePictureSuccess: (state, action) => {
      if (state.currentUser) {
        state.currentUser.profilePicture = action.payload; // ✅ Update profile picture
      }
      state.loading = false;
      state.error = null;
    },
    updateProfilePictureFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // ✅ Store error message
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOut,
  updateProfilePictureStart,
  updateProfilePictureSuccess,
  updateProfilePictureFailure,
} = userSlice.actions;
export default userSlice.reducer;
