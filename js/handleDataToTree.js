// Tree node ---------------------------------------------------------------------------------

// index,depth(first 4 digits for date and last for rev),parent,white,black
// Use length of root to determine if white or black
// use -1 to figure out if it is root
// Order of index matters (SORT IF NECESSARY)
// black has empty root

/*
root must be the first node in arrOfNodes
Example
"
0,0603,7,-1,e4|
1,0603,7,0,Nf3,d4|
2,0603,7,0,Nf3,Nc6|
3,0714,2,1,Bc4,Nc3|
4,0714,2,1,Nf6,Ne5|
"
*/

console.log(localStorage.getItem(localStorage.getItem("orientation"))); // put the treedata

var arrOfNodes = [];

const columnHeader = [
  "indexINDEX",
  "indexUNIXDATE",
  "indexDEPTH",
  "indexPARENT",
  "indexCOMMENT",
  "indexWMOVE",
  "indexBMOVE",
];

function Node(index, unixDate, depth, parent, comment, wMove, bMove) {
  this.index = index;
  this.unixDate = unixDate;
  this.depth = depth;
  this.parent = parent;
  this.comment = comment;
  this.wMove = wMove;
  this.bMove = bMove;
}

function treeGenerator(str) {
  // index,white,black,depth,parent

  var arr = str.split("|");
  var root = arr[0].split(",");
  // root node check if white or black
  // check if the node has no parent

  // ADDING ROOT NODE --------------------------------------------------------
  if (
    // white root node -----------------------------------------
    root.length === columnHeader.length - 1 &&
    root[columnHeader.indexOf("indexPARENT")] === "-1"
  ) {
    arrOfNodes.push(
      new Node(
        root[columnHeader.indexOf("indexINDEX")],
        root[columnHeader.indexOf("indexUNIXDATE")],
        root[columnHeader.indexOf("indexDEPTH")],
        null, // parent connection
        root[columnHeader.indexOf("indexCOMMENT")],
        root[columnHeader.indexOf("indexWMOVE")],
        ""
      )
    );
  } else if (
    // black root node ------------------------------------------
    root.length === columnHeader.length &&
    root[columnHeader.indexOf("indexPARENT")] === "-1"
  ) {
    arrOfNodes.push(
      new Node(
        root[columnHeader.indexOf("indexINDEX")],
        root[columnHeader.indexOf("indexUNIXDATE")],
        root[columnHeader.indexOf("indexDEPTH")],
        null, // parent connection
        root[columnHeader.indexOf("indexCOMMENT")],
        ""
      )
    );
  } else {
    // -----------------------------------------------------------
    console.log("error");
    return;
  }
  // -------------------------------------------------------------------------

  // makes the other nodes and place in arrOfNodes ---------------------------
  for (var i = 1; i < arr.length; i++) {
    // checks if the unit is empty
    if (arr[i] === "") break;

    var element = arr[i].split(",");

    arrOfNodes.push(
      new Node(
        element[columnHeader.indexOf("indexINDEX")],
        element[columnHeader.indexOf("indexUNIXDATE")],
        element[columnHeader.indexOf("indexDEPTH")],
        arrOfNodes[element[columnHeader.indexOf("indexPARENT")]], // parent connection
        element[columnHeader.indexOf("indexCOMMENT")],
        element[columnHeader.indexOf("indexWMOVE")],
        element[columnHeader.indexOf("indexBMOVE")]
      )
    );
  }
  // -------------------------------------------------------------------------

  // return arrOfNodes and root as arrOfNodes[0]
  return arrOfNodes;
}

function editWithThisId() {
  var index = document.getElementById("idOfNode").innerHTML;
  if (index === "") return;

  var intIndex = parseInt(index);

  var newWMove = document
    .getElementById("nodeDataWMOVE")
    .value.replaceAll(" ", "");
  // console.log(arrOfNodes[intIndex].wMove + " vs. " + newWMove);
  arrOfNodes[intIndex].wMove = newWMove;

  var newBMove = document
    .getElementById("nodeDataBMOVE")
    .value.replaceAll(" ", "");
  // console.log(arrOfNodes[intIndex].bMove + " vs. " + newBMove);
  arrOfNodes[intIndex].bMove = newBMove;

  var newPop = document.getElementById("popularityOfNode").value;
  // console.log(arrOfNodes[intIndex].wMove + " vs. " + newWMove);
  var comment = arrOfNodes[intIndex].comment.split(":");
  comment[2] = newPop;
  arrOfNodes[intIndex].comment = comment.join(":");

  console.log(arrOfNodes[intIndex]);

  //arrOfNodes[intIndex].wMove = newWMove;
  localStorage.setItem(
    localStorage.getItem("orientation"),
    takeArrayOfNodesIntoStr()
  );

  setDisplayTreeData(arrOfNodes);
  showAlert("edited");
}

const copyToClipboard = () => {
  const el = document.createElement("textarea");
  el.value = localStorage.getItem(localStorage.getItem("orientation"));
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

// Copies a string to the clipboard. Must be called from within an
// event handler such as click. May return false if it failed, but
// this is not always possible. Browser support for Chrome 43+,
// Firefox 42+, Safari 10+, Edge and Internet Explorer 10+.
// Internet Explorer: The clipboard feature may be disabled by
// an administrator. By default a prompt is shown the first
// time the clipboard is used (per session).
function copyAllData() {
  var arrOfData = [
    localStorage.getItem("white"),
    localStorage.getItem("black"),
    localStorage.getItem("calendar"),
    localStorage.getItem("difficulty"),
  ];
  text = arrOfData.join("<>");
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData("Text", text);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported("copy")
  ) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy"); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

function takeDataIntoEverything() {
  var data = document.getElementById("readAllData").value.split("<>");
  localStorage.setItem("white", data[0]);
  localStorage.setItem("black", data[1]);
  localStorage.setItem("calendar", data[2]);
  localStorage.setItem("difficulty", data[3]);
}

function readTree() {
  var input = document.getElementById("input").value;
  if (input === "") return;

  /*var treeTemp =
    "0,1627505492,7,-1,e4|" +
    "1,1627505492,7,0,Nf3,e5|" +
    "2,1627505492,7,0,Nf3,Nc6|" +
    "3,1627505492,2,1,Bc4,Nc3|" +
    "4,1627505492,2,1,Nf6,Ne5|" +
    "5,1627505492,2,4,b4,Bc5";

  // 0,1627505492,7,-1,e4|1,1627505492,7,0,Nf3,d4|2,1627505492,7,0,Nf3,Nc6|3,1627505492,2,1,Bc4,Nc3|4,1627505492,2,1,Nf6,Ne5|5,1627505492,2,4,b4,Bc5|
  */

  localStorage.setItem(localStorage.getItem("orientation"), input);

  console.log(input);

  arrOfNodes = [];
  treeGenerator(input);

  // check if input is trash

  // create tree then populate with data
  setDisplayTreeData(arrOfNodes); // refreshes the treeview
}

function createTree() {
  var firstMove = document.getElementById("firstMove").value;
  if (localStorage.getItem("orientation") === "white" && firstMove === "")
    return;

  var dateToday = new Date();

  // is firstMove legal?

  var storingData = "0,10000000000,0,-1,edit:edit:1," + firstMove + "|";

  console.log(treeGenerator(storingData));

  localStorage.setItem(localStorage.getItem("orientation"), storingData);

  if (localStorage.getItem(localStorage.getItem("orientation")) != null) {
    document.getElementById("createTree").style.display = "none";
  }
}

// Can benefit from having children nodes
function addPGNToTree() {
  var pgn = document.getElementById("input").value;
  if (pgn === "") return;

  for (var i = 0; i < pgn.length - 1; i++) {
    if (pgn.substring(i, i + 1) === ".") {
      if (pgn.substring(i + 1, i + 2) != " ") {
        pgn = pgn.substring(0, i + 1) + " " + pgn.substring(i + 1, pgn.length);
      }
    }
    if (i < pgn.length - 3) {
      if (pgn.substring(i, i + 3) === "0-0") {
        pgn = pgn.substring(0, i) + "O-O" + pgn.substring(i + 3, pgn.length);
      }
    }
    if (i < pgn.length - 5) {
      if (pgn.substring(i, i + 5) === "0-0-0") {
        pgn = pgn.substring(0, i) + "O-O-O" + pgn.substring(i + 5, pgn.length);
      }
    }
  }
  console.log("new pgn: " + pgn);

  var arrPGN = pgn.split(" ");

  if (localStorage.getItem("orientation") === "white") {
    if (arrOfNodes[0].wMove === arrPGN[1]) {
      console.log("check if root is same");
      checkWhitePGNrecursion(arrOfNodes[0], 2, arrPGN);
    }
  }
  if (localStorage.getItem("orientation") === "black") {
    checkBlackPGNrecursion(arrOfNodes[0], 0, arrPGN);
  }

  localStorage.setItem(
    localStorage.getItem("orientation"),
    takeArrayOfNodesIntoStr()
  );

  setDisplayTreeData(arrOfNodes);
  showAlert("added");
  // console.log(takeArrayOfNodesIntoStr()); // takes tree --> str storage
}

function checkWhitePGNrecursion(curNode, index, arrPGN) {
  // finding next node

  if (index > arrPGN.length - 1) {
    console.log("finished");
    return;
  }

  for (var i = 0; i < arrOfNodes.length; i++) {
    if (arrOfNodes[i].parent === curNode) {
      if (
        arrOfNodes[i].bMove === arrPGN[index] &&
        arrOfNodes[i].wMove === arrPGN[index + 2]
      ) {
        console.log("found continuation");
        checkWhitePGNrecursion(arrOfNodes[i], index + 3, arrPGN);
        return;
      } else if (arrOfNodes[i].bMove === arrPGN[index]) {
        alert("you don't play this response to black");
        return;
      }
    }
  }

  arrOfNodes.push(
    new Node(
      arrOfNodes.length + "", // index of array
      Math.floor(Date.now() / 1000) + "", // today's date
      1 + "", // depth
      curNode, // parent connection
      "::1",
      arrPGN[index + 2] + "", // white move
      arrPGN[index] + "" // black move
    )
  );
}

function checkBlackPGNrecursion(curNode, index, arrPGN) {
  // finding next node

  if (index > arrPGN.length - 1) {
    console.log("finished");
    return;
  }

  for (var i = 0; i < arrOfNodes.length; i++) {
    if (arrOfNodes[i].parent === curNode) {
      if (
        arrOfNodes[i].bMove === arrPGN[index + 2] &&
        arrOfNodes[i].wMove === arrPGN[index + 1]
      ) {
        console.log("found continuation");
        checkBlackPGNrecursion(arrOfNodes[i], index + 3, arrPGN);
        return;
      } else if (arrOfNodes[i].wMove === arrPGN[index]) {
        console.log("you don't play this response to black");
        return;
      }
    }
  }

  arrOfNodes.push(
    new Node(
      arrOfNodes.length + "", // index of array
      Math.floor(Date.now() / 1000) + "", // today's date
      1 + "", // depth
      curNode, // parent connection
      "::1",
      arrPGN[index + 1] + "", // white move
      arrPGN[index + 2] + "" // black move
    )
  );
}

function takeArrayOfNodesIntoStr() {
  var tempArr = [];

  // ADDING ROOT NODE --------------------------------------------------------
  if (
    // white root node -----------------------------------------
    localStorage.getItem("orientation") === "white"
  ) {
    tempArr.push(
      arrOfNodes[0].index +
        "," +
        arrOfNodes[0].unixDate +
        "," +
        arrOfNodes[0].depth +
        "," +
        -1 +
        "," +
        arrOfNodes[0].comment +
        "," +
        arrOfNodes[0].wMove
    );
  } else if (
    // black root node ------------------------------------------
    localStorage.getItem("orientation") === "black"
  ) {
    tempArr.push(
      arrOfNodes[0].index +
        "," +
        arrOfNodes[0].unixDate +
        "," +
        arrOfNodes[0].depth +
        "," +
        -1 +
        "," +
        arrOfNodes[0].comment +
        ","
    );
  }

  for (var i = 1; i < arrOfNodes.length; i++) {
    tempArr.push(
      arrOfNodes[i].index +
        "," +
        arrOfNodes[i].unixDate +
        "," +
        arrOfNodes[i].depth +
        "," +
        arrOfNodes[i].parent.index +
        "," +
        arrOfNodes[i].comment +
        "," +
        arrOfNodes[i].wMove +
        "," +
        arrOfNodes[i].bMove
    );
  }

  return tempArr.join("|");
}

function displayTreeNodeLineage() {
  arrOfNodes = [];
  treeGenerator(localStorage.getItem(localStorage.getItem("orientation")));
  setDisplayTreeData(arrOfNodes);
}

/*
var probe_book = function() {
  var baseUrl = 'https://www.chessdb.cn/cdb.php?action=queryall&json=1&board='
  var pvUrl = 'https://www.chessdb.cn/cdb.php?action=querypv&json=1&board='

  // Get the fen from current board position
  var userfen = game.fen();
  var url = baseUrl + userfen;
  var pvUrlGet = pvUrl + userfen;

  // We will not make request if game is over.
  if (game.game_over()) {
    var msg = "Game over!";
    console.log(msg);
    document.getElementById('top-move-pv').innerHTML = msg;
    for (var i = 0; i < 4; i++) {
      document.getElementById("advance-pv" + (i+1)).innerHTML = "Pv" + (i+1) + ": " + msg;
    }
    $("#tbody tr").remove();
    return;
  }

  // (1) Request query all
  $.get(url, function(data, status) {
    if (typeof(data.moves) === 'undefined') {
      $("#tbody tr").remove();
    }
    else {
      var json = data.moves;

      // Create table for book probing results
      // Clear table first
      $("#tbody tr").remove();

      var tbody = document.getElementById('tbody');
      const moveH = "Move";
      const scoreH = "Score";
      const winrateH = "Winrate";

      for (var i = 0; i < json.length; i++) {
        var sanMove = json[i].san;
        var score = json[i].score;
        var winrate = json[i].winrate;

        // 2019-08-03: ChessDB does not return winrate (by design)
        // when score is a mate. So we will just calculate winrate
        // by the formula that is used by chessDB.
        if (typeof(winrate) === "undefined") {
          winrate = 100 * 1/(1 + (Math.exp(-score/330)));
          winrate = winrate.toFixed(2);
        }

        // Add table header
        if (i == 0) {
          var tr = "<tr>";
          tr = "<td align='center'>" + moveH + "</td>" + "<td align='center'>" + scoreH + "</td>" + "<td align='center'>" + winrateH + "</td></tr>";
          tbody.innerHTML += tr;
        }

        var tr = "<tr>";
        tr += "<td align='center'>" + sanMove + "</td>" + "<td align='center'>" + score + "</td>" + "<td align='center'>" + winrate + "</td></tr>";
        tbody.innerHTML += tr;
      }
    }
  });

  // Query leaf score of top 1 move.
  // Get the top move, push it, and query its PV. Walk the PV except the
  // last move and query its PV again to get its leaf node score.
  $.get(url, function(data, status) {
    var numPv = 1;
    var idStr = "advance-pv" + numPv;
    var label = "Pv" + numPv + ": ";
    document.getElementById(idStr).innerHTML = label;
    if (typeof(data.moves) === 'undefined') {
      console.log('Query all, there is no book move!');
    }
    else {
      var json = data.moves;
      for (var j = numPv-1; j < Math.min(numPv, json.length); j++) {
        var topSanMove = json[j].san;
        var topGame = new Chess(game.fen());
        topGame.move(topSanMove);
        var topFen = topGame.fen();

        // Query the top pv, walk the pv and get its leaf score.
        var topUrl = 'https://www.chessdb.cn/cdb.php?action=querypv&json=1&board=' + topFen;
        $.get(topUrl, function(topData, topStatus) {
          if (topStatus == 'success' && topData.status == 'ok'){
            var game1 = new Chess(topGame.fen());
            var depth = topData.depth - 1;
            if (depth >= 0) {
              for (var i = 0; i < depth; i++) {
                  game1.move(topData.pvSAN[i]);
              }
              var leafFen = game1.fen();
              var url1 = 'https://www.chessdb.cn/cdb.php?action=querypv&json=1&board=' + leafFen;
              $.get(url1, function(data1, status1) {
                if (status1 == 'success' && data1.status == 'ok'){
                  score = data1.score;
                  if (game.turn() !== game1.turn()) {
                    score = -1*score;
                  }
                  var leafNodeInfo = "Score of " + "<b>"+json[numPv-1].san+"</b>" + " after " + (1+depth) + " plies: " + "<b>"+score+"</b>";
                  document.getElementById(idStr).innerHTML = leafNodeInfo;
                }
              });
            }
          }
          else {
            document.getElementById(idStr).innerHTML = "Score of " + "<b>"+json[numPv-1].san+"</b>" + " after " + (1) + " plies: " + "<b>"+json[numPv-1].score+"</b>";
          }
        });
      }
    }
  });

  // Query leaf score of top 2 move.
  $.get(url, function(data, status) {
    var numPv = 2;
    var idStr = "advance-pv" + numPv;
    var label = "Pv" + numPv + ": ";
    document.getElementById(idStr).innerHTML = label;
    if (typeof(data.moves) === 'undefined') {
      console.log('Query all, there is no book move!');
    }
    else {
      var json = data.moves;
      for (var j = numPv-1; j < Math.min(numPv, json.length); j++) {
        var topSanMove = json[j].san;
        var topGame = new Chess(game.fen());
        topGame.move(topSanMove);
        var topFen = topGame.fen();

        // Query the top pv, walk the pv and get its leaf score.
        var topUrl = 'https://www.chessdb.cn/cdb.php?action=querypv&json=1&board=' + topFen;
        $.get(topUrl, function(topData, topStatus) {
          if (topStatus == 'success' && topData.status == 'ok'){
            var game1 = new Chess(topGame.fen());
            var depth = topData.depth - 1;
            if (depth >= 0) {
              for (var i = 0; i < depth; i++) {
                  game1.move(topData.pvSAN[i]);
              }
              var leafFen = game1.fen();
              var url1 = 'https://www.chessdb.cn/cdb.php?action=querypv&json=1&board=' + leafFen;
              $.get(url1, function(data1, status1) {
                if (status1 == 'success' && data1.status == 'ok'){
                  score = data1.score;
                  if (game.turn() !== game1.turn()) {
                    score = -1*score;
                  }
                  var leafNodeInfo = "Score of " + "<b>"+json[numPv-1].san+"</b>" + " after " + (1+depth) + " plies: " + "<b>"+score+"</b>";
                  document.getElementById(idStr).innerHTML = leafNodeInfo;
                }
              });
            }
          }
          else {
            document.getElementById(idStr).innerHTML = "Score of " + "<b>"+json[numPv-1].san+"</b>" + " after " + (1) + " plies: " + "<b>"+json[numPv-1].score+"</b>";
          }
        });
      }
    }
  });

  // Query leaf score of top 3 move.
  $.get(url, function(data, status) {
    var numPv = 3;
    var idStr = "advance-pv" + numPv;
    var label = "Pv" + numPv + ": ";
    document.getElementById(idStr).innerHTML = label;
    if (typeof(data.moves) === 'undefined') {
      console.log('Query all, there is no book move!');
    }
    else {
      var json = data.moves;
      for (var j = 2; j < Math.min(3, json.length); j++) {
        var topSanMove = json[j].san;
        var topGame = new Chess(game.fen());
        topGame.move(topSanMove);
        var topFen = topGame.fen();

        // Query the top pv, walk the pv and get its leaf score.
        var topUrl = 'https://www.chessdb.cn/cdb.php?action=querypv&json=1&board=' + topFen;
        $.get(topUrl, function(topData, topStatus) {
          if (topStatus == 'success' && topData.status == 'ok'){
            var game1 = new Chess(topGame.fen());
            var depth = topData.depth - 1;
            if (depth >= 0) {
              for (var i = 0; i < depth; i++) {
                  game1.move(topData.pvSAN[i]);
              }
              var leafFen = game1.fen();
              var url1 = 'https://www.chessdb.cn/cdb.php?action=querypv&json=1&board=' + leafFen;
              $.get(url1, function(data1, status1) {
                if (status1 == 'success' && data1.status == 'ok'){
                  score = data1.score;
                  if (game.turn() !== game1.turn()) {
                    score = -1*score;
                  }
                  var leafNodeInfo = "Score of " + "<b>"+json[numPv-1].san+"</b>" + " after " + (1+depth) + " plies: " + "<b>"+score+"</b>";
                  document.getElementById(idStr).innerHTML = leafNodeInfo;
                }
              });
            }
          }
          else {
            document.getElementById(idStr).innerHTML = "Score of " + "<b>"+json[numPv-1].san+"</b>" + " after " + (1) + " plies: " + "<b>"+json[numPv-1].score+"</b>";
          }
        });
      }
    }
  });

  // Query leaf score of top 4 move.
  $.get(url, function(data, status) {
    var numPv = 4;
    var idStr = "advance-pv" + numPv;
    var label = "Pv" + numPv + ": ";
    document.getElementById(idStr).innerHTML = label;
    if (typeof(data.moves) === 'undefined') {
      console.log('Query all, there is no book move!');
    }
    else {
      var json = data.moves;
      for (var j = 3; j < Math.min(4, json.length); j++) {
        var topSanMove = json[j].san;
        var topGame = new Chess(game.fen());
        topGame.move(topSanMove);
        var topFen = topGame.fen();

        // Query the top pv, walk the pv and get its leaf score.
        var topUrl = 'https://www.chessdb.cn/cdb.php?action=querypv&json=1&board=' + topFen;
        $.get(topUrl, function(topData, topStatus) {
          if (topStatus == 'success' && topData.status == 'ok'){
            var game1 = new Chess(topGame.fen());
            var depth = topData.depth - 1;
            if (depth >= 0) {
              for (var i = 0; i < depth; i++) {
                  game1.move(topData.pvSAN[i]);
              }
              var leafFen = game1.fen();
              var url1 = 'https://www.chessdb.cn/cdb.php?action=querypv&json=1&board=' + leafFen;
              $.get(url1, function(data1, status1) {
                if (status1 == 'success' && data1.status == 'ok'){
                  score = data1.score;
                  if (game.turn() !== game1.turn()) {
                    score = -1*score;
                  }
                  var leafNodeInfo = "Score of " + "<b>"+json[numPv-1].san+"</b>" + " after " + (1+depth) + " plies: " + "<b>"+score+"</b>";
                  document.getElementById(idStr).innerHTML = leafNodeInfo;
                }
              });
            }
          }
          else {
            document.getElementById(idStr).innerHTML = "Score of " + "<b>"+json[numPv-1].san+"</b>" + " after " + (1) + " plies: " + "<b>"+json[numPv-1].score+"</b>";
          }
        });
      }
    }
  });

  // (2) Request PV of top 1 move and show it in PV box.
  $.get(pvUrlGet, function(data, status) {
    if (status !== 'success'){
      msg = "Request failed! PV query of top 1 move is not successful.";
      console.log(msg);
      document.getElementById('top-move-pv').innerHTML = msg;
    }
    else if (data.status !== 'ok') {
      if (!game.game_over()){
        msg = "Request is successful but PV info is not available.";
        console.log(msg);
        document.getElementById('top-move-pv').innerHTML = msg;
      }
      else {
        document.getElementById('top-move-pv').innerHTML = "Game over!";
      }
    }
    else {
      var sanPv = "" + data.pvSAN;
      var pv = sanPv.replace(/,/g, ' ');
      var line = "score: " + data.score + ", depth: " + data.depth + "<br>" + pv;
      document.getElementById('top-move-pv').innerHTML = line;
    }
  });
}
*/
