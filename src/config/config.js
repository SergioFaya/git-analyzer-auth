// If an argument is provided in the initialization
// of the server, parses it to number and uses it in the config
const deployType = process.argv[2];
const argPort = +(process.argv[3]);

const deploy = {
	app: {
		port: argPort || 3000,
		source: '0.0.0.0',
		// change the secret on release
		tokenSecret: 'WjKJHMvaLkEnfsN3JHFY',
	},
	oauth: {
		client_id: 'c4c42af4e127583d6c40',
		client_secret: 'd6aa5e40a8d48ffe98c831f65a244879982fe237',
		scopes: [
			'repo',
			'user',
		],
		state: 'abcdefgh',
		userAgent: 'SergioFaya',
		app_id: 18416,
	},
	redis: {
		port: 6379,
		host: 'redis-auth.wn9iyk.0001.euw1.cache.amazonaws.com'
	},
	resources: {
		private_key: './resources/private-key.pem',
		private_key_buffer: undefined,
	},
};

const local = {
	app: {
		port: argPort || 3000,
		source: '0.0.0.0',
		// change the secret on release
		tokenSecret: 'WjKJHMvaLkEnfsN3JHFY',
	},
	oauth: {
		client_id: 'c4c42af4e127583d6c40',
		client_secret: 'd6aa5e40a8d48ffe98c831f65a244879982fe237',
		scopes: [
			'repo',
			'user',
		],
		state: 'abcdefgh',
		userAgent: 'SergioFaya',
		app_id: 18416,
	},
	redis: {
		port: 6379,
		host: ''
	},
	resources: {
		private_key: './resources/private-key.pem',
		private_key_buffer: undefined,
	},
}

const config = {
	deploy,
	local
}

module.exports = config[deployType];