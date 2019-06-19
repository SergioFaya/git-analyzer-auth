var sockets = {};
module.exports = {
	socketIo: null,
	init: (http) => {
		this.socketIo = require('socket.io')(http);
	},
	addEventListener: (event) => {
		return new Promise((resolve, reject) => {
			if (this.socketIo) {
				this.socketIo.on('connection', (socket) => {
					sockets[event] = socket;
				});
				resolve();
			} else {
				reject('SocketIo not started');
			}
		});
	}, sendMessageToSocket: (state, jsonMessage) => {
		return new Promise((resolve, reject) => {
			sockets[state].emit(state, jsonMessage);
			// TODO: elimiar el socket una vez se envie la contraseña
			resolve();
		});

	}
};
