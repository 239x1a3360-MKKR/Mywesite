const express = require('express');
const multer = require('multer');
const path = require('path');
const { supabase } = require('../supabase');

const router = express.Router();

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDFs and PPTs are allowed.'));
        }
    }
});

const isAdmin = (req, res, next) => {
    next();
};

// Add Subject
router.post('/subject', isAdmin, async (req, res) => {
    const { name, semester } = req.body;

    const { data, error } = await supabase
        .from('subjects')
        .insert([{ name, semester }])
        .select();

    if (error) return res.status(400).json({ message: 'Subject already exists or error.' });
    res.json(data[0]);
});

// Delete Subject
router.delete('/subject/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ message: 'Error deleting subject.' });
    res.json({ message: 'Subject deleted.' });
});

// List Subjects
router.get('/subjects', async (req, res) => {
    const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('semester', { ascending: true })
        .order('name', { ascending: true });

    if (error) return res.status(500).json({ message: 'Error fetching subjects.' });
    res.json(data);
});

// Upload Material
router.post('/upload', isAdmin, upload.single('file'), async (req, res) => {
    const { subject_id, title, type } = req.body;
    const file_path = `/uploads/${req.file.filename}`;

    const { error } = await supabase
        .from('materials')
        .insert([{ subject_id, title, type, file_path }]);

    if (error) return res.status(500).json({ message: 'Database error.' });
    res.json({ message: 'File uploaded successfully.', file_path });
});

// Delete Material
router.delete('/material/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    // Optional: Fetch file path to delete from disk (fs.unlink)
    // For now, we just remove from DB as per plan

    const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ message: 'Error deleting material.' });
    res.json({ message: 'Material deleted successfully.' });
});

// Get All Users (Students)
router.get('/users', isAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, roll_number, year, semester, role')
            .order('roll_number', { ascending: true }); // Order by roll number

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users.' });
    }
});

module.exports = router;
