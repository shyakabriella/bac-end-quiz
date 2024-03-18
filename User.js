const mysql = require('mysql');

// Configure MySQL connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root', // default XAMPP user
    password: '', // default XAMPP password (empty)
    database: 'user_registration'
});

const User = {
    create: (userData, callback) => {
        const { name, email, phone, password } = userData;
        // Assuming password hashing is done outside this function
        const query = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
        pool.query(query, [name, email, phone, password], callback);
    }
};

module.exports = User;
