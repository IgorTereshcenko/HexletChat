import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import { webSocket } from "../webSocket";
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';

const Modals = ({modalState,handleModal}) => {

    const {currentChannelId} = useSelector(state => state.channelsReducer);
    const [renameName,setRenameName] = useState('');
    
    const {createChannel,removeChannel,renameChannel} = webSocket();
    
    const createNewChannelForm = useFormik({
        initialValues:{name: ''},
        onSubmit: async ({name}) => {
            const newChannel = {name}
            try {
                await createChannel(newChannel)
                handleModal('main');
            } catch(e) {
                console.log(e);
            }
        }
    })

    const handleRemoveChannel = async (id) => {
        try {
            await removeChannel({id});
            handleModal('remove');
        } catch(e) {
            console.log(e)
        }
    }

    const handleRenameChannel = async (id,name) => {
        const data = {name, id};
        try {
            await renameChannel(data)
            handleModal('rename')
        } catch(e) {
            console.log(e)
        }
    }

    return (
        <>
            <Modal 
                show={modalState.show && modalState.type === "main"} 
                onHide={() => handleModal('main')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Добавить канал</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={createNewChannelForm.handleSubmit}>
                            <InputGroup>
                                <Form.Control
                                    className="form-control"
                                    name="name"
                                    value={createNewChannelForm.values.name}
                                    onChange={createNewChannelForm.handleChange}
                                    required 
                                    type="text" 
                                    placeholder="Введите название канала"/>
                                <Button 
                                    variant="primary" 
                                    className=" border-0" 
                                    type="submit">
                                        Добавить
                                </Button>
                            </InputGroup>          
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleModal('main')}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
            </Modal>

            <Modal 
                show={modalState.show && modalState.type === 'remove'} 
                onHide={() => handleModal('remove')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Удалить канал</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Уверены?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleModal('remove')}>
                            Отменить
                        </Button>
                        <Button variant="primary" onClick={() => handleRemoveChannel(currentChannelId)}>
                            Удалить
                        </Button>
                    </Modal.Footer>
            </Modal>
               
            <Modal 
                show={modalState.show && modalState.type === "rename"} 
                onHide={() => handleModal('rename')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Переименовать</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup>
                            <Form.Control
                                className="form-control"
                                name="name"
                                value={renameName}
                                onChange={(e) => setRenameName(e.target.value)}
                                required 
                                type="text" 
                                placeholder="Введите название канала"/>
                            <Button 
                                variant="primary" 
                                className=" border-0" 
                                type="button"
                                onClick={() => handleRenameChannel(currentChannelId, renameName)}>
                                    Переименовать
                            </Button>
                        </InputGroup>            
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleModal('rename')}>
                            Отмена
                        </Button>
                    </Modal.Footer>
            </Modal>        
        </>
    )
}

export default Modals;