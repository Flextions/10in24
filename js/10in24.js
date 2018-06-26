/*

        10in24.js

*/
/*jshint esversion: 6 */
/////////////////////
// VARIABLES
/////////////////////
let flights = [];
let flight = {};
let temp = {};
let day = 0; // out & in times represent minutes from absolute ZERO which is 12am on day 0
let max_minutes = 0;
let table_data = "";

/////////////////////
// CONSTANTS
/////////////////////
const DEBUG = true;

/////////////////////
// CONSTRUCTORS
/////////////////////
function Flight(_dest, _out, _in) { // Define the Flight Object
  this.row = flights.length;
  this.dest = _dest;
  this.out = _out;
  this.in = _in;
  this.duration = function() {
    return (this.in - this.out);
  };
  this.dayPriorRef = function() {
    return (this.in - 1440); // 24 hours prior to this flights block in.
  };
  this.day = function() {
    return (parseInt(this.in / 1440)); // first day is zero.
  };
  this.minsIn24 = function() {
    var minsIn24 = 0;
    for (n = 0; n <= this.row; n++) { // loop through current & prior flights adding flight minutes accumulated 24 hrs prior to end of current.
      effectiveMinutesThisFlight = ((flights[n].in) - Math.max((flights[n].out), this.dayPriorRef()));
      if (effectiveMinutesThisFlight > 0) {
        minsIn24 = minsIn24 + effectiveMinutesThisFlight;
      }
    }
    return (minsIn24);
  };
}

/////////////////////
// FUNCTIONS
/////////////////////

function minsToHHMM(mins) {
  mins = mins % 1440;
  var HH = Math.floor(mins / 60);
  var MM = (mins % 60);
  return (padNumber(HH) + padNumber(MM));
}

function toMins(_string) {
  let MM = parseInt(_string.substring(2));
  let HH = parseInt(_string.substring(0, 2)) * 60;
  let minutes = HH + MM;
  let relativeMinutes = minutes + (day * 1440);
  max_minutes = Math.max(max_minutes, relativeMinutes);
  if (relativeMinutes < max_minutes) {
    day++;
  }
  return (minutes + (day * 1440));
}

function padNumber(number) {
  if (number < 100) {
    number = ("00" + number).slice(-2);
    return number;
  }
}


function addTable(){
  for(var i = 0; i < flights.length; i++){
    addRow(flights[i]);
  }
}


function addRow(_row){
  console.log(_row);
  tbl = document.getElementById("plan_a");
  var tr = tbl.insertRow();
  tr.id = _row.row;
  var X_cell = tr.insertCell();
  X_cell.appendChild(document.createTextNode('\u2702')); //scissors
  var index_cell = tr.insertCell();
  index_cell.appendChild(document.createTextNode(parseInt(_row.row) + 1));
  var dest_cell = tr.insertCell();
  dest_cell.appendChild(document.createTextNode(_row.dest));
  var out_cell = tr.insertCell();
  out_cell.appendChild(document.createTextNode(minsToHHMM(_row.out)));
  var in_cell = tr.insertCell();
  in_cell.appendChild(document.createTextNode(minsToHHMM(_row.in)));
  var duration_cell = tr.insertCell();
  duration_cell.appendChild(document.createTextNode(_row.duration()));
  var minsin24_cell = tr.insertCell();
  minsin24_cell.appendChild(document.createTextNode(_row.minsIn24()));
}

function deleteRow(_row){
  console.log("Delete row: ", _row);
  // tbl = document.getElementById("plan_a");
  // var tr = tbl.insertRow();
  // tr.id = _row.row;
  // var X_cell = tr.insertCell();
}


function update(_input) {
  console.log(_input.id, ":", _input.value);
  this.result_value = _input.value;
  this.result_key = _input.id;
  temp[result_key] = result_value;
  document.getElementById('result').innerHTML = result_key + ": " + result_value;
}

function flight_submit() {
  let minutesOut = toMins(temp.out);
  let minutesIn = toMins(temp.in);

  let flight = new Flight(temp.dest, minutesOut, minutesIn);
  flights.push(flight);
  addRow(flight);
}

/////////////////////
// CODE
/////////////////////
if (DEBUG) { // use this flag to turn on debugging information display.
  console.log("debugging: ON");
} else {
  console.log("debugging: OFF");
}


console.log(flights);
