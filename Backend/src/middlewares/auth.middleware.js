const userModel = require("../models/user.model");
const redis = require("../config/cache");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const blacklistedToken = await redis.get(token);

    if(blacklistedToken) {
        return res.status(401).json({ message: "Token Invalid" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    }catch(err) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    next();

}

module.exports = authUser;