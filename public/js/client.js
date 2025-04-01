function ajaxGET(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(this.responseText);
        } else {
            console.log(this.status);
        }
    };
    xhr.open("GET", url);
    xhr.send();
}

document.getElementById("HTMLButton").addEventListener("click", function (e) {
    ajaxGET("/toptenarticles?format=html", function (data) {
        console.log("Hello there");
        document.getElementById("HTMLDATA").innerHTML = data;
    });
});

document.getElementById("LoginButton").addEventListener("click", function () {
    window.location.href = "/loginHTML";
});

document.getElementById("JSONButton").addEventListener("click", function (e) {
    console.log("JSON");
    ajaxGET("/toptenarticles?format=json", function (data) {
        console.log("Raw Data", data);
        let parsedData = JSON.parse(data);
        console.log("Parsed Data", parsedData);
        let str = "<table><tr><th>Title</th><th>Author</th><th>Subject</th><th>Date</th><th>Category</th></tr>";
        for (let i = 0; i < parsedData.length; i++) {
            str += "<tr>";
            str += "<td>" + parsedData[i].title + "</td>";
            str += "<td>" + parsedData[i].author + "</td>";
            str += "<td>" + parsedData[i].subject + "</td>";
            str += "<td>" + parsedData[i].date + "</td>";
            str += "<td>" + parsedData[i].category + "</td>";
            str += "</tr>";
        }
        str += "</table>";
        console.log(str);
        document.getElementById("JSONDATA").innerHTML = str;
    });
});
