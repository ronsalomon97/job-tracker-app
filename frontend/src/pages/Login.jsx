import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login () {

    // States:
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Hooks:
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            // Save token to localStorage
            localStorage.setItem('token', response.data.token);
            // Optionally, store user info if needed:
            localStorage.setItem('user', JSON.stringify(response.data.user));
            // Redirect to dashboard
            navigate('/');
            }
            catch(error){
                setErrorMessage(
                    error.response?.data?.message || 'An error occurred during login'
                );
            }
    }


    return (
        <div className='auth-container'>   
            <h1 className="auth-title">Login</h1>
                <form onSubmit={handleSubmit} className='auth-form'>
                    <div className='form-group'>
                        <label className='form-label'>Email:</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="form-input"
                                required
                            />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="form-input"
                                required
                            />
                    </div>

                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}

                    <button type="submit" className="submit-button">Login</button>
                </form>

                <p>
                    Don't have an account? <Link to="/register" className="link-button">Register here</Link>
                </p>
        </div>
    );
}
export default Login;