const app = module.exports = require('express')();

const logger = require('../util/Logger');
const tokenManager = require('../actions/githubAppTokenManager');

app.get('/installation', (req, res) => {
	// every time is called generates a new token
	tokenManager.obtainToken()
		.then(data => {
			res.status(200).json({
				message: 'Installation access token',
				success: true,
				token: data,
			});
		})
		.catch(err => {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: 'Error when creating the private key certificate',
				trace: err,
			});
			res.status(500).json({
				message: 'Unable to generate the token',
				success: false,
			});
		});
});

app.get('/installation/check', (req, res) => {
	var token = req.header('x-install-token');
	if (token) {
		var expired = tokenManager.checkAppToken(token);
		if (expired) {
			res.status(404).json({
				message: 'The token has expired',
				success: true,
				expired,
			});
		} else {
			res.status(202).json({
				message: 'The token is still valid',
				success: true,
				expired,
			});
		}
	} else {
		res.status(404).json({
			message: 'no token provided, must pass token as header x-install-token',
			success: false,
		});
	}
});
