import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router, Routes,Route,Navigate} from "react-router-dom";
import AuthContext from './context/AuthContext';
import Chat from './pages/Chat';
import Login from './pages/Login';
import useAuth from './context/Auth';
import MyNavbar from './components/MyNavbar';

const AuthProvider = ({ children }) => {

const currentUser = JSON.parse(localStorage.getItem('user'));

const [user, setUser] = useState(currentUser ? { username: currentUser.username } : null);

const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
};

const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
};

const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
};

return (
    <AuthContext.Provider value={{
        logIn, logOut, getAuthHeader, user,
    }}>
        {children}
    </AuthContext.Provider>
);
};

const PrivateRoute = ({ children }) => {
    const auth = useAuth();
    return (
        auth.user ? children : <Navigate to="/login"/>
    );
};

const App = () => {

    return (
        <AuthProvider>
            <MyNavbar/>
            <Router>
                <Routes>
                    
                    <Route path="/login" element={<Login/>}/>
                    <Route
                        path="/"
                        element={(
                        <PrivateRoute>
                            <Chat />
                        </PrivateRoute>
                        )}
                    />
                </Routes>  
            </Router>
        </AuthProvider>
    )
}

export default App;
