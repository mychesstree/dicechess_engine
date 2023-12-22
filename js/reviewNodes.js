// replace Reset with Retry
// show comment later after motivation
// Write to tree and then parse tree to get data

// reviewNodes Programing 🚧 --------------------------------------------------------------------------
var revToday = [];
var copyBackToArrOfNodes = [];

var userMadeMoveFlag = false;
var userMadeResFlag = false;
var itsNotDoneYet = false;

const encouragement = [
  "Believe In Yourself",
  "Trust Your Gut",
  "Big Brain",
  "Visualize",
];

// unix
var difficulty =
  localStorage.getItem("difficulty") === null
    ? 1
    : parseInt(localStorage.getItem("difficulty")) < 5
    ? 1 / (5 - parseInt(localStorage.getItem("difficulty")))
    : parseInt(localStorage.getItem("difficulty")) - 4;

const unixBenchMarks = [
  Math.round(100000 * difficulty),
  Math.round(200000 * difficulty),
  Math.round(400000 * difficulty),
  Math.round(1000000 * difficulty),
  Math.round(1600000 * difficulty),
  Math.round(2500000 * difficulty),
  Math.round(4000000 * difficulty),
  Math.round(64000000 * difficulty),
  Math.round(100000000 * difficulty),
  Math.round(1000000000 * difficulty),
  // 100000, 200000, 400000, 1000000, 1600000, 2500000, 4000000, 64000000,
  // 100000000, 1000000000,
];
const dateBenchMarks = [
  Math.round(115 * difficulty) / 100,
  Math.round(231 * difficulty) / 100,
  Math.round(463 * difficulty) / 100,
  Math.round(1157 * difficulty) / 100,
  Math.round(1852 * difficulty) / 100,
  Math.round(2893 * difficulty) / 100,
  Math.round(4630 * difficulty) / 100,
  Math.round(7407 * difficulty) / 100,
  Math.round(11574 * difficulty) / 100,
  Math.round(115740 * difficulty) / 100,
];

console.log("the arrs are: ");
console.log(unixBenchMarks);
console.log(dateBenchMarks);

function setUpCurrentTreeVariables() {
  console.log(
    treeGenerator(localStorage.getItem(localStorage.getItem("orientation")))
  );
  getTodayAndPrevNodes();
}

// When page loads call this which parses tree and picks pgn
// recursive solution to populating the revToday[]
function getTodayAndPrevNodes() {
  var now = new Date();
  now.setDate(now.getDate() + 1);
  var endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var timestampEnd = parseInt(endOfDay / 1000); // gets the end of today
  console.log(timestampEnd);
  for (var i = 0; i < arrOfNodes.length; i++) {
    if (arrOfNodes[i].unixDate < timestampEnd) revToday.push(arrOfNodes[i]);
  }
  reviewToday();
}

// Then this which takes in array of nodes that have the date of today or before
async function reviewToday() {
  if (revToday.length === 0) {
    alert("you did your nodes for today");
  }
  while (revToday.length > 0) {
    if (document.getElementById("tree-container") != null)
      document.getElementById("tree-container").innerHTML = "";
    document.getElementById("howMuchMore").innerHTML = revToday.length;

    // check 1
    reviewNode(revToday[0]);

    userMadeMoveFlag = false;

    // check 2
    await waitForPlayerMove();

    document.getElementById("reveal").style.display = "block";
    document.getElementById("chessComment").value = "";
    userMadeResFlag = false;

    // check 3
    await waitForPlayerRes();

    // resets the bookmark button, board, timer, and reveal table
    document.getElementById("bookmarkbutton").style.backgroundColor =
      "rgb(255, 255, 255)";
    document.getElementById("reveal").style.display = "none";
    resetBoard();
    resetTimer();

    // increments how much review was done today
    // removes one and starts over
    if (itsNotDoneYet) {
      revToday.shift();
    } else {
      copyBackToArrOfNodes.push(revToday.shift());
    }
    itsNotDoneYet = false;

    // when done with everything then it saves the progress
    if (revToday.length === 0) {
      saveProgress();
      document.getElementById("chessComment").value = "-> logo to go back";
      document.getElementById("resetEntireLeft").innerHTML =
        'YOU DID IT YAY<canvas id="confettiCanvas"></canvas>';
      var confettiElement = document.getElementById("confettiCanvas");
      var confettiSettings = { target: confettiElement };
      var confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
      break;
    }
  }
}

// TODO change it so that the buttons have different onclicks
function revValUtil(node) {
  var index = node.depth;

  document.getElementById("easyNexttime").innerHTML =
    dateBenchMarks[parseInt(index) + 2];
  document.getElementById("goodNexttime").innerHTML =
    dateBenchMarks[parseInt(index) - -1];

  if (dateBenchMarks[index - 1] === undefined) {
    document.getElementById("hardNexttime").innerHTML = "again";
  } else {
    document.getElementById("hardNexttime").innerHTML =
      dateBenchMarks[index - 1];
  }

  document.getElementById("buttonsForDepth").style.transform =
    "translate(0,12px)";
}

function bookMarkNode() {
  // check the color of the button
  if (
    document.getElementById("bookmarkbutton").style.backgroundColor ===
    "rgb(255, 255, 255)"
  ) {
    // change color and push to bookmark[]
    document.getElementById("bookmarkbutton").style.backgroundColor =
      "rgb(255, 200, 200)";
    bookmarked.push(revToday[0].index);
    //console.log(bookmarked);
  } else {
    // change color and push to bookmark[]
    document.getElementById("bookmarkbutton").style.backgroundColor =
      "rgb(255, 255, 255)";

    // this removes all occurances by myId
    for (var i = 0; i < bookmarked.length; i++) {
      //console.log(bookmarked[i].myId)
      if (bookmarked[i] === revToday[0].index) {
        bookmarked.splice(i, 1);
      }
    }
    //console.log(bookmarked);
  }
}

function waitForPlayerMove() {
  // change to request the user clicking on button
  return new Promise((resolve) => {
    setTimeout(function run() {
      if (userMadeMoveFlag) {
        userMadeMoveFlag = false;
        var arrOfMoves = game.history({ verbose: true });
        var storedMove = document
          .getElementById("whatWasStored")
          .innerHTML.split(" ");

        if (
          arrOfMoves[arrOfMoves.length - 1].san ===
          storedMove[storedMove.length - 1]
        ) {
          document.getElementById("cloudForStored").style.backgroundColor =
            "rgba(255, 204, 204)";
          document.getElementById("whatWasStored").style.color =
            "rgba(0, 0, 0)";
          document.getElementById("whatWasStored").innerHTML =
            document.getElementById("whatWasStored").innerHTML + " ☑";
        } else {
          document.getElementById("cloudForStored").style.backgroundColor =
            "rgba(126, 49, 49)";
          document.getElementById("whatWasStored").style.color =
            "rgba(255, 255, 255)";
          document.getElementById("whatWasStored").innerHTML =
            document.getElementById("whatWasStored").innerHTML + " ☒";
        }
        resolve();
      } else {
        setTimeout(run, 1000); // waits 1 second before rechecking
      }
    }, 1000);
  });
}

function waitForPlayerRes() {
  // change to request the user clicking on button
  return new Promise((resolve) => {
    setTimeout(function run() {
      if (userMadeResFlag) {
        userMadeResFlag = false;
        resolve();
      } else {
        setTimeout(run, 500); // waits 1/2 second before rechecking
      }
    }, 1000);
  });
}

function recordRevResponse(str) {
  if (
    str === "hardNexttime" &&
    document.getElementById("hardNexttime").innerHTML === "again"
  ) {
    revToday[0].depth = -1;
    revToday.push(revToday[0]);
    userMadeResFlag = true;
    itsNotDoneYet = true;
    return;
  }

  if (str === "trashRes") {
    revToday[0].unixDate = "10000000000";
    userMadeResFlag = true;
    return;
  }
  // console.log("current Unix Date is: " + Math.floor(Date.now() / 1000));
  var newUnixDate =
    Math.floor(Date.now() / 1000) +
    unixBenchMarks[
      dateBenchMarks.indexOf(
        takeStringIntoDecimal(document.getElementById(str).innerHTML)
      )
    ];

  console.log(takeStringIntoDecimal(document.getElementById(str).innerHTML));
  // console.log("The new unix date is: " + newUnixDate + "");
  var newDepth = dateBenchMarks.indexOf(
    takeStringIntoDecimal(document.getElementById(str).innerHTML)
  );
  revToday[0].unixDate = newUnixDate + "";
  revToday[0].depth = newDepth + "";

  console.log(revToday[0]);
  userMadeResFlag = true;
}

function takeStringIntoDecimal(str) {
  var index = str.indexOf(".");
  var firstHalf = str.substring(0, index);
  var secondHalf = str.substring(index + 1);

  var firstDone = parseInt(firstHalf);
  for (var i = 0; i < 4 - secondHalf.length; i++) {
    secondHalf = secondHalf + "0";
  }
  return firstDone + parseInt(secondHalf) / 1000;
}

// Calls this function in a loop
function reviewNode(node) {
  let curNode = node;
  let pgn = ""; // needs to be calculated by parsing parent nodes till root

  var currentLine = [];
  while (curNode.parent != null) {
    currentLine.unshift(curNode);
    //if (curNode.parent.wMove === "" && curNode.parent.bMove === "") break;
    curNode = curNode.parent;
  }

  console.log(currentLine);

  if (localStorage.getItem("orientation") === "white") {
    for (var i = 0; i < currentLine.length; i++) {
      pgn +=
        " " +
        (i + 1) +
        ". " +
        currentLine[i].parent.wMove +
        " " +
        currentLine[i].bMove;
    }
  }
  if (localStorage.getItem("orientation") === "black") {
    for (var i = 0; i < currentLine.length; i++) {
      if (i === currentLine.length - 1) {
        pgn += " " + (i + 1) + ". " + currentLine[i].wMove;
      } else {
        pgn +=
          " " +
          (i + 1) +
          ". " +
          currentLine[i].wMove +
          " " +
          currentLine[i].bMove;
      }
    }
  }

  console.log(pgn);

  var curGame = new Chess();
  curGame.load_pgn(pgn);

  // special chess object converts pgn to chessboard language and displays position

  displayPos(curGame.history({ verbose: true }));
  updateOtherInfo(node);
  revValUtil(node);

  // play the moves on board 1 by 1
}

function displayPos(curGameHistory) {
  for (var i = 0; i < curGameHistory.length; i++) {
    onDrop(curGameHistory[i].from, curGameHistory[i].to);
    board.position(game.fen());
  }
}

// future feature Highlight move

// EDIT THIS ---------------------------------------------------------------------------
function updateOtherInfo(node) {
  console.log(node);
  if (localStorage.getItem("orientation") === "white") {
    document.getElementById("whatWasStored").innerHTML =
      "&nbsp;you stored " + node.wMove;
  }
  if (localStorage.getItem("orientation") === "black") {
    document.getElementById("whatWasStored").innerHTML =
      "&nbsp;you stored " + node.bMove;
  }

  // gives encouragement to the user
  document.getElementById("chessComment").value =
    encouragement[Math.floor(Math.random() * encouragement.length)];
}

// exactly as it sounds
function stockfishAnalysis() {
  console.log("analysis(not programmed yet)");
}

// if blunder then retry button
function retryRev() {
  console.log("retry(not programmed yet)");
}

// How hard was it
// listen for the save button or end to save stuff
function saveDepth() {
  handleCalendar(); // saves the calendar
}

function CalStrToArr(str) {
  return str
    .replace("{", "")
    .replace("}", "")
    .replaceAll('"', "")
    .replaceAll("{", "")
    .replaceAll(" ", "")
    .replaceAll(":", ",")
    .split(",");
}

function CalArrToStr(arr) {
  var calNewStr = "{";
  for (var i = 0; i < arr.length; i += 2) {
    calNewStr += '"' + arr[i] + '":' + arr[i + 1] + ",";
  }
  calNewStr = calNewStr.substring(0, calNewStr.length - 1) + "}";
  return calNewStr;
}

function findDebtAndReplace(arr) {
  var now = new Date();

  now.setDate(now.getDate() + 1);
  var endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var timestampEnd = parseInt(endOfDay / 1000);

  for (var i = 0; i < arr.length; i += 2) {
    if (parseInt(arr[i]) < timestampEnd && parseInt(arr[i + 1]) < 0) {
      console.log("timestamp that occured: " + arr[i]);
      arr.splice(i, 2);
    }
  }

  now.setDate(now.getDate() - 1);
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var timestampStart = parseInt(startOfDay / 1000);

  if (arr.includes(timestampStart + "")) {
    var index = arr.indexOf(timestampStart + "");
    console.log("added to this:");
    console.log(arr[index + 1]);
    var toAdd = parseInt(arr[index + 1]) + copyBackToArrOfNodes.length;
    arr[index + 1] = toAdd + "";
  } else {
    arr.push(timestampStart);
    arr.push(copyBackToArrOfNodes.length);
  }

  return arr;
}

function findMoreDebt(arr) {
  console.log(arr);
  for (var i = 0; i < arrOfNodes.length; i++) {
    if (arr.includes(arrOfNodes[i].unixDate)) {
      // do nothing
    } else {
      arr.push(parseInt(arrOfNodes[i].unixDate));
      arr.push(-1);
    }
  }
  return arr;
}

function handleCalendar() {
  //var exampleCalendar = '{ "1628395200": 20 , "1628400000": 5, "1629000000": -5}';
  var calStr;

  if (localStorage.getItem("calendar") != null) {
    calStr =
      localStorage.getItem("calendar").length > 20000
        ? ""
        : localStorage.getItem("calendar");
  } else {
    calStr = "";
  }

  var calArr = (calStr = "" ? [1000, -1] : CalStrToArr(calStr));

  var newCalArr = findMoreDebt(calArr);

  //console.log("arr of added: ");
  //console.log(newCalArr);

  var newnewCalArr = findDebtAndReplace(newCalArr);

  for (var i = 0; i < newnewCalArr.length; i++) {
    if (newnewCalArr[i] === "") newnewCalArr.splice(i, 1);
  }
  console.log(newnewCalArr);

  localStorage.setItem("calendar", CalArrToStr(newnewCalArr));
}

// called at the end
function saveProgress() {
  // revToday --> arrOfNodes
  // console.log(copyBackToArrOfNodes);
  // console.log("before:");
  // console.log(arrOfNodes);

  // for (var i = 0; i < copyBackToArrOfNodes.length; i++) {
  //   for (var j = 0; j < arrOfNodes.length; j++) {
  //     if (copyBackToArrOfNodes[i].index === arrOfNodes[j].index) {
  //       arrOfNodes[j] = copyBackToArrOfNodes[i];
  //     }
  //   }
  // }

  // console.log("after:");
  // console.log(arrOfNodes);

  handleCalendar();
  // saves progress
  localStorage.setItem(
    localStorage.getItem("orientation"),
    takeArrayOfNodesIntoStr()
  );
}

// ✔️ No touch --------------------------------------------------------------------------------
// https://github.com/Agezao/confetti-js
// makes confetti ------------------------------------------------------------------------------
function ConfettiGenerator(params) {
  //////////////
  // Defaults
  var appstate = {
    target: "confetti-holder", // Id of the canvas
    max: 80, // Max itens to render
    size: 1, // prop size
    animate: true, // Should animate?
    respawn: true, // Should confettis be respawned when getting out of screen?
    props: ["circle", "square", "triangle", "line"], // Types of confetti
    colors: [
      [255, 0, 128],
      [255, 172, 191],
      [165, 30, 105],
      [150, 43, 59],
    ], // Colors to render confetti
    clock: 25, // Speed of confetti fall
    interval: null, // Draw interval holder
    rotate: false, // Whenever to rotate a prop
    start_from_edge: false, // Should confettis spawn at the top/bottom of the screen?
    width: window.innerWidth, // canvas width (as int, in px)
    height: window.innerHeight, // canvas height (as int, in px)
  };

  //////////////
  // Setting parameters if received
  if (params) {
    if (params.target) appstate.target = params.target;
    if (params.max) appstate.max = params.max;
    if (params.size) appstate.size = params.size;
    if (params.animate !== undefined && params.animate !== null)
      appstate.animate = params.animate;
    if (params.respawn !== undefined && params.respawn !== null)
      appstate.respawn = params.respawn;
    if (params.props) appstate.props = params.props;
    if (params.colors) appstate.colors = params.colors;
    if (params.clock) appstate.clock = params.clock;
    if (params.start_from_edge !== undefined && params.start_from_edge !== null)
      appstate.start_from_edge = params.start_from_edge;
    if (params.width) appstate.width = params.width;
    if (params.height) appstate.height = params.height;
    if (params.rotate !== undefined && params.rotate !== null)
      appstate.rotate = params.rotate;
  }

  //////////////
  // Early exit if the target is not the correct type, or is null
  if (
    typeof appstate.target != "object" &&
    typeof appstate.target != "string"
  ) {
    throw new TypeError("The target parameter should be a node or string");
  }

  if (
    (typeof appstate.target == "object" &&
      (appstate.target === null ||
        !appstate.target instanceof HTMLCanvasElement)) ||
    (typeof appstate.target == "string" &&
      (document.getElementById(appstate.target) === null ||
        !document.getElementById(appstate.target) instanceof HTMLCanvasElement))
  ) {
    throw new ReferenceError(
      "The target element does not exist or is not a canvas element"
    );
  }

  //////////////
  // Properties
  var cv =
    typeof appstate.target == "object"
      ? appstate.target
      : document.getElementById(appstate.target);
  var ctx = cv.getContext("2d");
  var particles = [];

  //////////////
  // Random helper (to minimize typing)
  function rand(limit, floor) {
    if (!limit) limit = 1;
    var rand = Math.random() * limit;
    return !floor ? rand : Math.floor(rand);
  }

  var totalWeight = appstate.props.reduce(function (weight, prop) {
    return weight + (prop.weight || 1);
  }, 0);
  function selectProp() {
    var rand = Math.random() * totalWeight;
    for (var i = 0; i < appstate.props.length; ++i) {
      var weight = appstate.props[i].weight || 1;
      if (rand < weight) return i;
      rand -= weight;
    }
  }

  //////////////
  // Confetti particle generator
  function particleFactory() {
    var prop = appstate.props[selectProp()];
    var p = {
      prop: prop.type ? prop.type : prop, //prop type
      x: rand(appstate.width), //x-coordinate
      y: appstate.start_from_edge
        ? appstate.clock >= 0
          ? -10
          : parseFloat(appstate.height) + 10
        : rand(appstate.height), //y-coordinate
      src: prop.src,
      radius: rand(4) + 1, //radius
      size: prop.size,
      rotate: appstate.rotate,
      line: Math.floor(rand(65) - 30), // line angle
      angles: [
        rand(10, true) + 2,
        rand(10, true) + 2,
        rand(10, true) + 2,
        rand(10, true) + 2,
      ], // triangle drawing angles
      color: appstate.colors[rand(appstate.colors.length, true)], // color
      rotation: (rand(360, true) * Math.PI) / 180,
      speed: rand(appstate.clock / 7) + appstate.clock / 30,
    };

    return p;
  }

  //////////////
  // Confetti drawing on canvas
  function particleDraw(p) {
    if (!p) {
      return;
    }

    var op = p.radius <= 3 ? 0.4 : 0.8;

    ctx.fillStyle = ctx.strokeStyle = "rgba(" + p.color + ", " + op + ")";
    ctx.beginPath();

    switch (p.prop) {
      case "circle": {
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.radius * appstate.size, 0, Math.PI * 2, true);
        ctx.fill();
        break;
      }
      case "triangle": {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(
          p.x + p.angles[0] * appstate.size,
          p.y + p.angles[1] * appstate.size
        );
        ctx.lineTo(
          p.x + p.angles[2] * appstate.size,
          p.y + p.angles[3] * appstate.size
        );
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "line": {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.line * appstate.size, p.y + p.radius * 5);
        ctx.lineWidth = 2 * appstate.size;
        ctx.stroke();
        break;
      }
      case "square": {
        ctx.save();
        ctx.translate(p.x + 15, p.y + 5);
        ctx.rotate(p.rotation);
        ctx.fillRect(
          -15 * appstate.size,
          -5 * appstate.size,
          15 * appstate.size,
          5 * appstate.size
        );
        ctx.restore();
        break;
      }
      case "svg": {
        ctx.save();
        var image = new window.Image();
        image.src = p.src;
        var size = p.size || 15;
        ctx.translate(p.x + size / 2, p.y + size / 2);
        if (p.rotate) ctx.rotate(p.rotation);
        ctx.drawImage(
          image,
          -(size / 2) * appstate.size,
          -(size / 2) * appstate.size,
          size * appstate.size,
          size * appstate.size
        );
        ctx.restore();
        break;
      }
    }
  }

  //////////////
  // Public itens
  //////////////

  //////////////
  // Clean actual state
  var _clear = function () {
    appstate.animate = false;
    clearInterval(appstate.interval);

    requestAnimationFrame(function () {
      ctx.clearRect(0, 0, cv.width, cv.height);
      var w = cv.width;
      cv.width = 1;
      cv.width = w;
    });
  };

  //////////////
  // Render confetti on canvas
  var _render = function () {
    cv.width = appstate.width;
    cv.height = appstate.height;
    particles = [];

    for (var i = 0; i < appstate.max; i++) particles.push(particleFactory());

    function draw() {
      ctx.clearRect(0, 0, appstate.width, appstate.height);

      for (var i in particles) particleDraw(particles[i]);

      update();

      if (appstate.animate) requestAnimationFrame(draw);
    }

    function update() {
      for (var i = 0; i < appstate.max; i++) {
        var p = particles[i];

        if (p) {
          if (appstate.animate) p.y += p.speed;

          if (p.rotate) p.rotation += p.speed / 35;

          if (
            (p.speed >= 0 && p.y > appstate.height) ||
            (p.speed < 0 && p.y < 0)
          ) {
            if (appstate.respawn) {
              particles[i] = p;
              particles[i].x = rand(appstate.width, true);
              particles[i].y = p.speed >= 0 ? -10 : parseFloat(appstate.height);
            } else {
              particles[i] = undefined;
            }
          }
        }
      }

      if (
        particles.every(function (p) {
          return p === undefined;
        })
      ) {
        _clear();
      }
    }

    return requestAnimationFrame(draw);
  };

  return {
    render: _render,
    clear: _clear,
  };
}
// --------------------------------------------------------------------------------------------
