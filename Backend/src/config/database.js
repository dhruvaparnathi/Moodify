const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log("Error connecting DB "+err);
    })
}

module.exports = connectDB;