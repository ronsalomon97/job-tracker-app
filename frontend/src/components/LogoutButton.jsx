import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handlLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/login', {replace: true});
    }

    return (
        <button onClick={handlLogout} className='logout-button'> 
            LogOut
        </button>


    );
}

export default LogoutButton;