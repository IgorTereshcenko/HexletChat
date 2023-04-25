import {createSlice} from '@reduxjs/toolkit'
import { fetchChannels } from '../../services/dataService'

const initialState = {
    channels: [],
    isLoading: false,
    error: '',
    currentChannelId: 1,
    currentChannel:{},
    unique:false
}

const dataSlice = createSlice({
    name: 'channels',
    initialState,
    reducers:{
        getCurrentChannel(state) {
            state.currentChannel = state.channels.find(channel => channel.id === state.currentChannelId);
        },
        setCurrentChannel(state,action) {
            state.currentChannelId = action.payload;
        },
        addChannel(state,action) {
            state.channels.push(action.payload);
        },
        deleteChannel(state,action) {
            state.channels = state.channels.filter(channel => channel.id !== action.payload);
        },
        renameChannel(state,{payload}) {
            const { channelId, channelName } = payload;
            const channel = state.channels.find(channel => channel.id === channelId)
            channel.name = channelName;
        },
        isUniqueChannelName(state,action) {
            const existingChannel = state.channels.find(channel => channel.name === action.payload);
            state.unique = !existingChannel;   
        }
    },
    extraReducers:(builder) => {
        builder.addCase(fetchChannels.pending,(state) => {
            state.isLoading = true
        })
        builder.addCase(fetchChannels.fulfilled,(state,action) => {
            state.isLoading = false,
            state.channels = action.payload,
            state.error = ''
        })
        builder.addCase(fetchChannels.rejected,(state,action) => {
            state.isLoading = false,
            state.error = action.payload
        })
    }
})

const {actions, reducer} = dataSlice;
export default reducer;
export const {
    setCurrentChannel,
    addChannel,
    deleteChannel,
    renameChannel,
    getCurrentChannel,
    isUniqueChannelName} = actions;