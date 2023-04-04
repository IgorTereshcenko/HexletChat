import {createSlice} from '@reduxjs/toolkit';
import { fetchMessages } from '../../services/dataService';

const initialState = {
    messages:[],
    isLoading: false,
    error: '',
    currentChannelMessages:[]
}

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers:{
        addMessage(state,action) {
            state.messages.push(action.payload);
        },
        addCurrentChannelMessages(state,action) {
            state.currentChannelMessages = [...state.messages];
            state.currentChannelMessages = state.currentChannelMessages.filter(message => message.chanellId === action.payload)
        }
    },
    extraReducers:(builder) => {
        builder.addCase(fetchMessages.pending,(state) => {
            state.isLoading = true;
        })
        builder.addCase(fetchMessages.fulfilled,(state) => {
            state.isLoading = false;
            state.error = '';
        })
        builder.addCase(fetchMessages.rejected,(state,action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

const {actions, reducer} = messagesSlice;
export default reducer;
export const {addMessage,addCurrentChannelMessages} = actions;