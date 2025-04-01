console.log("login.js loaded");

// function ajaxGET(url, callback) {

//     const xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//         if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
//             //console.log('responseText:' + xhr.responseText);
//             callback(this.responseText);

//         } else {
//             console.log(this.status);
//         }
//     }
//     xhr.open("GET", url);
//     xhr.send();
// }

function ajaxPOST(url, callback, data) {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            //console.log('responseText:' + xhr.responseText);
            callback(this.responseText);

        } else {
            console.log(this.status);
        }
    }
    xhr.open("POST", url);
    // make it clear that our call is an AJAX call
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // we are sending form data, we must inform the server of this
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}
// POST TO THE SERVER
document.querySelector("#submit").addEventListener("click", function (e) {
    e.preventDefault();
    let email = document.getElementById("inputEmail");
    let password = document.getElementById("inputPassword");


    const vars = { "email": email.value, "password": password.value };
    console.log("query parameters", vars);
    ajaxPOST("/login", function (data) {

        if (data) {
            let dataParsed = JSON.parse(data);
            console.log(dataParsed);
            if (dataParsed.status == "fail") {
                console.log("fail", dataParsed.msg);
                alert("Incorrect Email or Password! Try again.");
            } else {
                window.location.replace("/");
            }
        }

    }, vars);
});