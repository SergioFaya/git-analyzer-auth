const jwt = require('jsonwebtoken');
const superagent = require('superagent');
const userManager = require('../../persistance/manageUsers');
const logger = require('../../util/logger/Logger')
const config = require('../../config/config');

module.exports = (githubToken, callback) => {
    // https://developer.github.com/v3/users/
    superagent
        .get('https://api.github.com/user')
        .set('Accept', 'application/json')
        .set('Authorization', `token ${githubToken}`)
        .then((result) => {
            var payload = {
                id: result.body.id,
                githubToken,
            }
            jwt.sign(payload, config.app.tokenSecret, (err, encoded) => {
                if (err) {
                    logger.log({
                        date: Date.toString(),
                        level: 'error',
                        message: 'Cannot create the user token',
                        trace: err.toString(),
                    })
                } else {
                    userManager.setUser(encoded, result.body.id, (err,reply) => {
                        if(reply){
                            callback(null,encoded);
                        }else{
                            callback(err);
                        }
                    });
                }
            });
        }).catch((err) => {
            logger.log({
                date: Date.now().toString(),
                level: 'error',
                message: 'Could not get data from the user to store it',
                trace: err.toString(),
            })
            callback(undefined);
        });
}
