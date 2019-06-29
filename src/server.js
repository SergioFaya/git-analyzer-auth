const express = require('express');
const app = new express();
const logger = require('./logger/Logger');
const config = require('./config');
const bodyParser = require('body-parser');
const routerLogin = require('./routes/routerLogin');
const sockets = require('./actions/websocketManager');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// allow cors
const cors = require('cors');
var whitelist = [config.clientHost,config.serverHost, undefined];
var corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			logger.log('error', `cors -> ${origin}`);
			callback(new Error('Not allowed by CORS'));
		}
	}
};
app.use(cors(corsOptions));
// router usage
app.use(routerLogin);
app.all('*', (_req,res)=>{
	res.status(404).json({
		success: false,
		message: 'Not found'
	});
});
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
});
