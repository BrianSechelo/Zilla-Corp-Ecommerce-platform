const express = require('express');
const session = require('express-session');
PORT = process.env.PORT || 8080;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User'); // Assuming the User model is defined

const app = express();
const path = require('path');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Route for serving the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  }));

  // Example of user database simulation
const users = {
    'sechbrian123@gmail.com': { password: 'A3AbA2gmQrjMsSLR' }
  };


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
        res.redirect('/login.html'); // Redirect to login page after successful registration
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

app.get('/session', (req, res) => {
    if (req.session.user) {
      res.json({ loggedIn: true });
    } else {
      res.json({ loggedIn: false });
    }
  });  

  const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    cart: [{
      productId: String,
      quantity: Number,
      price: Number
    }]
  });
  const Userr = mongoose.model('Userr', userSchema);
  
  // Route to update the user's cart on the server
  app.post('/cart', async (req, res) => {
      const { userId, cart } = req.body;
      
      try {
          await User.updateOne({ _id: userId }, { cart });
          res.status(200).send('Cart updated successfully');
      } catch (error) {
          res.status(500).send('Error updating cart');
      }
  });
  
  // Route to retrieve the user's cart when they log in
  app.get('/cart/:userId', async (req, res) => {
      try {
          const user = await User.findById(req.params.userId);
          res.status(200).json(user.cart);
      } catch (error) {
          res.status(500).send('Error fetching cart');
      }
  });

  app.get('/api/get-user-details', (req, res) => {
    if (req.session && req.session.user) {
        // Assuming you store user information in session
        const user = req.session.user;
        res.json({
            fullName: user.fullName,
            email: user.email
        });
    } else {
        res.status(401).json({ message: "Not logged in" });
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
mongoose.connect('mongodb+srv://sechbrian123:A3AbA2gmQrjMsSLR@zilladb.y0xw7.mongodb.net/')
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));