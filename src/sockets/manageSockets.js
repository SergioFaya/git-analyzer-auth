
module.exports = (app) => {
    const http = require('http').Server(app);
    const io = require('socket.io')(http);

    io.on('connection', function (socket) {
        console.log('a user connected');
    });
    
    function createSocketRoute(state) {
        io.on(state, function (socket) {
            console.log('message' + socket);
        });
    }
}