import React, { useState } from 'react';
import API from '../api/axios'; // Updated import
import { useNavigate, Link } from 'react-router-dom';

function Register(){

    // States:
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Hooks:
    const navigate = useNavigate();

    const hadleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword){
            setErrorMessage("Passwords do not match.");
            return;
        }
        try {
            await API.post('/api/auth/register', { name, email, password }); // Updated request
            // On successful registration, redirect to login page
            navigate('/login');
        }
        catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'An error occurred during registration.'
            );
        }
    };

    return (
        <div className='auth-container'>
            <h1 className="auth-title">Register</h1>
                <form onSubmit={hadleSubmit} className='auth-form'>

                    <div className="form-group">
                        <label className="form-label">Full Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                className="form-input"
                                required
                            />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email:</label>
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

                    <div className="form-group">
                        <label className="form-label">Confirm Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                className="form-input"
                                required
                            />
                    </div>

                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}

                    <button type="submit" className="submit-button">Register</button>
                
                </form>

                <p>
                    Already have an account? <Link to="/login" className="link-button">Login here</Link>
                </p>
        </div>
    );
}

export default Register;