import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice.js';

export const store = configureStore({
    reducer : {},
    // middleware : (getDefaultMiddleware) => {
    //     getDefaultMiddleware({
    //         serializableCheck : false,
    //     });
    // }
});