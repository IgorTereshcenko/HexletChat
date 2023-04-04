import {useSelector, useDispatch} from 'react-redux'
import { useEffect } from 'react';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { webSocket } from "../webSocket";
import useAuth from '../context/Auth';
import { addCurrentChannelMessages } from '../store/slice/messagesSlice';

const Messages = () => {
    
    const {currentChannelMessages,messages} = useSelector(state => state.messagesReducer);
    const {currentChannelId} = useSelector(state => state.channelsReducer);
    const { user: { username } } = useAuth();
    
    const dispath = useDispatch();

    const {sendMessage} = webSocket();

    useEffect(() => {
        dispath(addCurrentChannelMessages(currentChannelId));
    },[messages])
  
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
            } catch(err) {
                console.log(err);
            }   
        },
    });

    return (
        <div className="container">
            <div className="row">
                {currentChannelMessages.map(message =>
                    <div className='col-12'>
                        {message.body}
                    </div>  
                )}
            </div>
            <div className="row">
                <Form onSubmit={formik.handleSubmit}>
                    <InputGroup>
                        <Form.Control
                            className="col-6"
                            name="body"
                            value={formik.values.body}
                            onChange={formik.handleChange}
                            required 
                            type="text" 
                            placeholder="Enter message"/>
                        <Button variant="group-vertical" className=" border-0" type="submit">отправить</Button>
                    </InputGroup>          
                </Form>
            </div>
        </div>
    )
}

export default Messages;