import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Upload, Book, Beaker, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    // State for Layout & Navigation
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedType, setSelectedType] = useState('theory'); // 'theory' or 'lab'
    const [activeSection, setActiveSection] = useState('manage-subjects'); // manage-subjects, subject-{id}-{type}

    // State for Data
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState({ name: '', semester: '' });
    const [materials, setMaterials] = useState([]);

    // State for Modals
    const [uploadData, setUploadData] = useState({ subject_id: '', title: '', type: 'theory', file: null });
    const [showUploadModal, setShowUploadModal] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Initial Fetch
    useEffect(() => {
        fetchSubjects();
    }, []);

    // --- API Functions ---

    const fetchSubjects = async () => {
        try {
            const res = await axios.get('http://localhost:5001/admin/subjects');
            setSubjects(res.data);
        } catch (err) {
            console.error('Failed to fetch subjects');
        }
    };

    const fetchMaterials = async (subjectId) => {
        try {
            const res = await axios.get(`http://localhost:5001/student/materials/${subjectId}`);
            // materials endpoint returns { theory: [], lab: [] }
            setMaterials(res.data);
        } catch (err) {
            console.error('Failed to fetch materials');
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/admin/subject', newSubject, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewSubject({ name: '', semester: '' });
            fetchSubjects();
        } catch (err) {
            console.error('Failed to add subject');
            alert('Failed to add subject');
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;
        try {
            await axios.delete(`http://localhost:5001/admin/subject/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // If the deleted subject was selected, reset view
            if (selectedSubject?.id === id) {
                setActiveSection('manage-subjects');
                setSelectedSubject(null);
            }
            fetchSubjects();
        } catch (err) {
            console.error('Failed to delete subject');
            alert('Failed to delete subject');
        }
    };

    const handleDeleteMaterial = async (id) => {
        if (!window.confirm('Delete this file?')) return;
        try {
            await axios.delete(`http://localhost:5001/admin/material/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh list
            if (selectedSubject) {
                fetchMaterials(selectedSubject.id);
            }
        } catch (err) {
            console.error('Failed to delete material');
            alert('Failed to delete material');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('subject_id', uploadData.subject_id);
        formData.append('title', uploadData.title);
        formData.append('type', uploadData.type);
        formData.append('file', uploadData.file);

        try {
            await axios.post('http://localhost:5001/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setShowUploadModal(false);
            alert('File uploaded successfully');

            // Refresh materials if we are currently viewing them
            if (selectedSubject && selectedSubject.id === uploadData.subject_id) {
                fetchMaterials(selectedSubject.id);
            }

            setUploadData({ subject_id: '', title: '', type: 'theory', file: null });
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        }
    };

    // --- Navigation Helpers ---

    const handleSubjectClick = (subject, type) => {
        setSelectedSubject(subject);
        setSelectedType(type);
        setActiveSection(`subject-${subject.id}-${type}`);
        fetchMaterials(subject.id);
    };

    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5001/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users');
        }
    };

    const openUploadModal = (subjectId) => {
        // Pre-fill with the currently selected type from the view if available, else default to theory
        let typeToUse = 'theory';
        if (selectedSubject && selectedSubject.id === subjectId) {
            typeToUse = selectedType;
        }

        setUploadData({ ...uploadData, subject_id: subjectId, type: typeToUse });
        setShowUploadModal(true);
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

    return (
        <div className="dashboard-container" style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header */}
            <header className="dashboard-header glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 0, margin: 0, zIndex: 10 }}>
                <h1 style={{ margin: 0, color: 'var(--primary-dark)', fontSize: '1.5rem' }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowPasswordModal(true)} className="btn-primary" style={{ background: '#3b82f6' }}>
                        Change Password
                    </button>
                    <button onClick={() => { localStorage.clear(); navigate('/auth'); }} className="btn-primary" style={{ background: '#ef4444' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Sidebar */}
                <aside className="glass-panel" style={{ width: '280px', borderRadius: 0, margin: 0, borderRight: '1px solid rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', padding: '1rem' }}>

                    <h3 style={{ color: '#6b7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Admin Menu</h3>

                    <div
                        onClick={() => setActiveSection('manage-subjects')}
                        style={{
                            padding: '12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '10px',
                            background: activeSection === 'manage-subjects' ? 'var(--primary)' : 'transparent',
                            color: activeSection === 'manage-subjects' ? 'white' : '#4b5563',
                            display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500'
                        }}
                    >
                        <Plus size={20} /> Manage Subjects
                    </div>

                    <div
                        onClick={() => { setActiveSection('view-users'); fetchUsers(); }}
                        style={{
                            padding: '12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '20px',
                            background: activeSection === 'view-users' ? 'var(--primary)' : 'transparent',
                            color: activeSection === 'view-users' ? 'white' : '#4b5563',
                            display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500'
                        }}
                    >
                        <Book size={20} /> View Students
                    </div>

                    <h3 style={{ color: '#6b7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Subjects</h3>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {/* Theory Branch */}
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{
                                padding: '8px 12px', color: 'var(--primary-dark)', fontWeight: 'bold',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255,255,255,0.5)', borderRadius: '8px', marginBottom: '8px'
                            }}>
                                <Book size={18} /> Theory
                            </div>
                            <div style={{ paddingLeft: '12px' }}>
                                {subjects.map(subject => (
                                    <div
                                        key={`theory-${subject.id}`}
                                        onClick={() => handleSubjectClick(subject, 'theory')}
                                        style={{
                                            padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '2px',
                                            background: activeSection === `subject-${subject.id}-theory` ? 'var(--primary)' : 'transparent',
                                            color: activeSection === `subject-${subject.id}-theory` ? 'white' : '#6b7280',
                                        }}
                                    >
                                        {subject.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lab Branch */}
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{
                                padding: '8px 12px', color: 'var(--primary-dark)', fontWeight: 'bold',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255,255,255,0.5)', borderRadius: '8px', marginBottom: '8px'
                            }}>
                                <Beaker size={18} /> Labs
                            </div>
                            <div style={{ paddingLeft: '12px' }}>
                                {subjects.map(subject => (
                                    <div
                                        key={`lab-${subject.id}`}
                                        onClick={() => handleSubjectClick(subject, 'lab')}
                                        style={{
                                            padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '2px',
                                            background: activeSection === `subject-${subject.id}-lab` ? 'var(--primary)' : 'transparent',
                                            color: activeSection === `subject-${subject.id}-lab` ? 'white' : '#6b7280',
                                        }}
                                    >
                                        {subject.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'rgba(255,255,255,0.4)' }}>

                    {activeSection === 'view-users' && (
                        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                            <h2 style={{ marginBottom: '2rem', color: 'var(--primary-dark)' }}>Registered Students</h2>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--primary)', color: 'white', textAlign: 'left' }}>
                                            <th style={{ padding: '12px', borderRadius: '8px 0 0 8px' }}>Roll Number</th>
                                            <th style={{ padding: '12px' }}>Name</th>
                                            <th style={{ padding: '12px' }}>Email</th>
                                            <th style={{ padding: '12px' }}>Year</th>
                                            <th style={{ padding: '12px', borderRadius: '0 8px 8px 0' }}>Semester</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user, index) => (
                                                <tr key={user.id} style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'white' }}>
                                                    <td style={{ padding: '12px', fontWeight: '500' }}>{user.roll_number || 'N/A'}</td>
                                                    <td style={{ padding: '12px' }}>{user.name || 'N/A'}</td>
                                                    <td style={{ padding: '12px', color: '#6b7280' }}>{user.email}</td>
                                                    <td style={{ padding: '12px' }}>{user.year || 'N/A'}</td>
                                                    <td style={{ padding: '12px' }}>{user.semester || 'N/A'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                                                    No registered students found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeSection === 'manage-subjects' && (
                        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                            <h2 style={{ marginBottom: '2rem', color: 'var(--primary-dark)' }}>Manage Subjects</h2>

                            {/* Add Form */}
                            <form onSubmit={handleAddSubject} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                <input
                                    className="input-group"
                                    style={{ flex: 2, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                    placeholder="Subject Name"
                                    value={newSubject.name}
                                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                    required
                                />
                                <input
                                    className="input-group"
                                    type="number"
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                    placeholder="Semester"
                                    value={newSubject.semester}
                                    onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
                                    required
                                />
                                <button type="submit" className="btn-primary"><Plus size={20} /> Add</button>
                            </form>

                            {/* List for Deletion */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                {subjects.map(subject => (
                                    <div key={subject.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                        <div>
                                            <strong>{subject.name}</strong>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>Sem {subject.semester}</div>
                                        </div>
                                        <button onClick={() => handleDeleteSubject(subject.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection.startsWith('subject-') && selectedSubject && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h1 style={{ margin: 0, color: 'var(--primary-dark)' }}>{selectedSubject.name}</h1>
                                    <p style={{ color: '#666' }}>Managing {selectedType === 'theory' ? 'Theory Notes' : 'Lab Manuals'}</p>
                                </div>
                                <button onClick={() => openUploadModal(selectedSubject.id)} className="btn-primary">
                                    <Upload size={18} /> Upload New {selectedType === 'theory' ? 'File' : 'Manual'}
                                </button>
                            </div>

                            <div className="glass-panel" style={{ padding: '2rem' }}>
                                {materials[selectedType] && materials[selectedType].length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {materials[selectedType].map(item => (
                                            <li key={item.id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                                    {selectedType === 'theory' ? <Book size={20} color="var(--primary)" /> : <Beaker size={20} color="var(--primary)" />}
                                                    {item.title}
                                                </span>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <a
                                                        href={`http://localhost:5001${item.file_path}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}
                                                    >
                                                        View
                                                    </a>
                                                    <button onClick={() => handleDeleteMaterial(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                                        <p>No materials uploaded for this section yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    <div className="glass-panel" style={{ padding: '2rem', width: '400px', background: 'white' }}>
                        <h3>Upload to {selectedSubject?.name} ({selectedType})</h3>
                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                placeholder="Title (e.g., Unit 1 Notes)"
                                value={uploadData.title}
                                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            {/* Type is locked to the selected view */}
                            <div style={{ padding: '0.8rem', background: '#f3f4f6', borderRadius: '8px', color: '#666' }}>
                                Uploading to: <strong>{selectedType === 'theory' ? 'Theory' : 'Lab'}</strong>
                            </div>

                            <input
                                type="file"
                                accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                                required
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Upload</button>
                                <button type="button" onClick={() => setShowUploadModal(false)} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', background: 'transparent' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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

export default AdminDashboard;
