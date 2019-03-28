module.exports = {
    socketIo: null,
    init: (http) => {
        this.socketIo = require('socket.io')(http);
    },
    addEventListener: (event) => {
        return new Promise((resolve, reject) => {
            if(this.socketIo){
                this.socketIo.on('connection', (socket) => {
                    console.log('a user connected');
                });
                resolve();
            }else{
                reject('SocketIo not started');
            }
        });
    }
};
