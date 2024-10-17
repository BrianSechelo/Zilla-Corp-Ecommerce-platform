const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User'); // Assuming the User model is defined

const app = express();
const path = require('path');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); 

// POST route for registration
app.post('/register', async (req, res) => {
    const { fullname, username, email, password, confirm_password } = req.body;

    // Check if passwords match
    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match');
    }

    // Check if user with the same email or username already exists
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).send('User with this email or username already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        console.log('User registered successfully');
        res.redirect('/login'); // Redirect to login page after successful registration
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        // Find the user by username or email
        const user = await User.findOne({ $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] });
        
        // If user doesn't exist
        if (!user) {
            return res.status(400).send('Invalid username/email or password');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        // If password doesn't match
        if (!isMatch) {
            return res.status(400).send('Invalid username/email or password');
        }

        // If login successful
        console.log('User logged in successfully');
        res.redirect('/index.html'); 

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
});
// MongoDB connection
/*
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/
mongoose.connect('mongodb://localhost:27017/zillacorp')
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));