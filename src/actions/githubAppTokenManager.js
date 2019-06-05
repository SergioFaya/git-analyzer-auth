const jwt = require('jsonwebtoken');
const NodeRsa = require('node-rsa');
const config = require('../config');

// TODO: add memoization to tokens
module.exports = {
    obtainToken: () => {
        return new Promise((resolve, reject) => {
            // nodersa manages key operations
            var key = new NodeRsa();
            // read the pem certificate and then import it into rsa manager
            // PKCS#1 RSAPrivateKey
            var pemBuffer = config.resources.private_key_buffer;
            if (config.resources.private_key_buffer == undefined) {
                reject('Private key not found')
            }
            key.importKey(pemBuffer);
            // export the key in the github api desired format
            // TODO: extract key encryption algorithms to a config file
            var private_key = key.exportKey('pkcs1-private');
            generatePayload()
                .then(payload => {
                    // TODO: extract algorithm to config
                    // we generate an access token for the app as installation
                    var token = jwt.sign(payload, private_key, { algorithm: 'RS256' });
                    resolve(token);
                })
                .catch(err => {
                    reject(err);
                })
        });
    },
    checkAppToken: (token) => {
        var decoded = jwt.decode(token);
        var expiration_time = decoded.exp;
        // 10 digits numbers only
        var timeNow = Math.floor(Date.now() / 1000);
        if (timeNow >= expiration_time) {
            return true;
        } else {
            return false;
        }

    }

}

/**
 * Create the payload that will be sended in the auth token to github according with docs
 * https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-an-installation
 * note that ruby script in docs works but in nodejs we must trim 
 * the integer lenght to 10 digits as numbers in js are longer as they ARE FUCKING MILLISECONDS
 */
function generatePayload() {
    return new Promise((resolve, reject) => {
        // Math.floor o Math.round 
        var iat = Math.floor(Date.now() / 1000);
        //iat = iat.substring(0, 10);
        var exp = (Math.floor(Date.now() / 1000) + (10 * 60));
        //exp = exp.substring(0, 10);
        var payload = {
            // issued at time
            iat,
            // expiration time
            exp,
            // github app identifier
            iss: config.oauth.app_id,
        }
        if (config.oauth.app_id == undefined) {
            reject('App id not present');

        } else {
            resolve(payload);
        }
    });
}