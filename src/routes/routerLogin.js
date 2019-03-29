const app = module.exports = require('express')();
const path = require('path');
const config = require('../config');
var superagent = require('superagent');
var tokenManager = require('../actions/tokenManager');
const logger = require('./../util/Logger')

/**
 * https://github.com/login/oauth/authorize?client_id={{client_id}}&scope={{scope}}
 * Sends the app information neccesary to authenticate the user for this app
 * https://developer.github.com/v3/oauth_authorizations/
 * 
 * We send github the client id with the scope of the authentication we want to obtain
 * Scopes -> several scopes are separed by a space
 * https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
 */
app.get('/login', (req, res) => {
	// does not work when consumed as api by the angular client
	// res.status(302).redirect(`https://github.com/login/oauth/authorize?client_id=${config.oauth.client_id}&scope=${config.oauth.scopes[0]}%20${config.oauth.scopes[1]}`);
	var state = generateRandomState(8);
	var sockets = require('../actions/websockets');
	sockets.addEventListener(state)
		.then(() => {
			res.status(202).json({
				success: true,
				data: `https://github.com/login/oauth/authorize?client_id=${config.oauth.client_id}&scope=${config.oauth.scopes[0]}%20${config.oauth.scopes[1]}&state=${state}`
			});
		}).catch((err) => {
			console.log(err)
			res.status(404).json({
				success: false,
				data: `#`
			});
		});
});

/**
 * After /login github sends to our desired url the access code
 * 
 * Then to ensure the authentication is correct, the client_id
 * the secret_id and the received code are sent back again to 
 * github
 * -
 * If the client_id, client_secret and code are correct
 * github sends back the acess token, which we store in our db
 */
app.get('/auth', (req, res) => {
	const state = req.query.state;
	superagent
		.post('https://github.com/login/oauth/access_token')
		.send({
			client_id: config.oauth.client_id,
			client_secret: config.oauth.client_secret,
			code: req.query.code,
		})
		.set('Accept', 'application/json')
		.then((result) => {
			const accessToken = result.body.access_token;
			tokenManager.createToken(state, accessToken, (err, mytoken) => {
				if (err) {
					/*
					res.status(500).json({
						message: 'Could not authenticate',
						success: false,
						err
					});*/
					res.sendFile(path.join(__dirname + '/../views/error.html'));

				} else {
					var sockets = require('../actions/websockets');
					sockets.sendMessageToSocket(state, { token: mytoken, githubToken: accessToken })
						.then(() => {
							/*
							res.status(202).json({
								message: 'Successfully authenticated',
								token: mytoken,
								accessToken,
								success: true,
							});
							*/
							res.sendFile(path.join(__dirname + '/../views/success.html'));
						});
				}
			});
		}).catch((err) => {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: 'error when getting the github access token',
				trace: err,
			});
			res.sendFile(path.join(__dirname + '/../views/error.html'));
		});
});

app.post('/logout', (req, res) => {
	var token = req.body['x-access-token'];
	if (token) {
		tokenManager.cancelToken(token, (err, result) => {
			if (err) {
				res.status(202).json({
					message: 'cant remove the session',
					success: false,
				});
			} else {
				logger.log({
					date: Date.now().toString(),
					level: 'info',
					message: `Logout, user ${token}`,
				});
				res.status(202).json({
					message: 'user session removed',
					success: true,
				});
			}
		});
	} else {
		res.status(404).json({
			message: 'no token provided, must pass token as header x-access-token',
			success: false,
		});
	}
});

app.get('/login/check', (req, res) => {
	var token = req.header('x-access-token');
	if (token) {
		tokenManager.checkToken(token, (err, expired) => {
			if (err) {
				res.status(404).json({
					message: 'The token has expired',
					success: true,
					expired,
				});
			}
			else {
				res.status(202).json({
					message: 'The token is still valid',
					success: true,
					expired,
				});
			}
		});
	} else {
		res.status(404).json({
			message: 'no token provided, must pass token as header x-access-token',
			success: false,
		});
	}
});

function generateRandomState(length) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}