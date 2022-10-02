// custom modules not npm nor common core modules
const logEvents = require("./logEvents");

// event common core modules
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

// initialize object
const myEmitter = new MyEmitter();

// add listener for the log event
myEmitter.on("log", (msg) => logEvents(msg));

setTimeout(() => {
  myEmitter.emit("log", "log event emitted!");
}, 2000);
