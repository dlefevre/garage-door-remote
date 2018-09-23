/*
 * server.js
 */

const app = require("./app");
const config = require("./config");

// Listen for incomming connections
app.listen(config.application.port, config.application.host, () => {
  console.log('Server is listening on host ' + config.application.host + ' and port ' + config.application.port);
});

