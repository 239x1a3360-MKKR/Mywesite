import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5001/auth/login', { email, password });

            // Ensure only admin can log in here
            if (response.data.role !== 'admin') {
                setError('Access Denied. Admins only.');
                return;
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            navigate('/admin');

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw' }}>
            <div className="auth-container">
                <div className="auth-card glass-panel" style={{ border: '1px solid var(--primary)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <ShieldCheck size={48} color="var(--primary)" />
                    </div>
                    <h2 className="auth-title">Admin Portal</h2>
                    <p className="auth-subtitle">Secure Access Verification</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            Login as Admin <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Not an admin?{' '}
                            <button className="link-btn" onClick={() => navigate('/auth')}>
                                Go to Student Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
