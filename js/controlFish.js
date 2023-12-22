// Chess Stockfish 🚧 --------------------------------------------------------------------------

var board = null; // board placeholder
var game = new Chess(); // can take in fen
var stockfish = new Worker("../js/stockfish.js");
const whiteSquareGrey = "#a9a9a9"; // grey square color
const blackSquareGrey = "#696969"; // highlights
var $status = $("#status"); // object instance of status id element
var $fen = $("#fen"); // fen id element
var $pgn = $("#pgn"); // pgn id element
var bestmove = "";
var cp = 0;
var bestMoveCP = 0;
var prevBoardPos = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"];
var nextBoardPos = [];
var stockfishDepth = 15;

var currentNodeInEditor = -1;
var moveToAddWMove = "";
var moveToAddBMove = "";

var squareClass = "square-55d63";
var squareToHighlight = null;
var colorToHighlight = null;

stockfish.postMessage("uci"); // current game
stockfish.postMessage("ucinewgame");

stockfish.onmessage = async function (event) {
  //NOTE: Web Workers wrap the response in an object.
  // console.log(event.data ? event.data : event);
  if (event.data.split(" ")[9] != undefined) {
    cp = event.data.split(" ")[9];
    var newCP =
      game.turn() === localStorage.getItem("orientation").substring(0, 1)
        ? cp
        : cp * -1;
    if (localStorage.getItem("orientation") === "white") {
      let evalNum = 10.875 - newCP / 100;
      if (evalNum < 0) {
        evalNum = 0;
      }
      if (evalNum > 21.75) {
        evalNum = 21.75;
      } // checkmate bug where it shows as 1/2
      $("#evalBarBlack").css("height", evalNum + "rem"); // flip white black bug
      document.getElementById("evaluation").innerHTML = newCP;
    }
    if (localStorage.getItem("orientation") === "black") {
      let evalNum = 10.875 - newCP / 100;
      if (evalNum < 0) {
        evalNum = 0;
      }
      if (evalNum > 21.75) {
        evalNum = 21.75;
      } // checkmate bug where it shows as 1/2
      $("#evalBarBlack").css("height", evalNum + "rem"); // flip white black bug
      document.getElementById("evaluation").innerHTML = newCP * -1;
    }
  }
  if (event.data.split(" ")[0] == "bestmove") {
    bestmove = event.data.split(" ")[1];
    document.getElementById("bestmove").innerHTML = bestmove;
    console.log(game.turn() + " should move to " + bestmove);

    let evalNum = 10.875 - cp / 100;
    if (evalNum < 0) {
      evalNum = 0;
    }
    if (event.data.split(" ")[0] == "bestmove") {
      bestmove = event.data.split(" ")[1];
      document.getElementById("bestmove").innerHTML = bestmove;
      console.log(game.turn() + " should move to " + bestmove);

      evaluateMove(bestmove);
      // if (game.turn() == "b") {
      //   localStorage.getItem("orientationCur") === "white"
      //     ? calculatedMove(bestmove) // white
      //     : evaluateMove(bestmove); // black
      // } else if (game.turn() == "w") {
      //   localStorage.getItem("orientationCur") === "white"
      //     ? evaluateMove(bestmove) // white
      //     : calculatedMove(bestmove); // black
      // }
    }
  }
};

function loadFen() {
  // Loads the
  prevBoardPos = [];
  nextBoardPos = [];
  var startingFen = fenIn.value;
  board.position(startingFen);
  game.load(startingFen);
  stockfish.postMessage("position fen " + startingFen);
  stockfish.postMessage("go depth " + stockfishDepth);
}

function resetBoard() {
  prevBoardPos = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"];
  nextBoardPos = [];
  var startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  board.position(startingFen);
  game.load(startingFen);
  stockfish.postMessage("position fen " + startingFen);
  stockfish.postMessage("go depth " + stockfishDepth);
}

function undoMove() {
  var currMove = prevBoardPos[prevBoardPos.length - 2];
  if (currMove != undefined) {
    nextBoardPos.push(prevBoardPos.pop());
    var prevMove = prevBoardPos[prevBoardPos.length - 1];
    // console.log(nextBoardPos, prevBoardPos);

    board.position(prevMove);
    game.load(prevMove);
    stockfish.postMessage("position fen " + prevMove);
  }
}

function redoMove() {
  var nextMove = nextBoardPos[nextBoardPos.length - 1];
  if (nextMove != undefined) {
    nextMove = nextBoardPos.pop();
    prevBoardPos.push(nextMove);
    console.log(nextBoardPos, prevBoardPos);
    board.position(nextMove);
    game.load(nextMove);
    stockfish.postMessage("position fen " + nextMove);
  }
}

function setOpening() {
  if (currentNodeInEditor === -1) return;

  var comment = arrOfNodes[currentNodeInEditor].comment.split(":");

  comment[0] = document.getElementById("openingName").value;

  arrOfNodes[currentNodeInEditor].comment = comment.join(":");

  localStorage.setItem(
    localStorage.getItem("orientation"),
    takeArrayOfNodesIntoStr()
  );

  showAlert("opening edited");
}

function setComment() {
  if (currentNodeInEditor === -1) return;

  var comment = arrOfNodes[currentNodeInEditor].comment.split(":");

  comment[1] = document.getElementById("commentOnPos").value;

  arrOfNodes[currentNodeInEditor].comment = comment.join(":");

  localStorage.setItem(
    localStorage.getItem("orientation"),
    takeArrayOfNodesIntoStr()
  );

  showAlert("comment edited");
}

function evaluateMove(bestmove) {
  console.log(
    "Stockfish thinks the best move for the player would be: " + bestmove
  );
}

function removeGreySquares() {
  $("#mychesstreeBoard .square-55d63").css("background", ""); // changes background of #mychesstreeBoard
  //$('#mychesstreeBoard .square-55d63').css('border-radius', '')// temp border radius test
}

function greySquare(square) {
  // takes square and makes it grey
  var $square = $("#mychesstreeBoard .square-" + square);

  var background = whiteSquareGrey;
  if ($square.hasClass("black-3c85d")) {
    // changes into a darker square if dark already
    background = blackSquareGrey;
  }

  $square.css("background", background);
  //$square.css('border-radius', '50%')                    // temp border radius test
}

function onDragStart(source, piece, position, orientation) {
  //console.log(event);
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for the side to move
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function onDrop(source, target) {
  removeGreySquares();

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });
  console.log(move);

  // illegal move
  if (move === null) return "snapback";

  nextBoardPos = [];
  prevBoardPos.push(game.fen());

  // Highlight last move
  if (localStorage.getItem("orientation") === "white") {
    document.documentElement.style.setProperty(
      "--highlight-color-white",
      "inset 0 0 20px 20px rgb(179, 104, 104, 0)"
    );
    document.documentElement.style.setProperty(
      "--highlight-color-black",
      "inset 0 0 20px 20px rgb(179, 104, 104, 0.75)"
    );
  } else {
    document.documentElement.style.setProperty(
      "--highlight-color-white",
      "inset 0 0 20px 20px rgb(179, 104, 104, 0.75)"
    );
    document.documentElement.style.setProperty(
      "--highlight-color-black",
      "inset 0 0 20px 20px rgb(179, 104, 104, 0)"
    );
  }

  if (move.color === "w") {
    $("#mychesstreeBoard")
      .find("." + squareClass)
      .removeClass("highlight-white");
    $("#mychesstreeBoard")
      .find(".square-" + move.from)
      .addClass("highlight-white");
    squareToHighlight = move.to;
    colorToHighlight = "white";
  } else {
    $("#mychesstreeBoard")
      .find("." + squareClass)
      .removeClass("highlight-black");
    $("#mychesstreeBoard")
      .find(".square-" + move.from)
      .addClass("highlight-black");
    squareToHighlight = move.to;
    colorToHighlight = "black";
  }
  $("#mychesstreeBoard")
    .find(".square-" + squareToHighlight)
    .addClass("highlight-" + colorToHighlight);

  console.log("The player moved from " + move.from + " to " + move.to);
  stockfish.postMessage(
    "position fen " + game.fen() + " moves " + move.from + move.to
  );
  stockfish.postMessage("go depth " + stockfishDepth);

  updateStatus();

  if (
    window.location.pathname.split("/").pop() === "editor.html" &&
    mode === "edit"
  ) {
    //console.log("current node index is: " + currentNodeInEditor);
    if (currentNodeInEditor > 0) {
      if (
        localStorage.getItem("orientation") === "white" &&
        move.color === "b"
      ) {
        moveToAddBMove = move.san;
      } else if (
        localStorage.getItem("orientation") === "black" &&
        move.color === "w"
      ) {
        moveToAddWMove = move.san;
      } else if (
        localStorage.getItem("orientation") === "white" &&
        move.color === "w"
      ) {
        if (
          window.confirm(
            "Do you want to add node, whiteMove: " +
              move.san +
              " blackMove: " +
              moveToAddBMove
          )
        ) {
          arrOfNodes.push(
            new Node(
              arrOfNodes.length + "",
              Math.floor(Date.now() / 1000) + "",
              1 + "",
              arrOfNodes[currentNodeInEditor], // parent connection
              ":",
              move.san + "",
              moveToAddBMove + ""
            )
          );
          localStorage.setItem(
            localStorage.getItem("orientation"),
            takeArrayOfNodesIntoStr()
          );

          setDisplayTreeData(arrOfNodes);
          showAlert("added");
        }
      } else if (
        localStorage.getItem("orientation") === "black" &&
        move.color === "b"
      ) {
        if (
          window.confirm(
            "Do you want to add node, whiteMove: " +
              moveToAddWMove +
              " blackMove: " +
              move.san
          )
        ) {
          arrOfNodes.push(
            new Node(
              arrOfNodes.length + "",
              Math.floor(Date.now() / 1000) + "",
              1 + "",
              arrOfNodes[currentNodeInEditor], // parent connection
              ":",
              moveToAddWMove + "",
              move.san + ""
            )
          );
          localStorage.setItem(
            localStorage.getItem("orientation"),
            takeArrayOfNodesIntoStr()
          );

          setDisplayTreeData(arrOfNodes);
          showAlert("added");
        }
      }
    }
  }

  userMadeMoveFlag = true;

  // checks if this is editor.html and the orientation --> call a mychesstree.js function
  /*if (
    window.location.pathname.split("/").pop() === "editor.html" &&
    mode === "edit" &&
    move.color === localStorage.getItem("orientation").substring(0, 1)
  ) {
    saveMoveToTree(move, game.pgn());
  }*/
}

function calculatedMove(bestmove) {
  if (
    window.location.pathname.split("/").pop() === "editor.html" &&
    mode === "edit"
  ) {
    console.log("Disables engine's ability to make a move on board");
    return;
  }

  var move = game.move({
    from: bestmove.substring(0, 2),
    to: bestmove.substring(2),
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  game.move(move);
  board.position(game.fen());

  stockfish.postMessage(
    "position fen " + game.fen() + " moves " + move.from + move.to
  );
  stockfish.postMessage("go depth " + stockfishDepth);

  updateStatus();
}

function onMouseoverSquare(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true,
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}

function setStockfishDepth() {
  var depth = document.getElementById("stockfishDepth").value;
  //console.log(depth === "");
  if (depth === "") return;

  stockfishDepth = parseInt(depth);
}

function updateStatus() {
  var status = "";

  var moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
  }

  // draw?
  else if (game.in_draw()) {
    status = "Game over, drawn position";
  }

  // game still on
  else {
    status = moveColor + " to move";

    // check?
    if (game.in_check()) {
      status += ", " + moveColor + " is in check";
    }
  }

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());
}

var config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
  orientation: localStorage.getItem("orientation"), // finds out if the current tree is white or black
};
board = Chessboard("mychesstreeBoard", config);

updateStatus();
