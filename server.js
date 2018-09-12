/*
 * server.js
 */

// Load dependencies
var express = require('express');
var ejs = require('ejs');

// Load engines
var app = express();
app.set('view engine', 'ejs');

// Set up gpio
var Gpio = require('onoff').Gpio;
var trigger = new Gpio(12, 'out');

// Default get
app.get("/", (req, res) => {
  res.render("index");
});

// Twiddle (push the controller button)
app.post("/trigger", (req, res) => {
  trigger.writeSync(1);
  setTimeout(() => { trigger.writeSync(0) }, 500);
  return res.send('OK');
});

// Listen for incomming connections
app.listen(8080, () => {
  console.log("Server is listening");
});

