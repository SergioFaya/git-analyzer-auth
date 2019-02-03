const express = require('express');
const router = express.Router();
const logger = require('../util/logger/Logger')
const config = require('../config/config');
const superagent = require('superagent');

// https://github.com/login/oauth/authorize?client_id={{client_id}}&scope={{scope}}
router.get('/login', (_req, res) => {
	res.redirect(`https://github.com/login/oauth/authorize?client_id=${config.oauth.client_id}&scope=${config.oauth.scopes[0]}?scope=${+config.oauth.scopes[1]}`);
});

/**
 * Se envia el client id con el secret y el
 * codigo que nos manda github después del oauth.
 * -
 * Si el client_id, el client_secre y el code son
 * correctos github nos envía un access token.
 */
router.get('/auth', (req, res) => {
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
            console.log (accessToken);
            res.status(202).json({
                message: 'Successfully authenticated',
                accessToken,
				success: true,
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

/**
 * Eliminar las credenciales del usuario de la base de datos 
 * TODO:Eliminar token asociado a oauth
 * TODO:Eliminar token asociado a private-kye (installation access)
 * TODO: enviar informacion del usuario a desloggear
 */
router.post('/logout', (req, res) => {
	// Clean the user session
	logger.log({
		date: Date.now().toString(),
		level: 'info',
		message: 'Logout, user:',
	});
	
	res.status(202).json({
		message: 'user session removed',
		success: true,
	});
});

module.exports = router;