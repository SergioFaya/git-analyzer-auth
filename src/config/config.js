// If an argument is provided in the initialization
// of the server, parses it to number and uses it in the config
const argPort = +(process.argv[3]);

module.exports = {
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
	},
	resources: {
		private_key: './resources/private-key.pem',
		private_key_buffer: undefined,
	},
};
