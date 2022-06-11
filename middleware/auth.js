const jwt = require('jsonwebtoken');
const config = require('config');
const res = require('express/lib/response');
const req = require('express/lib/request');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token'); //header kay

    // Check if not token
    if(!token) {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch(err){
        res.status(401).json({msg: 'Token is not valid'});
    }
}