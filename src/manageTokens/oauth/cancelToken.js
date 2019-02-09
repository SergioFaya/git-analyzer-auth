const jwt = require('jsonwebtoken');
const userManager = require('../../persistance/manageUsers');

module.exports = (token, callback) => {
    var decoded = jwt.decode(token);
    userManager.deleteUser(token, (result) => {
        callback(result);
    });
}