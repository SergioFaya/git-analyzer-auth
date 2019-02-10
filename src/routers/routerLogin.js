const express = require('express');
const router = express.Router();
const logger = require('../util/logger/Logger')
const config = require('../config/config');
const superagent = require('superagent');

var checkMyToken = require('../manageTokens/oauth/checkMyToken');
var cancelToken = require('../manageTokens/oauth/cancelToken');
var createUserToken = require('../manageTokens/oauth/createUserToken');
/**
 * https://github.com/login/oauth/authorize?client_id={{client_id}}&scope={{scope}}
 * Sends the app information neccesary to authenticate the user for this app
 * https://developer.github.com/v3/oauth_authorizations/
 * 
 * We send github the client id with the scope of the authentication we want to obtain
 * Scopes -> several scopes are separed by a space
 * https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
 */

router.get('/login', (_req, res) => {
	// send the redirection address that will be handled by the client

	/*
	res.status(202).json({
		success: true,
		data: `https://github.com/login/oauth/authorize?client_id=${config.oauth.client_id}&scope=${config.oauth.scopes[0]}%20${config.oauth.scopes[1]}`,
		message: 'datas'
	});

	*/
	// doesnt work when consumed as api by the angular client
	res.status(302).redirect(`https://github.com/login/oauth/authorize?client_id=${config.oauth.client_id}&scope=${config.oauth.scopes[0]}%20${config.oauth.scopes[1]}`);
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

router.get('/login', (req, res) => {
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
			createUserToken(accessToken, (mytoken) => {
				if (mytoken) {
					// Changing to redirect to angular
					
					res.status(202).json({
						message: 'Successfully authenticated',
						token: mytoken,
						accessToken,
						success: true,
					});
					
				} else {
					res.status(500).json({
						message: 'Could not authenticate',
						token: mytoken,
						success: false,
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
			res.status(404).json({
				message: 'ERROR: cannot get the access token',
				success: false,
			});
		});
});

router.post('/logout', (req, res) => {
	var token = req.header('x-access-token');
	if (token) {
		cancelToken(token, (result) => {
			if (result) {
				logger.log({
					date: Date.now().toString(),
					level: 'info',
					message: `Logout, user ${token}`,
				});
				res.status(202).json({
					message: 'user session removed',
					success: true,
				});
			} else {
				res.status(202).json({
					message: 'cant remove the session',
					success: false,
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

router.get('/login/check', (req, res) => {
	var token = req.header('x-access-token');
	if (token) {
		checkMyToken(token, (expired) => {
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
		});
	} else {
		res.status(404).json({
			message: 'no token provided, must pass token as header x-access-token',
			success: false,
		});
	}
});


module.exports = router;