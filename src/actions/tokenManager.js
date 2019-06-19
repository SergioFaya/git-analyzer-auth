const jwt = require('jsonwebtoken');
const userManager = require('../persistance/manageUsers');
var superagent = require('superagent');
const logger = require('../util/Logger');
const config = require('../config');
module.exports = {
	createToken: (state, githubToken, callback) => {
		// https://developer.github.com/v3/users/
		superagent
			.get('https://api.github.com/user')
			.set('Accept', 'application/json')
			.set('Authorization', `token ${githubToken}`)
			.then((result) => {
				var payload = {
					id: result.body.id,
					githubToken,
				};
				jwt.sign(payload, config.app.tokenSecret, (err, encoded) => {
					if (err) {
						logger.log({
							date: Date.toString(),
							level: 'error',
							message: 'Cannot create the user token',
							trace: err.toString(),
						});
					} else {
						userManager.setUser(encoded, result.body.id, (err, reply) => {
							if (reply) {
								callback(null, encoded);
							} else {
								callback(err);
							}
						});
						userManager.saveTemporary(state, encoded, (err, reply) => {
						});
					}
				});
			}).catch((err) => {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Could not get data from the user to store it',
					trace: err.toString(),
				});
				callback(err);
			});
	}, checkToken: (token, callback) => {
		var decoded = jwt.decode(token);
		if (decoded) {
			userManager.getUser(token, (err, result) => {
				if (err) {
					callback(err);
				} else {
					callback(null, decoded.id != result);
				}
			});
		} else {
			callback(new Error('Cannot check token. Token not decoded'));
		}
	}, cancelToken: (token, callback) => {
		userManager.deleteUser(token, (err, result) => {
			if (err) {
				callback(err);
			} else {
				callback(null, result);
			}
		});
	},
};