const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const blacklistedToken = await blacklistModel.findOne({ token: token });
    if(blacklistedToken) {
        return res.status(401).json({ message: "Unauthorized" });
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