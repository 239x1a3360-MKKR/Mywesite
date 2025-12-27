import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, MessageSquare, Phone, User, Beaker } from 'lucide-react';
import SubjectView from './SubjectView';

const StudentDashboard = () => {
    const [subjects, setSubjects] = useState([]);
    const [activeSection, setActiveSection] = useState('welcome'); // welcome, contact, subject-{id}
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTab, setSelectedTab] = useState('theory'); // 'theory' or 'lab'
    const [user, setUser] = useState({ name: 'Student', roll_number: 'N/A', year: 'N/A', semester: 'N/A', email: '' });
    const navigate = useNavigate();

    useEffect(() => {
        // Load initial state from local storage for speed
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Fetch fresh data from DB
        fetchProfile();
        fetchSubjects();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.get('http://localhost:5001/student/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update state and local storage with fresh data
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
            console.error('Failed to fetch latest profile', err);
        }
    };

    const fetchSubjects = async () => {
        try {
            const res = await axios.get('http://localhost:5001/student/subjects');
            setSubjects(res.data);
        } catch (err) {
            console.error('Failed to fetch subjects');
        }
    };

    const handleSubjectClick = (subject, type) => {
        setSelectedSubject(subject);
        setSelectedTab(type); // 'theory' or 'lab'
        setActiveSection(`subject-${subject.id}-${type}`);
    };

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/auth/change-password', passwordData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Password updated successfully!');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update password');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5001/student/profile', user, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="dashboard-container" style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header */}
            <header className="dashboard-header glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 0, margin: 0, zIndex: 10 }}>
                <div>
                    <h1 style={{ margin: 0, color: 'var(--primary-dark)', fontSize: '1.5rem' }}>Dr A.VISHNUVARDHAN REDDY</h1>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem' }}>Associate Professor</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setActiveSection('profile')} className="btn-primary" style={{ background: '#10b981' }}>
                        My Profile
                    </button>
                    <button onClick={() => setShowPasswordModal(true)} className="btn-primary" style={{ background: '#3b82f6' }}>
                        Change Password
                    </button>
                    <button onClick={() => { localStorage.clear(); navigate('/auth'); }} className="btn-primary" style={{ background: '#ef4444', padding: '0.6rem' }} title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Left Sidebar Navigation */}
                <aside className="glass-panel" style={{ width: '280px', borderRadius: 0, margin: 0, borderRight: '1px solid rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', padding: '1rem' }}>

                    <h3 style={{ color: '#6b7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Menu</h3>



                    <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>

                        {/* Theory Major Branch */}
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{
                                padding: '8px 12px', color: 'var(--primary-dark)', fontWeight: 'bold',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255,255,255,0.5)', borderRadius: '8px', marginBottom: '8px'
                            }}>
                                <BookOpen size={18} /> Theory
                            </div>

                            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {subjects.map(subject => (
                                    <div
                                        key={`theory-${subject.id}`}
                                        onClick={() => handleSubjectClick(subject, 'theory')}
                                        style={{
                                            padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
                                            background: activeSection === `subject-${subject.id}-theory` ? 'var(--primary)' : 'transparent',
                                            color: activeSection === `subject-${subject.id}-theory` ? 'white' : '#6b7280',
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeSection === `subject-${subject.id}-theory` ? 'white' : '#ccc' }}></div>
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subject.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Labs Major Branch */}
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{
                                padding: '8px 12px', color: 'var(--primary-dark)', fontWeight: 'bold',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255,255,255,0.5)', borderRadius: '8px', marginBottom: '8px'
                            }}>
                                <Beaker size={18} /> Labs
                            </div>

                            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {subjects.map(subject => (
                                    <div
                                        key={`lab-${subject.id}`}
                                        onClick={() => handleSubjectClick(subject, 'lab')}
                                        style={{
                                            padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
                                            background: activeSection === `subject-${subject.id}-lab` ? 'var(--primary)' : 'transparent',
                                            color: activeSection === `subject-${subject.id}-lab` ? 'white' : '#6b7280',
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeSection === `subject-${subject.id}-lab` ? 'white' : '#ccc' }}></div>
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subject.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </aside>

                {/* Main Content Area */}
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'rgba(255,255,255,0.4)' }}>

                    {activeSection === 'welcome' && (
                        <div style={{ textAlign: 'center', marginTop: '5rem', color: '#6b7280' }}>
                            <BookOpen size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h2>Welcome, {user?.name || 'Student'}</h2>
                            <p>Select an option from the menu or a subject to get started.</p>
                        </div>
                    )}

                    {activeSection === 'contact' && (
                        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Phone size={28} /> Contact Us
                            </h2>
                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

                            <div style={{ lineHeight: '2' }}>
                                <p><strong>Department of Computer Science & Engineering</strong></p>
                                <p>Email: <a href="mailto:a.vishnuvardhanreddy01@gmail.com">a.vishnuvardhanreddy01@gmail.com</a></p>
                                <p>Phone: <strong><a href="tel:9030219706" style={{ color: 'inherit', textDecoration: 'none' }}>90302 19706</a></strong></p>
                            </div>
                        </div>
                    )}

                    {activeSection === 'profile' && (
                        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <User size={28} /> My Profile
                            </h2>
                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

                            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={user?.name || ''}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Email Address <span style={{ fontSize: '0.8rem', color: '#ff4444' }}>(ReadOnly)</span></label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'not-allowed' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Roll Number</label>
                                        <input
                                            type="text"
                                            value={user?.roll_number || ''}
                                            onChange={(e) => setUser({ ...user, roll_number: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Year</label>
                                        <select
                                            value={user?.year || '1'}
                                            onChange={(e) => setUser({ ...user, year: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        >
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Semester</label>
                                        <select
                                            value={user?.semester || '1'}
                                            onChange={(e) => setUser({ ...user, semester: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                        >
                                            <option value="1">1st Sem</option>
                                            <option value="2">2nd Sem</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeSection.startsWith('subject-') && selectedSubject && (
                        <SubjectView
                            subjectId={selectedSubject.id}
                            subjectName={selectedSubject.name}
                            initialTab={selectedTab}
                        />
                    )}

                </main>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    <div className="glass-panel" style={{ padding: '2rem', width: '400px', background: 'white' }}>
                        <h3>Change Password</h3>
                        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Update</button>
                                <button type="button" onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', background: 'transparent' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
