import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Beaker, FileText, Download } from 'lucide-react';


const SubjectView = ({ subjectId, subjectName, initialTab = 'theory' }) => {
    const [materials, setMaterials] = useState({ theory: [], lab: [] });
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        if (subjectId) {
            fetchMaterials();
            setMaterials({ theory: [], lab: [] }); // Reset on change
        }
    }, [subjectId]);

    const fetchMaterials = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/student/materials/${subjectId}`);
            setMaterials(res.data);
        } catch (err) {
            console.error('Failed to fetch materials');
        }
    };

    const MaterialList = ({ items, icon: Icon, title }) => (
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
                <Icon size={24} color="var(--primary)" /> {title}
            </h3>
            {items.length === 0 ? (
                <p style={{ color: '#888' }}>No materials uploaded yet.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {items.map(item => (
                        <li key={item.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={16} color="#6b7280" /> {item.title}
                            </span>
                            <a
                                href={`http://localhost:5001${item.file_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-primary"
                                style={{ padding: '5px 10px', fontSize: '0.8rem', textDecoration: 'none' }}
                            >
                                <Download size={14} /> View
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <div style={{ maxWidth: '100%' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary-dark)' }}>{subjectName}</h1>

            {/* Active Section Title */}
            <h2 style={{ color: '#6b7280', fontSize: '1.2rem', marginBottom: '1rem' }}>
                {activeTab === 'theory' ? 'Theoretical Concepts' : 'Laboratory & Practical'}
            </h2>

            <div style={{ minHeight: '300px' }}>
                {activeTab === 'theory' ? (
                    <MaterialList items={materials.theory} icon={Book} title="Theory Notes" />
                ) : (
                    <MaterialList items={materials.lab} icon={Beaker} title="Lab Manuals / Programs" />
                )}
            </div>


        </div>
    );
};

export default SubjectView;
