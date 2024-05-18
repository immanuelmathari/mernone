import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    loading : false,
    error : null,
};

const userSlice = createSlice({
    name : 'User',
    initialState,
    reducers : {
        signinStart : (state) => {
            state.loading = true;
        },
        signinSuccess : (state,action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signinFailure : (state,action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart : (state) => {
            state.loading = true;
        },
        updateUserSuccess : (state,action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure : (state,action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {signinStart,signinSuccess,signinFailure,updateUserStart,updateUserSuccess,updateUserFailure} = userSlice.actions;
export default userSlice.reducer;