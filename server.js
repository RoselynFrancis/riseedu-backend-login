// Filename: server.js

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rise_edu', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Sample User Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String // Note: This should be hashed!
});

const User = mongoose.model('User', userSchema);

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
});

// Port
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
