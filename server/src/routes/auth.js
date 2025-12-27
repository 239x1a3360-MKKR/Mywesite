const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../supabase');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;

    let finalRole = 'student';
    const allowedAdminEmail = 'a.vishnuvardhanreddy01@gmail.com';

    // Domain Validation override for specific admin
    if (email === allowedAdminEmail) {
        finalRole = 'admin';
    } else if (!email.endsWith('@gprec.ac.in')) {
        return res.status(400).json({ message: 'Only @gprec.ac.in emails are allowed.' });
    }

    // Password Hashing
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('users')
            .insert([{ email, password: hashedPassword, role: finalRole }])
            .select();

        if (error) {
            if (error.code === '23505') { // Unique violation
                return res.status(400).json({ message: 'User already exists.' });
            }
            console.error('Supabase Error:', error);
            return res.status(500).json({ message: 'Database error.' });
        }

        // Fallback if env missing
        const secret = process.env.JWT_SECRET || 'supersecretkey_change_this_later';
        const token = jwt.sign({ id: data[0].id, role: data[0].role }, secret, { expiresIn: '1h' });

        res.status(201).json({
            message: `User registered successfully as ${finalRole}.`,
            token,
            role: finalRole,
            user: {
                name: data[0].name,
                email: data[0].email,
                roll_number: data[0].roll_number,
                year: data[0].year,
                semester: data[0].semester
            }
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(400).json({ message: 'Invalid credentials.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

        // Fallback if env missing
        const secret = process.env.JWT_SECRET || 'supersecretkey_change_this_later';

        const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1h' });

        res.json({ token, role: user.role });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// Change Password Route
router.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const secret = process.env.JWT_SECRET || 'supersecretkey_change_this_later';
        const decoded = jwt.verify(token, secret);
        const userId = decoded.id;

        // Fetch User
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !user) return res.status(404).json({ message: 'User not found.' });

        // Verify Current Password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password.' });

        // Hash New Password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update Password
        const { error: updateError } = await supabase
            .from('users')
            .update({ password: hashedNewPassword })
            .eq('id', userId);

        if (updateError) return res.status(500).json({ message: 'Failed to update password.' });

        res.json({ message: 'Password updated successfully.' });

    } catch (err) {
        console.error('Change Password Error:', err);
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
});

module.exports = router;
