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


// POST TO THE SERVER
document.getElementById("TEST").addEventListener("click", function (e) {
    e.preventDefault();

});

document.getElementById("JSONButton").addEventListener("click", function (e) {
    console.log("JSON");
    // ajaxGET("/toptenarticles?format=json", function (data) {
    //     console.log("Raw Data", data);
    //     let parsedData = JSON.parse(data);
    //     console.log("Parsed Data", parsedData);
    //     let str = "<table><tr><th>Title</th><th>Author</th><th>Subject</th><th>Date</th><th>Category</th></tr>";
    //     for (let i = 0; i < parsedData.length; i++) {
    //         str += "<tr>";
    //         str += "<td>" + parsedData[i].title + "</td>";
    //         str += "<td>" + parsedData[i].author + "</td>";
    //         str += "<td>" + parsedData[i].subject + "</td>";
    //         str += "<td>" + parsedData[i].date + "</td>";
    //         str += "<td>" + parsedData[i].category + "</td>";
    //         str += "</tr>";
    //     }
    //     str += "</table>";
    //     console.log(str);
    //     document.getElementById("JSONDATA").innerHTML = str;
    // });

    ajaxGET("/getPosts", function (result) {

        console.log("Cookies " + result);
        console.log(JSON.parse(result));
        let parsedData = JSON.parse(result);
        let str = "<table><tr><th>Date</th><th>Text</th><th>Post Time</th><th>View Count</th></tr>";
        for (let i = 0; i < parsedData.data.length; i++) {
            str += "<tr>";
            str += "<td>" + parsedData.data[i].post_date + "</td>";
            str += "<td>" + parsedData.data[i].post_text + "</td>";
            str += "<td>" + parsedData.data[i].post_time + "</td>";
            str += "<td>" + parsedData.data[i].views + "</td>";
            str += "</tr>";
        }
            str += "</table>";
            console.log(str);
            document.getElementById("JSONDATA").innerHTML = str;
    });
});
