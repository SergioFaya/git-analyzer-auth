var redis = require('redis');
var config = require('../config/config');
var logger = require('../util/logger/Logger');

var redis_cli = redis.createClient(config.redis.port, config.redis.host);
module.exports = {
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
    }, existsUser: (token) => {
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
    }
}