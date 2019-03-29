const express = require('express');
const app = new express();
const logger = require('./util/Logger')
const config = require('./config');
const bodyParser = require('body-parser');
const routes = require('./routes');
const sockets = require('./actions/websockets');
// fs for reading the private key and convert it to a buffer
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// allow cors
const cors = require('cors');
var whitelist = ['http://localhost:4200', 'http://localhost:3001', undefined];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
			// trampa para lo de github
			// callback(null, true)
			console.log(origin);
      callback(new Error('Not allowed by CORS'))
    }
  }
};
app.use(cors(corsOptions));
// router usage
app.use(routes);

// init the servers
const http = require('http').Server(app);
sockets.init(http);
// listen(port,host,backlog,callback)
http.listen(config.app.port, config.app.source, () => {
	console.log(`running on: http://${config.app.source}:${config.app.port}`);
	logger.log({
		date: Date.now().toString(),
		level: 'info',
		message: `Server started on port ${config.app.port}`,
	});
	fs.readFile(config.resources.private_key, (err, data) => {
		if (err) {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: 'Error when reading the private key certificate',
				trace: err,
			});
		} else {
			config.resources.private_key_buffer = data;
		}
	});
});