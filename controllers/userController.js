require('dotenv').config();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, phone, password, role = 'student' } = req.body;
    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, phone, password: hashedPassword, role });
        res.status(201).json({ message: 'User registered successfully.', user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const loginUser = async (req, res) => {
    const { email, password, role } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ message: "Incorrect email or password." });
      }
  
      // Ensure the role matches
      if (user.role !== role) {
        return res.status(403).json({ message: "Unauthorized role." });
      }
  
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: "Logged in successfully.", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Server error during login." });
    }
  };
  

module.exports = { registerUser, loginUser };
