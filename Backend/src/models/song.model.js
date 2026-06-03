const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    fileUrl:{
        type: String,
        required: [true, "Song fileUrl required"]
    },
    posterUrl:{
        type: String,
        required: [true, "Song posterUrl required"]
    },
    title:{
        type: String,
        required: [true, "Song title required"]
    },
    artist:{
        type: String,
        default: "Unknown Artist"
    },
    mood:{
        type: [String],
        enum: ['happy','sad','surprised','angry','calm','romantic']
    }
});

const songModel = mongoose.model("song", songSchema);

module.exports = songModel;