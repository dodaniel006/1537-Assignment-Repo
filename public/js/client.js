console.log("client.js loaded.");

function ajaxGET(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            //console.log('responseText:' + xhr.responseText);
            callback(this.responseText);
        } else {
            console.log(this.status);
        }
    }
    xhr.open("GET", url);
    xhr.send();
}

document.querySelector("#weekdaysHTML").addEventListener("click", function (e) {
    ajaxGET("/weekdays?format=json", function (data) {
        console.log("Hello there");
        // since it's HTML, let's drop it right in
        document.getElementById("weekdaysText").innerHTML = data;
    });
});

document.querySelector("#weekdaysJSON").addEventListener("click", function (e) {
    ajaxGET("/weekdays?format=json", function (data) {
        console.log("Before parsing", data);
        // this call is JSON so we have to parse it:
        let parsedData = JSON.parse(data);
        console.log("After parsing", parsedData);
        let str = "<ol>"
        for (let i = 0; i < parsedData.length; i++) {
            str += "<li>" + parsedData[i] + "</li>";
        }
        str += "</ol>";
        document.getElementById("weekdaysJSON").innerHTML = str;
    });
});
