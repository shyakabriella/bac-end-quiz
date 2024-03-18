require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require('./controllers/userController');
// Import addCourse and getCourses together, only once
const { addCourse, getCourses } = require('./controllers/courseController');

const app = express();
const port = process.env.PORT || 3000;

let tokenBlacklist = {};

app.use(cors());
app.use(express.json());

app.post('/register', registerUser);
app.post('/login', loginUser);

app.post('/logout', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        tokenBlacklist[token] = true;
        res.status(200).json({ message: "Successfully logged out." });
    } else {
        res.status(400).json({ message: "Token not provided." });
    }
});

// Previously you had a redundant getCourses import here, which is now removed.

const verifyTokenAndRole = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    if (tokenBlacklist[token]) {
      return res.status(401).json({ message: "Token has been logged out" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
      }
      req.user = decoded;
      next();
    });
  };
};

// Route definitions
app.get('/common-area', verifyTokenAndRole(['student', 'teacher']), (req, res) => {
    res.json({ message: 'Welcome to the common area.' });
});

app.get('/teacher-dashboard', verifyTokenAndRole(['teacher']), (req, res) => {
    res.json({ message: 'Welcome to the teacher dashboard.' });
});

app.post('/add-course', addCourse); // For testing without authentication middleware
app.get('/courses', getCourses); // Fetch courses - assuming public access

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
