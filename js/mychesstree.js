function setDisplayTreeData(arrOfNodes) {
  document.getElementById("tree-container").innerHTML = "";
  var treeData = getChildrenForDisplayTree(arrOfNodes[0], arrOfNodes);
  console.log(treeData);
  loadTree(treeData);
}

// Can benefit from having children nodes
function getChildrenForDisplayTree(node, deletingArrOfNodes) {
  var childrenArr = [];
  for (var i = deletingArrOfNodes.length - 1; i >= 0; i--) {
    // find children
    if (deletingArrOfNodes[i].parent === node) {
      //console.log("yes we found child");
      childrenArr.push(
        getChildrenForDisplayTree(deletingArrOfNodes[i], deletingArrOfNodes)
      );
    }
  }

  var nameOfNode =
    localStorage.getItem("orientation") === "white"
      ? node.bMove + " " + node.wMove
      : node.wMove + " " + node.bMove;

  //
  if (childrenArr.length > 0) {
    return { name: nameOfNode, children: childrenArr };
  } else {
    return { name: nameOfNode };
  }
}

var mode = "";

function editTreeSetup() {
  if (
    document.getElementById("editTreeSetup").style.backgroundColor ===
    "rgb(255, 200, 200)"
  ) {
    document.getElementById("editTreeSetup").style.backgroundColor =
      "rgb(255, 255, 255)";
    document.getElementById("nodeEditor").style.display = "none";
    mode = "";
  } else {
    document.getElementById("editTreeSetup").style.backgroundColor =
      "rgb(255, 200, 200)";
    document.getElementById("nodeEditor").style.display = "block";
  }
  mode = "edit";
}

function viewTreeSetup() {
  if (
    document.getElementById("viewTreeSetup").style.backgroundColor ===
    "rgb(255, 200, 200)"
  ) {
    document.getElementById("viewTreeSetup").style.backgroundColor =
      "rgb(255, 255, 255)";
    document.getElementById("tree-container").style.display = "none";
  } else {
    document.getElementById("viewTreeSetup").style.backgroundColor =
      "rgb(255, 200, 200)";
    document.getElementById("tree-container").style.display = "block";
    setDisplayTreeData(arrOfNodes);
  }
}

function bookTreeSetup() {
  if (
    document.getElementById("bookTreeSetup").style.backgroundColor ===
    "rgb(255, 200, 200)"
  ) {
    document.getElementById("bookTreeSetup").style.backgroundColor =
      "rgb(255, 255, 255)";
  } else {
    document.getElementById("bookTreeSetup").style.backgroundColor =
      "rgb(255, 200, 200)";
  }
}

// tree drawing ------------------------------------------------------------------------------------
/*Copyright (c) 2013-2016, Rob Schmuecker
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* The name Rob Schmuecker may not be used to endorse or promote products
  derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/
// --------------------------------------------------------------------------------------------

function loadTree(treeData) {
  // Calculate total nodes, max label length
  var totalNodes = 0;
  var maxLabelLength = 0;
  // variables for drag/drop
  var selectedNode = null;
  var draggingNode = null;
  // panning variables
  var panSpeed = 200;
  var panBoundary = 20; // Within 20px from edges will pan when dragging.
  // Misc. variables
  var i = 0;
  var duration = 750;
  var root;

  var w =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var h =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  // size of the diagram
  var viewerWidth = (2 * w) / 3;
  var viewerHeight = (4 * h) / 5;

  var tree = d3.layout.tree().size([viewerHeight, viewerWidth]);

  // define a d3 diagonal projection for use by the node paths later on.
  var diagonal = d3.svg.diagonal().projection(function (d) {
    return [d.y, d.x];
  });

  // A recursive helper function for performing some setup by walking through all nodes

  function visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    visitFn(parent);

    var children = childrenFn(parent);
    if (children) {
      var count = children.length;
      for (var i = 0; i < count; i++) {
        visit(children[i], visitFn, childrenFn);
      }
    }
  }

  // Call visit function to establish maxLabelLength
  visit(
    treeData,
    function (d) {
      totalNodes++;
      maxLabelLength = Math.max(d.name.length, maxLabelLength);
    },
    function (d) {
      return d.children && d.children.length > 0 ? d.children : null;
    }
  );

  // sort the tree according to the node names

  function sortTree() {
    tree.sort(function (a, b) {
      return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
    });
  }
  // Sort the tree initially incase the JSON isn't in a sorted order.
  sortTree();

  // Define the zoom function for the zoomable tree

  function zoom() {
    svgGroup.attr(
      "transform",
      "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
    );
  }

  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

  // define the baseSvg, attaching a class for styling and the zoomListener
  var baseSvg = d3
    .select("#tree-container")
    .append("svg")
    .attr("width", viewerWidth)
    .attr("height", viewerHeight)
    .attr("class", "overlay")
    .call(zoomListener);

  function centerNode(source) {
    scale = zoomListener.scale();
    x = -source.y0;
    y = -source.x0;
    x = x * scale + viewerWidth / 5;
    y = y * scale + viewerHeight / 2;
    d3.select("g")
      .transition()
      .duration(duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
  }

  // Toggle children function

  function toggleChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    return d;
  }

  // Toggle children on click.
  function click(d) {
    var whichClick = event.which;
    if (whichClick > 1) {
      d = toggleChildren(d);
      update(d);
      centerNode(d);
    }
    if (whichClick === 1) {
      // check orientation

      var pgn = recursiveGet(d);
      console.log("pgn is: " + pgn);
      var actualPGN = turnThatIntoPGN(pgn).substring(2);
      // console.log("actualPGN is " + actualPGN);
      document.getElementById("pgn").innerHTML = actualPGN; // puts pgn into i
      document.getElementById("input").innerHTML = actualPGN.substring(2); // puts pgn into input

      game.load_pgn(actualPGN);
      //game.load_pgn(document.getElementById("pgnIn").textContent);
      var fen = game.fen();
      console.log(fen);
      board.position(fen);
      // console.log("gonna put position on chessboard");
      console.log("pgn is " + actualPGN);

      document.getElementById("fen").innerHTML = game.fen();

      document.getElementById("nodeDataWMOVE").readOnly = false;
      document.getElementById("nodeDataBMOVE").readOnly = false;

      nodeIndex = findNode(d);
      currentNodeInEditor = nodeIndex;
      //console.log(node);

      var commentOnPos = arrOfNodes[nodeIndex].comment.split(":");
      document.getElementById("commentOnPos").value = commentOnPos[1];
      document.getElementById("openingName").value = commentOnPos[0];

      document.getElementById("idOfNode").innerHTML = nodeIndex;
      document.getElementById("nodeDataWMOVE").value =
        arrOfNodes[nodeIndex].wMove;
      document.getElementById("nodeDataBMOVE").value =
        arrOfNodes[nodeIndex].bMove;

      stockfish.postMessage("position fen " + game.fen());
      stockfish.postMessage("go depth 15");
    }
    if (d3.event.defaultPrevented) return; // click suppressed
  }

  function findNode(node) {
    //console.log("node name is: " + node.name);
    for (var i = 0; i < arrOfNodes.length; i++) {
      if (localStorage.getItem("orientation") === "white") {
        if (
          node.name.replaceAll(" ", "") ===
          arrOfNodes[i].bMove + arrOfNodes[i].wMove
        ) {
          // console.log("match");
          if (arrOfNodes[i].parent === null) {
            document.getElementById("nodeDataBMOVE").readOnly = true;
            return 0;
          }
          if (checkParents(node.parent, arrOfNodes[i].parent)) {
            return i;
          }
        }
      }
      if (localStorage.getItem("orientation") === "black") {
        if (node.name.replaceAll(" ", "") === "") {
          document.getElementById("nodeDataWMOVE").readOnly = true;
          document.getElementById("nodeDataBMOVE").readOnly = true;
          return 0;
        }
        if (
          node.name.replaceAll(" ", "") ===
          arrOfNodes[i].wMove + arrOfNodes[i].bMove
        ) {
          // console.log("match");
          if (checkParents(node.parent, arrOfNodes[i].parent)) {
            return i;
          }
        }
      }
    }
    return 0;
  }

  function checkParents(parentNode, parentNodeCheck) {
    if (localStorage.getItem("orientation") === "white") {
      if (
        parentNode.name.replaceAll(" ", "") !=
        parentNodeCheck.bMove + parentNodeCheck.wMove
      ) {
        return false;
      }

      if (parentNodeCheck.parent != null) {
        return checkParents(parentNode.parent, parentNodeCheck.parent);
      }

      return true;
    }
    if (localStorage.getItem("orientation") === "black") {
      if (
        parentNode.name.replaceAll(" ", "") !=
        parentNodeCheck.wMove + parentNodeCheck.bMove
      ) {
        return false;
      }

      if (parentNodeCheck.parent === null) return true;

      if (
        parentNodeCheck.parent.wMove != "" &&
        parentNodeCheck.parent.bMove != ""
      ) {
        return checkParents(parentNode.parent, parentNodeCheck.parent);
      }

      return true;
    }
  }

  function recursiveGet(node) {
    // console.log(node);
    if (
      node.parent === undefined &&
      localStorage.getItem("orientation") === "black"
    ) {
      return node.name.replaceAll(" ", "?");
    }
    if (node.parent === undefined) {
      return node.name;
    }
    if (localStorage.getItem("orientation") === "black") {
      return recursiveGet(node.parent) + " " + node.name.replaceAll(" ", "?");
    }
    return recursiveGet(node.parent) + "?" + node.name;
  }

  function turnThatIntoPGN(pgn) {
    var arrOfPGN = pgn.split(" ");
    // console.log(arrOfPGN);
    var finalpgn = "";
    if (localStorage.getItem("orientation") === "white") {
      for (var i = 0; i < arrOfPGN.length; i++) {
        finalpgn += i + ". " + arrOfPGN[i].replaceAll("?", " ") + " ";
      }
    }
    if (localStorage.getItem("orientation") === "black") {
      for (var i = 0; i < arrOfPGN.length; i++) {
        finalpgn += i + ". " + arrOfPGN[i].replaceAll("?", " ") + " ";
      }
    }
    return finalpgn;
  }

  function update(source) {
    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    var levelWidth = [1];
    var childCount = function (level, n) {
      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function (d) {
          childCount(level + 1, d);
        });
      }
    };
    childCount(0, root);
    var newHeight = d3.max(levelWidth) * 75; // 25 pixels per line
    tree = tree.size([newHeight, viewerWidth]);

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Set widths between levels based on maxLabelLength.
    nodes.forEach(function (d) {
      d.y = d.depth * (maxLabelLength * 15); //maxLabelLength * 10px
      // alternatively to keep a fixed scale one can set a fixed depth per level
      // Normalize for fixed-depth by commenting out below line
      // d.y = (d.depth * 500); //500px per level.
    });

    // Update the nodes…
    node = svgGroup.selectAll("g.node").data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.

    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("mousedown", click);

    nodeEnter
      .append("circle")
      .attr("class", "nodeCircle")
      .attr("r", function (d) {
        nodeIndex = findNode(d);
        var comment = arrOfNodes[nodeIndex].comment.split(":");
        if (comment[2] === undefined || comment[2] === "1") {
          return 5;
        } else return comment[2] * 20;
      })
      .style("fill", function (d) {
        console.log(d);
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeEnter
      .append("text")
      .attr("x", function (d) {
        nodeIndex = findNode(d);
        var comment = arrOfNodes[nodeIndex].comment.split(":");
        if (comment[2] === undefined || comment[2] === "1") {
          return d.children || d._children ? -10 : 10;
        }

        return d.children || d._children
          ? d.name.length * (parseInt(comment[2]) + 2)
          : d.name.length * (parseInt(comment[2]) + 2) * -1;
      })
      .attr("dy", ".35em")
      .attr("class", "nodeText")
      .attr("font-size", function (d) {
        nodeIndex = findNode(d);
        var comment = arrOfNodes[nodeIndex].comment.split(":");
        if (comment[2] === undefined || comment[2] === "1") {
          return "14px";
        }

        return parseInt(comment[2]) * 5 + (10 - d.name.length) + "px";
      })
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d) {
        return d.name;
      })
      .style("fill-opacity", 0);

    // Update the text to reflect whether node has children or not.
    node
      .select("text")
      // .attr("x", function (d) {
      //   return d.children || d._children ? -10 : 10;
      // })
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d) {
        return d.name;
      });

    // Change the circle fill depending on whether it has children and is collapsed
    node
      .select("circle.nodeCircle")
      //.attr("r", 5) // SIZE OF CIRCLE NODES
      .style("fill", function (d) {
        return d._children ? "rgb(255, 200, 200)" : "#fff";
      });

    // Transition nodes to their new position.
    var nodeUpdate = node
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Fade the text in
    nodeUpdate.select("text").style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle").attr("r", 0);

    nodeExit.select("text").style("fill-opacity", 0);

    // Update the links…
    var link = svgGroup.selectAll("path.link").data(links, function (d) {
      return d.target.id;
    });

    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", function (d) {
        var o = {
          x: source.x0,
          y: source.y0,
        };
        return diagonal({
          source: o,
          target: o,
        });
      });

    // Transition links to their new position.
    link.transition().duration(duration).attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        var o = {
          x: source.x,
          y: source.y,
        };
        return diagonal({
          source: o,
          target: o,
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Append a group which holds all nodes and which the zoom Listener can act upon.
  var svgGroup = baseSvg.append("g");

  // Define the root
  root = treeData;
  root.x0 = viewerHeight / 2;
  root.y0 = 0;

  // Layout the tree initially and center on the root node.
  update(root);
  centerNode(root);
}
