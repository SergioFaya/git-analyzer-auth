const winston = require('winston');

module.exports = winston.createLogger({
	format: winston.format.combine(
		winston.format.json(),
		winston.format.colorize(),
	),
	levels: winston.config.syslog.levels,
	transports: [
		new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		new winston.transports.Console({
				format: winston.format.combine(
					winston.format.simple(),
					winston.format.colorize(),
			),
			level: 'error',
		}),
		new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
	],
});

