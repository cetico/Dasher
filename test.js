import "./src/Dasher.css";

import Dasher from "./src/Dasher";

const dasher = new Dasher({
  // phantomHandler: handler
});
dasher.start();

function handler(dash, value) {
  console.log('dash is ', dash)
}