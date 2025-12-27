
const express = require('express');
const { supabase } = require('../supabase');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to check JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    // Fallback secret
    const secret = process.env.JWT_SECRET || 'supersecretkey_change_this_later';

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get Current Student Profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('name, email, roll_number, year, semester, role')
            .eq('id', req.user.id) // req.user.id comes from the JWT token
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// Update Student Profile
router.put('/profile', authenticateToken, async (req, res) => {
    const { name, roll_number, year, semester } = req.body;

    // Validation: Ensure required fields are present (optional, but good practice)
    if (!name || !roll_number || !year || !semester) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Update user details in Supabase
        const { data, error } = await supabase
            .from('users')
            .update({ name, roll_number, year, semester })
            .eq('id', req.user.id) // Ensure users can only update their own profile
            .select() // Return the updated record
            .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Get All Subjects
router.get('/subjects', async (req, res) => {
    try {
        const { data, error } = await supabase.from('subjects').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get Materials for Subject
router.get('/materials/:subjectId', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('materials')
            .select('*')
            .eq('subject_id', req.params.subjectId)
            .order('title', { ascending: true });

        if (error) throw error;

        // Natural sort by title (handles "Unit 1", "Unit 2", "Unit 10" correctly)
        data.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));

        const theory = data.filter(m => m.type === 'theory');
        const lab = data.filter(m => m.type === 'lab');

        res.json({ theory, lab });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

