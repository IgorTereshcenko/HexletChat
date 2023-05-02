import { fetchChannels } from "../services/dataService";
import {useDispatch, useSelector} from 'react-redux'
import { useEffect } from "react";
import useAuth from "../context/Auth";
import {setCurrentChannel} from '../store/slice/channelsSlice';
import { addCurrentChannelMessages } from "../store/slice/messagesSlice";
import Dropdown from 'react-bootstrap/Dropdown';
import { animateScroll } from 'react-scroll';

const ChanelBox = ({handleModal}) => {

    const {channels,isLoading,error,currentChannelId} = useSelector(state => state.channelsReducer);
  
    const dispath = useDispatch();
  
    const auth = useAuth();

    useEffect(() => {
        dispath(fetchChannels(auth.getAuthHeader()));
    },[auth,dispath])

    useEffect(() => {
        animateScroll.scrollToBottom({containerId: 'channel-box', delay: 0, duration: 0});
    },[channels.length])

    const handleChooseChannel = (channelId) => {
        dispath(setCurrentChannel(channelId));
        dispath(addCurrentChannelMessages(channelId));
    };

    if(isLoading) {
        return  <h1>loading</h1>
    } else if (error) {
        return <h1>error</h1>
    }

    return (
        <div 
            className="col-2 border-end bg-light flex-column pt-3 d-flex align-items-center"
            style={{ overflowY: 'auto', maxHeight: '650px' }}
            id="channel-box">
            <div className="d-flex mb-3 w-100 justify-content-between">
                Каналы
                <button 
                    onClick={() => handleModal('main')} 
                    className="p-0 text-primary btn btn-group-vertical">
                        +
                </button>
            </div>
            {channels.map(channel =>
                <div className="w-100 d-flex justify-content-between" key={channel.id}>
                    <button 
                        className={currentChannelId === channel.id ? "w-100 rounded-0 text-center btn btn-secondary" : "w-100 rounded-0 text-center btn btn-light"} 
                        onClick={() => handleChooseChannel(channel.id)}>
                            <span className="text-break">{channel.name}</span>
                    </button>
                    {channel.removable && currentChannelId === channel.id ? 
                         <Dropdown>
                            <Dropdown.Toggle variant="secondary rounded-0" id="dropdown-basic"></Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleModal('remove')} href="#/action-1">Удалить</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleModal('rename')} href="#/action-2">Переименовать</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    : null
                    }
                </div>      
            )}
        </div>
    )
}

export default ChanelBox;