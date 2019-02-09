const jwt = require('jsonwebtoken');

module.exports = (token) => {
    var decoded = jwt.decode(token);
    var expiration_time = decoded.exp;
    // 10 digits numbers only
    var timeNow = Math.floor(Date.now()/1000);
    if ( timeNow >= expiration_time) {
        return true;
    }else{
        return false;
    }
}