
const jwt = require('jsonwebtoken');
const userManager = require('../../persistance/manageUsers');

module.exports = (token, callback) => {
    var decoded = jwt.decode(token);
    if(decoded){
        userManager.getUser(token, (result) => {
            callback(decoded.id != result);
        });
    }else{
        userManager.getUser(token, (result) => {
            callback(null);
        });
    }
    
}