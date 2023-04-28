import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useAuth from '../context/Auth';
import {useNavigate} from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect, useRef, useState } from 'react';

const Registration = () => {

    const navigate = useNavigate();

    const auth = useAuth();

    const [error, setError] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    },[])

    const validationSchema = yup.object().shape({
        username: yup
          .string()
          .trim()
          .required('обязательное поле')
          .min(3, 'Имя пользователя должно содержать минимум 3 символа')
          .max(20, 'Имя пользователя не должно превышать 20-ти символов'),
        password: yup
          .string()
          .trim()
          .required('обязательное поле')
          .min(6, 'пароль должен содержать минимум 6 символов'),
        confirmPassword: yup
          .string()
          .test('подтвердите пароль', 'пароли не совпадают', (value, context) => value === context.parent.password),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post('/api/v1/signup', {username: values.username, password: values.password})
                auth.logIn(response.data);
                navigate('/');
            } catch(e) {
                if (e.response?.status === 409) {
                    setError(true);
                }
            }
        }
    })

    return (
        <div className='d-flex align-items-center' style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className='container'>
            <div className='card shadow-sm'>
            <h2 className="card-header text-center mb-3">
                Регистрация
            </h2>
            <Form onSubmit={formik.handleSubmit}>
                <div className='row justify-content-center'>
                    <Form.Group 
                        className="col-4 mb-3" 
                        controlId="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}>
                            <Form.Label className='h6'>Имя пользователя</Form.Label>
                            <Form.Control
                                className="form-control"
                                required 
                                type="text"
                                ref={inputRef} 
                                placeholder="Введите имя пользователя"
                                isInvalid={(formik.errors.username && formik.touched.username)
                                    || error}/>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {formik.errors.username}
                            </Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className='row justify-content-center'>
                    <Form.Group 
                        className="col-4 mb-3" 
                        controlId="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}>
                            <Form.Label className='h6'>Пароль</Form.Label>
                            <Form.Control
                                className="form-control"
                                required 
                                type="password" 
                                placeholder="Введите пароль"
                                isInvalid={(formik.errors.password && formik.touched.password)
                                    || error}/>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {formik.errors.password}
                            </Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className='row justify-content-center'>
                    <Form.Group 
                        className="col-4 mb-3" 
                        controlId="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}>
                            <Form.Label className='h6'>Подтвердите пароль</Form.Label>
                            <Form.Control
                                className="form-control"
                                required 
                                type="password" 
                                placeholder="Подтвердите пароль"
                                isInvalid={(formik.errors.confirmPassword && formik.touched.confirmPassword)
                                    || error}/>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {formik.errors.confirmPassword}
                            </Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className='row justify-content-center'>
                    <Button className='col-3 mb-5' type="submit">
                        Войти
                    </Button>
                </div>
                {error ? <div className='text-bg-danger p-3 text-center'>Пользователь с данным именем уже существует</div> : null}   
            </Form>    
            </div>    
        </div> 
    </div>
    )
}

export default Registration;