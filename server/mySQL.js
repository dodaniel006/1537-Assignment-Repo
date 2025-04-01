var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "Daniel",
    password: "password123",
    database: "assignment6"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    // Create database
    con.query("CREATE DATABASE IF NOT EXISTS assignment6", function (err, result) {
        if (err) throw err;
    });

    // Use the database
    con.query("USE assignment6", function (err, result) {
        if (err) throw err;
        console.log("Using database assignment6");
    });

    // Create user table
    const createUserTable = `
        CREATE TABLE IF NOT EXISTS A01451718_user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL
        )
    `;
    con.query(createUserTable, function (err, result) {
        if (err) throw err;
        console.log("User table created or already exists");
    });

    // Insert a user record
    // const insertUser = `
    //     INSERT INTO A01451718_user (username, first_name, last_name, email, password)
    //     VALUES ('DDo', 'Daniel', 'Do', 'ddo19@my.bcit.ca', 'securepassword')
    // `;
    // con.query(insertUser, function (err, result) {
    //     if (err) throw err;
    //     console.log("User record inserted");
    // });

    // // Create user timeline table
    // const createTimelineTable = `
    //     CREATE TABLE IF NOT EXISTS A01451718_user_timeline (
    //         id INT AUTO_INCREMENT PRIMARY KEY,
    //         user_id INT NOT NULL,
    //         post_date DATE NOT NULL,
    //         post_text TEXT NOT NULL,
    //         post_time TIME NOT NULL,
    //         views INT NOT NULL,
    //         FOREIGN KEY (user_id) REFERENCES A01451718_user(id)
    //     )
    // `;
    // con.query(createTimelineTable, function (err, result) {
    //     if (err) throw err;
    //     console.log("User timeline table created or already exists");
    // });

    // Insert posts for the user
    const insertPosts = `
        INSERT INTO A01451718_user_timeline (user_id, post_date, post_text, post_time, views)
        VALUES 
        (1, '2023-01-01', 'Today, we learned how to connect Node.js to a MySQL database.', '10:00:00', 100),
        (1, '2023-01-02', 'Exploring the basics of SQL queries.', '11:00:00', 150),
        (1, '2023-01-03', 'Understanding primary and foreign keys.', '12:00:00', 200),
        (1, '2023-01-04', 'Learning about database normalization.', '13:00:00', 250),
        (1, '2023-01-05', 'Implementing CRUD operations in Node.js.', '14:00:00', 300)
    `;
    con.query(insertPosts, function (err, result) {
        if (err) throw err;
        console.log("Posts inserted into user timeline table");
    });

    function loginUser(username, password) {
        console.log("hello");
        const sql = `SELECT * FROM A01451718_user WHERE username = ` + username + ` AND password = ` + password;
        con.query(sql, [username, password], function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length > 0) {
                return true; // User found
            } else {
                console.log("Invalid username or password");
                return false;
            }
        });
    }
    // Export the loginUser function
    module.exports = { loginUser };
});