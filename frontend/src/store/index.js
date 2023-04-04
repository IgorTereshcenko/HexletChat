import {configureStore, combineReducers} from '@reduxjs/toolkit';
import channelsReducer from './slice/channelsSlice';
import messagesReducer from './slice/messagesSlice';

const rootReducers = combineReducers({
    channelsReducer,
    messagesReducer
})

export const store = configureStore({
    reducer: rootReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
})