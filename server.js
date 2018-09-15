/*
 * server.js
 */

const app = require("./app");
const config = require("./config")

// Listen for incomming connections
app.listen(config.application.port, () => {
  console.log("Server is listening on port " + config.application.port);
});

