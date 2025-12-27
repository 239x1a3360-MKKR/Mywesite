import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/login' : '/signup';
        const payload = isLogin ? { email, password } : { email, password, name, roll_number: rollNumber, year, semester };

        try {
            const response = await axios.post(`http://localhost:5001/auth${endpoint}`, payload);

            // Auto-login for both Signup and Login
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            navigate(response.data.role === 'admin' ? '/admin' : '/student');

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
            <div className="auth-container">
                <div className="auth-card glass-panel">
                    <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Join AcademicHub'}</h2>
                    <p className="auth-subtitle">
                        {isLogin ? 'Access your lecture notes and AI assistant' : 'Create your account to get started'}
                    </p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="College Email (@gprec.ac.in)"
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

                        {!isLogin && (
                            <>
                                <div className="input-group">
                                    <User className="input-icon" size={20} />
                                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <User className="input-icon" size={20} />
                                    <input type="text" placeholder="Roll Number" value={rollNumber} onChange={e => setRollNumber(e.target.value)} required />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div className="input-group">
                                        <input type="text" placeholder="Year (e.g., III)" value={year} onChange={e => setYear(e.target.value)} required />
                                    </div>
                                    <div className="input-group">
                                        <input type="text" placeholder="Semester (e.g., 1)" value={semester} onChange={e => setSemester(e.target.value)} required />
                                    </div>
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn-primary">
                            {isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button className="link-btn" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <button className="link-btn" onClick={() => navigate('/admin-login')} style={{ fontSize: '0.9rem', color: '#666' }}>
                                Access Admin Portal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
