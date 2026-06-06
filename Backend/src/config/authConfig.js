require('dotenv').config();

if(!process.env.BREVO_LOGIN){
    throw new Error("Brevo login key not found");
}

if(!process.env.BREVO_PASSWORD){
    throw new Error("Brevo password not found");
}

if(!process.env.BREVO_SENDER){
    throw new Error("Brevo sender not found");
}

const authConfig = {
    BREVO_LOGIN: process.env.BREVO_LOGIN,
    BREVO_PASSWORD: process.env.BREVO_PASSWORD,
    BREVO_SENDER: process.env.BREVO_SENDER
};

module.exports = authConfig;
