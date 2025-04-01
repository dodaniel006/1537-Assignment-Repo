const express = require("express");
const session = require("express-session");
const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data
const fs = require("fs");
const mysql = require('mysql');

app.use("/js", express.static("../public/js"));
app.use("/css", express.static("../public/css"));
app.use("/img", express.static("../public/img"));
app.use("/fonts", express.static("../public/fonts"));

app.use(session(
    {
        secret: "qeokgwepkgor",
        name: "wazaSessionID",
        resave: false,
        // create a unique identifier for that client
        saveUninitialized: true
    })
);

let con = mysql.createConnection({
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

    app.get("/", function (req, res) {
        if (req.session.loggedIn) {
            let doc = fs.readFileSync("../app/html/index.html", "utf8");
            res.set("Server", "Wazubi Engine");
            res.set("X-Powered-By", "Wazubi");
            res.send(doc);
        } else {
            res.redirect("/loginHTML");

        }
    });

    app.get("/loginHTML", function (req, res) {
        let doc = fs.readFileSync("../app/html/login.html", "utf8");
        res.send(doc);
    });

    app.get("/toptenarticles", function (req, res) {
        let formatOfResponse = req.query["format"];
        if (formatOfResponse == "html") {
            res.setHeader("Content-Type", "text/html");
            res.send(fs.readFileSync("../app/data/toparticles.html", "utf8"));
        } else if (formatOfResponse == "json") {
            res.setHeader("Content-Type", "application/json");
            res.send(fs.readFileSync("../app/data/toparticles.js", "utf8"));
        } else {
            res.send({ status: "fail", msg: "Wrong format!" });
        }
    });

    app.get("/getPosts", function (req, res) {
        const sql = 'SELECT id FROM A01451718_user WHERE email = ? AND password = ?'
        con.query(sql, [email, password], function (err, result) {
            const sql2 = 'SELECT * FROM A01451718_user_timeline WHERE user_id = ?'
            con.query(sql2, [result[0].id], function (err, result2) {
                console.log(result2);
                res.send({ status: "success", data: result2 });
            });

        });

    });

    let email;
    let password;
    // Notice that this is a "POST"
    app.post("/login", function (req, res) {
        res.setHeader("Content-Type", "application/json");
        email = req.body.email;
        password = req.body.password;

        // check to see if the user name matches in db
        const sql = `SELECT * FROM A01451718_user WHERE email = ? AND password = ?`;
        con.query(sql, [email, password], function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length > 0) {
                console.log("User found", result[0].email, result[0].password);
                // user authenticated, create a session
                req.session.loggedIn = true;
                req.session.email = email;
                req.session.name = password;
                req.session.save(function (err) {
                    // session saved. For analytics, we could record this in a DB
                });
                // Tells client side js that login was success
                res.send({ status: "success", msg: "Logged in." });


            } else {
                // Returns a fail if the user could not be logged in.
                res.send({ status: "fail", msg: "User account not found." });
            }
        });
    });

    app.post("/logout", function (req, res) {
        console.log("Hello");
        if (req.session) {
            req.session.destroy(function (error) {
                if (error) {
                    res.status(400).send("Unable to log out");
                } else {
                    res.redirect("/");
                }
            });
        }
    });

    let port = 8000;
    app.listen(port, function () {
        console.log("Example app listening on port " + port + "!");
    });
});
