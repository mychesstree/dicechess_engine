if (sessionStorage.getItem("loggedin") != null) {
  // replaces the innerHTML of loggedin tag with the username and a log out button
  document.getElementById("loggedin").innerHTML =
    '<td colspan="5"><b> welcome ' +
    sessionStorage.getItem("loggedin") +
    '</b> <button onclick = "logout_event()">log out</button></td>';

  // removes login button
  document.getElementById("loginbutton").remove();

  // list of friends
  document.getElementById("friends").innerHTML =
    "<tr>" +
    '<td colspan="3"><br>friends online: 1</td>' + // add number of friends
    "</tr>" +
    "<tr>" +
    "<td>1.&nbsp;&nbsp;</td>" + // add which friend
    "<td>" +
    '<section class="circleAvatar" style="background-color: #d67878"></section>' + // their color
    "</td>" +
    "<td>" +
    '<section class="roundRectangle" style="background-color: #ffdddd">adi</section>' + // their username and online?
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>2.&nbsp;&nbsp;</td>" + // add which friend
    "<td>" +
    '<section class="circleAvatar" style="background-color: #5c1f1f"></section>' + // their color
    "</td>" +
    "<td>" +
    '<section class="roundRectangle" style="background-color: #ffffff">kieran</section>' + // their username and online?
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>3.&nbsp;&nbsp;</td>" +
    "<td>" +
    '<section class="circleAvatar" style="background-color: #ffffff"></section>' +
    "</td>" +
    "<td>" +
    '<section class="roundRectangle" style="background-color: #ffffff"><a href="html/social.html">add friend +</a></section>' +
    "</td>" +
    "</tr>";

  document.getElementById("topinfo").style.display = "block";
}

function logout_event() {
  sessionStorage.removeItem("loggedin");
  sessionStorage.removeItem("token");
  location.reload();
}

function login() {
  window.location.replace("html/login.html");
}
