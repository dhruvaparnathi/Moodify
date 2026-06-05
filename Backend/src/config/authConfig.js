require('dotenv').config();

if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("Google OAuth credentials not found");
}

if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("Refresh token secret not found");
}

if(!process.env.GOOGLE_USER){
    throw new Error("Google user not found");
}

const authConfig = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER
};

module.exports = authConfig;