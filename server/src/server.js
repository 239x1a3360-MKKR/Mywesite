const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// Fallback for JWT_SECRET
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'supersecretkey_change_this_later';
console.log("JWT_SECRET Loaded:", process.env.JWT_SECRET ? "Yes" : "No");
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001; // Changed to 5001 to avoid EADDRINUSE

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (Uploaded Notes)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/student', require('./routes/student'));
app.use('/student', require('./routes/student'));

app.get('/', (req, res) => {
    res.send('Academic Web App API Running');
});

// Initialize Database and Start Server
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
