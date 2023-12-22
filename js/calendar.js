function loadCalHeat() {
  console.log(Math.floor(Date.now() / 1000));
  var cal = new CalHeatMap();

  // add data from pastCal in user database and retrieveFutureCalendarData()
  // doesn't need to be ordered
  // var sampleData = {
  //   "1630000000":-20,
  //   "1624217743":10,
  //   "1625000000":20,
  // }

  // if(localStorage.getItem("curCalendar") === undefined){
  //   localStorage.setItem("curCalendar","{}");
  // }
  var jsonData = JSON.parse(localStorage.getItem("calendar"));
  console.log(jsonData)

  var dateObj = new Date();

  // can use "../extra/data-year.json" or an api call to fetch json
  cal.init({
    highlight: "now",
    itemName: "node",
    data: jsonData,
    start: new Date(dateObj.getFullYear(), 0),
    id: "graph_d",
    domain: "year",
    subDomain: "day",
    range: 1,
    legend: [-1, 10, 20, 30, 40],
  });
}

/*
function retrieveFutureCalendarData(){
  // parse the tree data
  // take the data and create a date object with cur year and 0 for hrs and secs
  // turn it into unix
}

// -------------------------------------------------------------------------------------------

// function uploadcsv(user_csv) {
//   const reader = new FileReader();
//   reader.readAsText(user_csv);
//   reader.onload = function () {
//     console.log(reader.result);
//   };
//   d3.csv(user_csv, function (response) {
//     drawCalendar(response);
//   });
// }

// document.getElementById("csvupload").onchange = function () {
//   if (document.getElementById("csvupload").value.endsWith(".txt")) {
//     uploadcsv(document.getElementById("csvupload").value);
//   }
// };

function processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(",");
  var lines = [];

  for (var i = 1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(",");
    if (data.length == headers.length) {
      var tarr = [];
      for (var j = 0; j < headers.length; j++) {
        // ⚡: O(n^2)
        tarr.push(headers[j] + ":" + data[j]);
      }
      lines.push(tarr);
    }
  }
  // alert(lines);
}

// takes csv file does some d3.js function that
// going to have to change it to accept csv file from loaded and run this when the csv file is uploaded

// d3.csv("tempAnki.csv", function (response) {
//   drawCalendar(response);
// });

// Post request to the calendar database
var dateObj = new Date();
var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
var day = ("0" + dateObj.getUTCDate()).slice(-2);
var year = dateObj.getUTCFullYear();
var today = year + "-" + month + "-" + day;

async function loadCalendar() {
  console.log({ token: token, today: today, action: "get" });
  await fetch("/modify/anki", {
    method: "POST",
    body: JSON.stringify({ token: token, today: today, action: "get" }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("ntrres").textContent = data;
      switch (data) {
        case "Invalid Email":
          break;
        case "Invalid Credential":
          break;
        default:
          console.log(data);
          document.getElementById("ntrres").textContent =
            "Succesfully logged in!";
          sessionStorage.setItem("loggedin", data.username);
          sessionStorage.setItem("token", data.jwtToken);
          window.location.replace("index.html");
      }
    });
}
*/