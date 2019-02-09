const express = require('express');
const app = new express();
const logger = require('./src/util/logger/Logger')
const config = require('./src/config/config');
// revisar pa que sirve bodyParser y cors
const bodyParser = require('body-parser');
const cors = require('cors');
// fs for reading the private key and convert it to a buffer
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, UPDATE, PUT');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
	next();
});
// router usage
app.use(require('./src/routers/routerLogin'));
app.use(require('./src/routers/routerAuthInstallation'));
app.use((req, res) => {
	res.send(`<html>
    <body>
        <h1>Endpoints</h1>
        <ul>
            <li>/login</li>
            <li>/login/check</li>
            <li>/logout</li>
            <li>/login</li>
            <li>/installation</li>
            <li>/installation/check</li>
        </ul>
    </body>
</html>`);
});

// listen(port,host,backlog,callback)
app.listen(config.app.port, config.app.source, () => {
	console.log('running on port', config.app.port);
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