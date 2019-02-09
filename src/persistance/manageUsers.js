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
                callback(undefined);
            } else {
                callback(reply);
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
                callback(undefined);
            } else {
                callback(reply);
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
                callback(undefined);
            } else {
                callback(reply);
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
                callback(undefined);                
            } else {
                // reply is 1 or 0 for true or false
                callback(reply == 1);
            }
        });
    }
}