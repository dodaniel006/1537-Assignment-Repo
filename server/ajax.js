const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");

app.use("/js", express.static("../public/js"));
app.use("/css", express.static("../public/css"));
app.use("/img", express.static("../public/img"));
app.use("/fonts", express.static("../public/fonts"));

app.get("/", function (req, res) {
    let doc = fs.readFileSync("../app/html/index.html", "utf8");
    res.send(doc);
});

app.get("/login", function (req, res) {
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

let port = 8000;
app.listen(port, function () {
    console.log("Example app listening on port " + port + "!");
});
