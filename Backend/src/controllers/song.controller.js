const songModel = require("../models/song.model");
const storageService = require('../services/storage.service');
const id3 = require("node-id3");

const addSong = async (req, res)=>{
    let { mood } = req.body;

    if(typeof mood === 'string'){
        mood = mood.split(",").map(m => m.trim());
    }

    if(!req.file || !mood){
        return res.status(400).json({ message: "No file provided" });
    }

    const songBuffer = req.file.buffer;

    const tags = id3.read(songBuffer);

    const [ songFile, posterFile ] = await Promise.all([
        storageService.uploadFile({
            buffer: songBuffer,
            fileName: tags.title + ".mp3",
            folder: "/Moodify/songs"
        }),
        storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            fileName: tags.title + ".jpeg",
            folder: "/Moodify/posters"
        })
    ]);

    if(!songFile || !posterFile){
        return res.status(400).json({ message: "Failed to upload song file or poster" });
    }

    const songAlreadyExist = await songModel.findOne({ title: tags.title });

    if(songAlreadyExist){
        return res.status(400).json({ message: "Song already exists" });
    }

    const song = await songModel.create({
        fileUrl: songFile.url,
        posterUrl: posterFile.url,
        title: tags.title,
        mood: mood
    })

    if(!song){
        return res.status(400).json({ message: "Failed to add song" });
    }

    return res.status(201).json({ message: "Song added successfully", song });
};

const getAllSongs = async (req, res)=>{
    const allSongs = await songModel.find({});
    res.status(200).json({ allSongs });
};

const getTopMoodSongs = async (req, res)=>{
    const mood = req.params.mood;
    const songs = await songModel.find({ mood: mood });
    if(!songs){
        return res.status(400).json({ message: "No songs found for this mood" });
    }
    res.status(200).json({ songs });
};

module.exports = { addSong, getAllSongs, getTopMoodSongs };
