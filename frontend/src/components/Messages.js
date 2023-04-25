import {useSelector, useDispatch} from 'react-redux'
import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { webSocket } from "../webSocket";
import useAuth from '../context/Auth';
import { addCurrentChannelMessages } from '../store/slice/messagesSlice';
import { getCurrentChannel } from '../store/slice/channelsSlice';
import { animateScroll } from 'react-scroll';

const Messages = () => {
    
    const {currentChannelMessages,messages} = useSelector(state => state.messagesReducer);
    const {currentChannelId,currentChannel,channels} = useSelector(state => state.channelsReducer);

    const { user: { username } } = useAuth();

    const inputRef = useRef(null);

    const dispath = useDispatch();

    const {sendMessage} = webSocket();

    useEffect(() => {
        dispath(addCurrentChannelMessages(currentChannelId));
    },[messages])

    useEffect(() => {
        dispath(getCurrentChannel());
        inputRef.current.focus();
    },[currentChannelId,channels])

    useEffect(() => {
        animateScroll.scrollToBottom({containerId: 'messages-box', delay: 0, duration: 0});
    },[currentChannelMessages.length])
  
    const formik = useFormik({
        initialValues: { body: '' },
        onSubmit: async ({ body }) => {
            const message = {
                body,
                chanellId: currentChannelId,
                username
              };
            try {
                await sendMessage(message);
                formik.resetForm();
            } catch(err) {
                console.log(err);
            }   
        },
    });

    function getMessageEnding(count) {

        const remainder10 = count % 10;
        const remainder100 = count % 100;
      
        if (remainder10 === 1 && remainder100 !== 11) {
            return "сообщение";
        } else if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 12 || remainder100 > 14)) {
            return "сообщения";
        } else {
            return "сообщений";
        }
    }

    const ending = getMessageEnding(messages.length);

    return (
        <div className='card col-10 d-flex flex-column px-0'>
            <div className="card-header text-left d-flex flex-column">
                    <strong>{currentChannel?.name}</strong>
                    <span className='text-muted'>{messages.length + " " + ending}</span>
            </div>
            <div id="messages-box" className="row mx-4 mt-3 chat-messages" style={{ overflowY: 'auto', maxHeight: '550px' }}>
                {currentChannelMessages.map(message =>
                    <div className='text-break' key={message.id}>
                        <span>{`${message.username}: ${message.body}`}</span>
                    </div>  
                )}
            </div>
            <div className="row mt-auto pb-2 d-flex justify-content-center">
                <Form className='col-10' onSubmit={formik.handleSubmit}>
                    <InputGroup>
                        <Form.Control
                            className="col-6"
                            name="body"
                            value={formik.values.body}
                            onChange={formik.handleChange}
                            required 
                            type="text"
                            ref={inputRef} 
                            placeholder="Enter message"/>
                        <Button disabled={!formik.values.body} variant="dark" type="submit">отправить</Button>
                    </InputGroup>          
                </Form>
            </div>
        </div>
    )
}

export default Messages;