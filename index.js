// inside index.js
require("dotenv").config();

const PORT = 3000;
const express = require("express");
const server = express();

const morgan = require("morgan");
server.use(morgan("dev"));
//is a function which logs out the incoming requests, like so:

server.use(express.json());
//is a function which will read incoming JSON from requests.

server.get("/background/:color", (req, res, next) => {
	res.send(`
	  <body style="background: ${req.params.color};">
		<h1>Hello World</h1>
	  </body>
	`);
});

server.use((req, res, next) => {
	console.log("<____Body Logger START____>");
	console.log(req.body);
	console.log("<_____Body Logger END_____>");

	next();
});

const apiRouter = require("./api");
server.use("/api", apiRouter);

//connect our client!
const { client } = require("./db");
client.connect();

server.listen(PORT, () => {
	console.log("The server is up on port", PORT);
});
