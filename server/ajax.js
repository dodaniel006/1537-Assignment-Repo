const express = require("express");
const session = require("express-session");
const app = express();
app.use(express.json()); // For parsing application/json
const fs = require("fs");
const { JSDOM } = require('jsdom');
const { loginUser } = require('./mySQL'); // Adjust the path if necessary
const mysql = require('mysql');

app.use("/js", express.static("../public/js"));
app.use("/css", express.static("../public/css"));
app.use("/img", express.static("../public/img"));
app.use("/fonts", express.static("../public/fonts"));

app.use(session(
    {
        secret: "extra text that no one will guess",
        name: "wazaSessionID",
        resave: false,
        // create a unique identifier for that client
        saveUninitialized: true
    })
);



var con = mysql.createConnection({
    host: "localhost",
    user: "Daniel",
    password: "password123",
    database: "assignment6"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");


    app.get("/", function (req, res) {
        let doc = fs.readFileSync("../app/html/index.html", "utf8");
        res.send(doc);
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

    // Notice that this is a "POST"
    app.post("/login", function (req, res) {
        res.setHeader("Content-Type", "application/json");

        console.log("What was sent", req.body.email, req.body.password);

        // check to see if the user name matches
        /*
         * IMPORTANT: THIS IS WHERE YOU WOULD PERFORM A CHECK IN THE DB INSTEAD OF
         *            HARD CODING THE VALUES HERE !!!
         */
        console.log("hello");
        const sql = `SELECT * FROM A01451718_user WHERE email = ? AND password = ?`;
        con.query(sql, [req.body.email, req.body.password], function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length > 0) {
                console.log("User found", result[0].email, result[0].password);
                // user authenticated, create a session
                req.session.loggedIn = true;
                req.session.email = req.body.email;
                req.session.name = req.body.password;
                req.session.save(function (err) {
                    // session saved. For analytics, we could record this in a DB
                });
                // all we are doing as a server is telling the client that they
                // are logged in, it is up to them to switch to the profile page
                res.send({ status: "success", msg: "Logged in." });
            } else {
                // server couldn't find that, so use AJAX response and inform
                // the user. when we get success, we will do a complete page
                // change. Ask why we would do this in lecture/lab :)
                res.send({ status: "fail", msg: "User account not found." });
            }
        });
    });

    let port = 8000;
    app.listen(port, function () {
        console.log("Example app listening on port " + port + "!");
    });
});
