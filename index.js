require('dotenv').config();
const http = require("http");
var app = require("./app");
// var get_data = require('./get_data');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

console.log("running on http://localhost:" + port);
server.listen(port);
