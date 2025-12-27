import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>

            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', width: '90%' }}>
                <h1 style={{ color: 'var(--primary-dark)', marginBottom: '1rem', fontSize: '2.5rem' }}>AcademicHub</h1>
                <p style={{ color: '#6b7280', marginBottom: '3rem', fontSize: '1.2rem' }}>
                    Welcome to the central academic management system. Please select your portal to continue.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>

                    {/* Student Card */}
                    <div
                        onClick={() => navigate('/auth')}
                        className="glass-panel"
                        style={{
                            padding: '2rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                            transition: 'transform 0.2s', border: '1px solid transparent'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.border = '1px solid var(--primary)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.border = '1px solid transparent'; }}
                    >
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                        }}>
                            <User size={40} />
                        </div>
                        <h3 style={{ margin: 0 }}>Student</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>Access notes & AI help</p>
                        <ArrowRight size={20} color="var(--primary)" style={{ marginTop: 'auto' }} />
                    </div>

                    {/* Admin Card */}
                    <div
                        onClick={() => navigate('/admin-login')}
                        className="glass-panel"
                        style={{
                            padding: '2rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                            transition: 'transform 0.2s', border: '1px solid transparent'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.border = '1px solid #ef4444'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.border = '1px solid transparent'; }}
                    >
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444'
                        }}>
                            <ShieldCheck size={40} />
                        </div>
                        <h3 style={{ margin: 0 }}>Admin</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>Manage content & users</p>
                        <ArrowRight size={20} color="#ef4444" style={{ marginTop: 'auto' }} />
                    </div>

                </div>
            </div>

            <p style={{ marginTop: '2rem', color: '#6b7280', fontSize: '0.9rem' }}>
                © 2024 Dr. A. Vishnuvardhan Reddy. All rights reserved.
            </p>

        </div>
    );
};

export default LandingPage;
