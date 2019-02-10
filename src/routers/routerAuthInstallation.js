const express = require('express');
const router = express.Router();
const logger = require('../util/logger/Logger')
const config = require('../config/config');
const superagent = require('superagent');

const installationToken = require('../manageTokens/app/obtainGithubAppToken');
const isTokenExpired = require('../manageTokens/app/checkAppToken');

router.get('/installation', (req, res) => {
    // every time is called generates a new token
    installationToken()
        .then(data => {
            res.status(200).json({
                message: 'Installation access token',
                success: true,
                token: data,
            })
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
                token: installationToken,
            });
        });
});

router.get('/installation/check', (req, res) => {
    var token = req.header('x-access-token');
    if (token) {
        var expired = isTokenExpired(token);
        if (expired) {
            res.status(404).json({
                message: 'The token has expired',
                success: true,
                expired,
            })
        } else {
            res.status(202).json({
                message: 'The token is still valid',
                success: true,
                expired,
            })
        }
    } else {
        res.status(404).json({
            message: 'no token provided, must pass token as header x-access-token',
            success: false,
        });
    }
});

module.exports = router;

