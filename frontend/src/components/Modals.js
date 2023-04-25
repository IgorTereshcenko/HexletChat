import React, { useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import { webSocket } from "../webSocket";
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { isUniqueChannelName } from '../store/slice/channelsSlice';

const Modals = ({modalState,handleModal}) => {

    const {currentChannelId,unique} = useSelector(state => state.channelsReducer);
    const dispatch = useDispatch();

    const inputRef = useRef(null);

    useEffect(() => {
        if(modalState.show && modalState.type !== 'remove') {
            inputRef.current.focus();
        }
    },[modalState.show])
    
    const {createChannel,removeChannel,renameChannel} = webSocket();

    const getValidationShema = yup.object().shape({
        name:yup
            .string()
            .test('isUnique', 'Имя должно быть уникальным', (testValue) => {
                dispatch(isUniqueChannelName(testValue));
                return unique;
            })
            .required("Наименование канала обязательно")
            .min(3, "Наименование канала должно содержать минимум 3 символа")
            .max(30, "Наименование канала должно содержать максимум 30 символов")
            .matches(
                /^[a-zA-Zа-яА-Я0-9-_]+$/,
                "Наименование канала может содержать только буквы, цифры, дефисы (-) и подчеркивания (_)"
            ),
    })
    
    const createNewChannelForm = useFormik({
        initialValues:{name: ''},
        validationSchema:getValidationShema,
        onSubmit: async ({name}) => {
            const newChannel = {name}
            try {
                await createChannel(newChannel)
                handleModal('main');
                createNewChannelForm.resetForm();
            } catch(e) {
                console.log(e);
                log('channel.create.error', e);
            }
        }
    })

    const renameChannelForm = useFormik({
        initialValues:{name: ''},
        validationSchema:getValidationShema,
        onSubmit: async ({name}) => {
            const data = {id:currentChannelId,name}
            try {
                await renameChannel(data)
                handleModal('rename')
                renameChannelForm.resetForm();
            } catch(e) {
                console.log(e)
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
                                    ref={inputRef}
                                    isInvalid={(createNewChannelForm.errors.name && createNewChannelForm.touched.name) || !!createNewChannelForm.status} 
                                    placeholder="Введите название канала"/>
                                <Form.Control.Feedback type="invalid">
                                    {createNewChannelForm.errors.name || createNewChannelForm.status}
                                </Form.Control.Feedback>
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
                        <Form onSubmit={renameChannelForm.handleSubmit}>
                        <InputGroup>
                                <Form.Control
                                    className="form-control"
                                    name="name"
                                    value={renameChannelForm.values.name}
                                    onChange={renameChannelForm.handleChange}
                                    required 
                                    type="text"
                                    ref={inputRef} 
                                    placeholder="Введите название канала"
                                    isInvalid={(renameChannelForm.errors.name && renameChannelForm.touched.name) || !!renameChannelForm.status}/>
                                <Form.Control.Feedback type="invalid">
                                    {renameChannelForm.errors.name || renameChannelForm.status}
                                </Form.Control.Feedback>
                                <Button 
                                    variant="primary" 
                                    className=" border-0" 
                                    type="submit">
                                        Переименовать
                                </Button>
                            </InputGroup> 
                        </Form>      
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