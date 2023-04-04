import { io } from 'socket.io-client';
import { addMessage } from '../store/slice/messagesSlice';
import { addChannel } from '../store/slice/channelsSlice';
import { setCurrentChannel } from '../store/slice/channelsSlice';
import { deleteChannel,renameChannel } from '../store/slice/channelsSlice';
import {store} from '../store/index';

const socket = io();

socket.on('newMessage', (payload) => {
    store.dispatch(addMessage(payload))
});

socket.on('newChannel', (payload) => {
    store.dispatch(addChannel(payload))
});

socket.on('removeChannel', (payload) => {
    store.dispatch(deleteChannel(payload))
});

socket.on('renameChannel', (payload) => {
    store.dispatch(renameChannel({
        channelId: payload.id,
        channelName: payload.name
    }))
});

export const webSocket = () => {
    
    const sendMessage = (message) => {
        socket.timeout(3000).emit('newMessage', message, (err, response) => {
            if (err) {
                console.log(err);
            }
            console.log(response.status);
        });
    };

    const createChannel = (channel) => {
        socket.timeout(3000).emit('newChannel', channel,(err,response) => {
            if (err) {
                console.log(err);
            }
            const { status, data } = response;
            console.log(status);
            store.dispatch(setCurrentChannel(data.id))
        })
    }

    const removeChannel = (channel) => {
        socket.timeout(3000).emit('removeChannel', channel, (err,response) => {
            if (err) {
                console.log(err);
            }
            store.dispatch(setCurrentChannel(1));
            console.log(response.status);
        })
    }

    const renameChannel = (channel) => {
        socket.timeout(3000).emit('renameChannel', channel, (err,response) => {
            if (err) {
                console.log(err);
            }
            console.log(response.status);
        })
    }

    return {sendMessage,createChannel,removeChannel,renameChannel};
};


