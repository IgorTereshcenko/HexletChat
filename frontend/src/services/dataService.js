import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const _defaultPath = '/api/v1/data';

export const fetchChannels = createAsyncThunk(
    'channels/fetchAll',
    async (token,thunkAPI) => {
        try {
            const response = await axios.get(_defaultPath, {headers: token});
            return response.data.channels;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const fetchMessages = createAsyncThunk(
    'messages/fetchAll',
    async (token,thunkAPI) => {
        try {
            const response = await axios.get(_defaultPath, {headers: token});
            return response.data.messages;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)