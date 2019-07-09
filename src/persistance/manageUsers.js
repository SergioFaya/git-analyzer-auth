var redis = require('redis');
var config = require('../config/index');
var logger = require('../logger/Logger');

var redis_cli = redis.createClient(config.redis.port, config.redis.host);
/**
 * Provides functionalities to access the redis database
 */
module.exports = {
	/**Returns the information of a user register */
	getUser: (token, callback) => {
		redis_cli.get(token, (err, reply) => {
			if (err) {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Cant get user from db',
					trace: err.message,
					token,
				});
				callback(err);
			} else {
				callback(null, reply);
			}
		});
		/**Stores a user register in the database */
	}, setUser: (token, userId, callback) => {
		redis_cli.set(token, userId, (err, reply) => {
			if (err) {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Cant set user',
					trace: err.message,
					token,
					userId,
				});
				callback(err);
			} else {
				callback(null, reply);
			}
		});
		/** Deletes a user register from the database */
	}, deleteUser: (token, callback) => {
		redis_cli.del(token, (err, reply) => {
			if (err) {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Cant delete user from db',
					trace: err.message,
					token,
				});
				callback(err);
			} else {
				callback(null, reply);
			}
		});
		/** Checks the existance of a user*/
	}, existsUser: (token, callback) => {
		redis_cli.exists(token, (err, reply) => {
			if (err) {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Cant check exists of user key',
					trace: err.message,
					token,
				});
				callback(err);
			} else {
				// reply is 1 or 0 for true or false
				callback(null, reply == 1);
			}
		});
	},
};