import React, { useContext, useEffect, useRef, useState} from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Link, useNavigate} from 'react-router-dom';
import useAuth from '../context/Auth';

const login = () => {

    const navigate = useNavigate();

    const auth = useAuth();

    const [error, setError] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    },[])

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: async (values) => {
            try {
                const response = await axios.post('/api/v1/login', values);
                auth.logIn(response.data);
                navigate('/')
            } catch(e) {
                if (e.response?.status === 401) {
                    setError(true);
                }
            }   
        },
    });

    return (
        <div className='d-flex align-items-center' style={{ minHeight: 'calc(100vh - 56px)' }}>
            <div className='container'>
                <div className='card shadow-sm'>
                <h2 className="card-header text-center mb-3">
                    Авторизация
                </h2>
                <Form onSubmit={formik.handleSubmit}>
                    <div className='row justify-content-center'>
                        <Form.Group 
                            className="col-4 mb-3" 
                            controlId="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}>
                                <Form.Label className='h6'>Имя пользователя</Form.Label>
                                <Form.Control
                                    className="form-control"
                                    required 
                                    type="text"
                                    ref={inputRef} 
                                    placeholder="Введите имя пользователя"/>
                        </Form.Group>
                    </div>
                    <div className='row justify-content-center'>
                        <Form.Group 
                            className="col-4 mb-3" 
                            controlId="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}>
                                <Form.Label className='h6'>Пароль</Form.Label>
                                <Form.Control
                                    className="form-control"
                                    required 
                                    type="password" 
                                    placeholder="Введите пароль"/>
                        </Form.Group>
                    </div>
                    <div className='row justify-content-center'>
                        <Button className='col-3 mb-5' type="submit">
                            Войти
                        </Button>
                    </div>
                    {error ? <div className='text-bg-danger p-3 text-center'>Имя пользователя или пароль введены неверно</div> : null}   
                </Form>
                <div class="text-bg-secondary  p-3 text-center">Не зарегистрированы? <Link to='/registration'>Регистрация</Link></div>
                </div>    
            </div> 
        </div>
    )
}

export default login;
