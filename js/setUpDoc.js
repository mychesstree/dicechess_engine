// functions that power htmls ----------------------------------------------------------

// script for revNodes ✔️ -------------------------------------------------------------
const timer = document.getElementById("timer");

var min = 0;
var sec = 0;
var stoptime = true;

function getStopTime() {
  return stoptime;
}
function setStopTime(time) {
  stoptime = time;
}

function startTimer() {
  if (stoptime == true) {
    stoptime = false;
    timerCycle();
  }
}
function stopTimer() {
  if (stoptime == false) {
    stoptime = true;
  }
}

function timerCycle() {
  if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);

    sec = sec + 1;

    if (sec == 60) {
      min = min + 1;
      sec = 0;
    }

    if (sec < 10 || sec == 0) {
      sec = "0" + sec;
    }
    if (min < 10 || min == 0) {
      min = "0" + min;
    }

    timer.innerHTML = min + ":" + sec;

    setTimeout("timerCycle()", 1000); // waits a second
  }
}

function resetTimer() {
  timer.innerHTML = "00:00:00";
  sec = 0;
  min = 0;
}

//collapseables
/*function initialiseCollapse() {
  var coll = document.getElementById("collapseIt");

  coll.addEventListener("click", function () {
    var content = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < content.length; i++) {
      // ⚡: O(n)
      if (content[i].style.display === "block") {
        content[i].style.display = "none";
      } else {
        content[i].style.display = "block";
      }
    }
  });
}*/

// arrows ✔️ ---------------------------------------------------------------------------
function initialiseArrows() {
  // changes mode for annotations and submitting moves
  var mode = document.getElementById("showAnnotations");
  mode.addEventListener("click", function () {
    if (mode.style.backgroundColor === "rgb(248, 180, 181)") {
      mode.style.backgroundColor = "white";

      document.getElementById("primary_canvas").style.display = "none";
      document.getElementById("drawing_canvas").style.display = "none";
    } else {
      mode.style.backgroundColor = "#f8b4b5";
      document.getElementById("primary_canvas").style.display = "block";
      document.getElementById("drawing_canvas").style.display = "block";
    }
  });
  ChessboardArrows("board_wrapper"); // initializes arrows
}
// --------------------------------------------------------------------------------------

// 🚧 Versions numbers and description storage and functions ----------------------------
var version = [
  "The one that started it<br />ALL",
  "Server workin",
  "HTML UI mostly done",
  "Calendar working<br />Login stuff<br />Leaderboards",
  "Dice chess 🎲<br />UI finalized",
  "Chess.js --> Chessboard.js<br />Highlight legal moves and Dice chess almost done 🎲",
  "Engine works 🤖<br />Progress on Tree datastructure",
  "Engine figured out<br />Eval Bar added<br />.txt-->.csv",
  "research",
  "PERN and Database brainstorm",
  "JWT research and making database user table",
  "Color picker 🎨",
  "Got database connection working 🔁",
  "tree displaying 📱",
  "CSV download and local storage ⬇️",
  "Arrows ➡️",
  "login works<br />database connects to server<br />JWT authentication 🔒",
  "help.html<br />Calendar is specific to user 📅",
  "discord configured<br />plan figured 🔵",
  "Download CSV working<br />Rethinking js file structure 📁",
  "arrow keys and timer and RevNodes UI done 📺",
  "anki rev quizzes user 📝",
  "confetti 🎉",
  "new calendar heatmap 📅",
  "tree 🌲",
  "memChess 💭",
  "☰ Settings",
  "Rethinking tree Structure 🤔",
  "Engine into memChess 🤖<br />Dice Chess UI change 🎲",
  "Black Tree Editor ⬛️",
  "White is fully functional ⬜<br />besides new challenge generation",
  "Black is fully functional",
  "Whole bunch of bug fixes<br />pgn input fixes",
  "QOL update",
  "Difficulty slider",
  "calendar bug and<br />you can put nodes thru board in edit mode after selecting node",
  "Comments and labeling opening<br />previous trees wont work :(<br />clear local storage in dev tools under application and start anew",
  "dynamic eval bar and comment ui improvement",
  "copy and read all data",
  "Node size based on popularity of node",
];

var currentVersion = version.length - 1;

// makes the length look like a version ✔️
function getVersionNumber() {
  return (
    parseInt((currentVersion + 1) / 100) +
    "." +
    parseInt((currentVersion + 1) / 10) +
    "." +
    parseInt((currentVersion + 1) % 10)
  );
}

function setDifficulty() {
  var difficulty = document.getElementById("relationship-status-slider").value;
  localStorage.setItem("difficulty", difficulty);
  document.getElementById("valueOfDifficulty").innerHTML = +difficulty;
}

function getDifficulty() {
  document.getElementById("valueOfDifficulty").innerHTML =
    localStorage.getItem("difficulty");
  return localStorage.getItem("difficulty") != null
    ? localStorage.getItem("difficulty")
    : 5;
}

// functions for versions.html buttons and description ✔️
function setCurVersion() {
  document.getElementById("versionTab").innerHTML =
    "&nbsp;" + getVersionNumber() + "&nbsp;";

  document.getElementById("versionDescription").innerHTML =
    version[currentVersion];
}
function moveOlderVersion() {
  if (currentVersion > 0) {
    currentVersion -= 1;
  }
  setCurVersion();
}
function moveNewerVersion() {
  if (currentVersion < version.length - 1) {
    currentVersion += 1;
  }
  setCurVersion();
}
// ------------------------------------------------------------------------------------------

// index.html setup ✔️ ----------------------------------------------------------------------
function setVersionNum() {
  document.getElementById("version").innerHTML =
    '<a href="html/versions.html"> version ' +
    getVersionNumber() +
    "&nbsp;&nbsp;&nbsp;</a>";
}

// left and right buttons for move 🚧 --------------------------------------------------------

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == "38") {
    // up arrow
  } else if (e.keyCode == "40") {
    // down arrow
  } else if (e.keyCode == "37") {
    // left arrow
    undoMove();
  } else if (e.keyCode == "39") {
    // right arrow
    redoMove();
  }
}

function setReviewNum() {
  var now = new Date();
  now.setDate(now.getDate() + 1);
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var timestampEnd = parseInt(startOfDay / 1000);

  var counter = 0;

  if (localStorage.getItem("white") != null) {
    treeGenerator(localStorage.getItem("white"));
    for (var i = 0; i < arrOfNodes.length; i++) {
      if (parseInt(arrOfNodes[i].unixDate) < timestampEnd) {
        counter++;
      }
    }
    document.getElementById("whiteInfoRev").innerHTML = counter;
  }

  counter = 0;

  if (localStorage.getItem("black") != null) {
    arrOfNodes = [];
    console.log(treeGenerator(localStorage.getItem("black")));
    for (var i = 0; i < arrOfNodes.length; i++) {
      if (parseInt(arrOfNodes[i].unixDate) < timestampEnd) {
        counter++;
      }
    }
    document.getElementById("blackInfoRev").innerHTML = counter;
  }
}

function swapTheCreateAndManual() {
  if (document.getElementById("manualEditor").style.display === "none") {
    document.getElementById("manualEditor").style.display = "block";
    document.getElementById("createTree").style.display = "none";
  } else {
    document.getElementById("manualEditor").style.display = "none";

    if (localStorage.getItem(localStorage.getItem("orientation")) === null)
      document.getElementById("createTree").style.display = "block";
    else if (localStorage.getItem(localStorage.getItem("orientation")) === "")
      document.getElementById("createTree").style.display = "block";
  }
}

// Fading for alerts --------------------------------------------------------------------------

function showAlert(str) {
  document.getElementById("alert").innerHTML = str;
  document.getElementById("alert-container").style.display = "block";
}

// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------

// Finds out cur page and then intializes html -----------------------------------------------
var path = window.location.pathname;
var page = path.split("/").pop();
// console.log(page);

if (page === "reviewNodes.html") {
  if (localStorage.getItem("orientation") === "black") {
    document.getElementById("evalBarBlack").style.backgroundColor = "white";
    document.getElementById("evalBarWhite").style.backgroundColor = "black";
  }
  startTimer();
  //initialiseCollapse();
  initialiseArrows();
  setUpCurrentTreeVariables();
  document.onkeydown = checkKey;
}

if (page === "editor.html") {
  if (localStorage.getItem("orientation") === "black") {
    document.getElementById("evalBarBlack").style.backgroundColor = "white";
    document.getElementById("evalBarWhite").style.backgroundColor = "black";
  }
  //initialiseCollapse();
  initialiseArrows();
  document.onkeydown = checkKey;

  document.getElementById("whichTree").innerHTML =
    localStorage.getItem("orientation");

  // will make the create tree input invisible
  if (localStorage.getItem("orientation") === "black") {
    document.getElementById("firstMove").style.display = "none";
  }

  // check if the tree exists
  // and prompt user to make one if not
  if (localStorage.getItem(localStorage.getItem("orientation")) === null) {
    document.getElementById("createTree").style.display = "block";
  } else {
    treeGenerator(localStorage.getItem(localStorage.getItem("orientation")));
    viewTreeSetup();
  }

  //setUpCurrentTreeVariables();
  //setTreeData();
}

if (page === "versions.html") {
  setCurVersion();
}

if (page === "index.html" || page === "") {
  setReviewNum();
  setVersionNum();
  loadCalHeat();
  document.getElementById("relationship-status-slider").value = getDifficulty();
}

// disables right click to open context menu
window.addEventListener(
  "contextmenu",
  function (e) {
    // do something here...
    e.preventDefault();
  },
  false
);
