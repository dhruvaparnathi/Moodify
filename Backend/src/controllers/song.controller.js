const songModel = require("../models/song.model");
const storageService = require('../services/storage.service');
const mm = require("music-metadata");

const addSong = async (req, res)=>{
    let { mood } = req.body;

    if(typeof mood === 'string'){
        mood = mood.split(",").map(m => m.trim());
    }

    if(!req.file || !mood){
        return res.status(400).json({ message: "No file provided" });
    }

    const songBuffer = req.file.buffer;

    let tags = {};
    try {
        const metadata = await mm.parseBuffer(songBuffer, req.file.mimetype || 'audio/mpeg');
        tags = metadata.common || {};
    } catch (err) {
        console.error("Error reading ID3 tags with music-metadata:", err);
    }

    let title = tags.title;
    if (!title && req.file.originalname) {
        title = req.file.originalname.replace(/\.[^/.]+$/, "");
    }
    if (!title) {
        title = `Song_${Date.now()}`;
    }

    let artist = tags.artist;
    if (!artist) {
        artist = "Unknown Artist";
    }

    const songAlreadyExist = await songModel.findOne({ title: title });

    if(songAlreadyExist){
        return res.status(400).json({ message: "Song already exists" });
    }

    let songFile = null;
    let posterUrl = null;

    const uploadPromises = [];

    // Always upload song file
    uploadPromises.push(
        storageService.uploadFile({
            buffer: songBuffer,
            fileName: title + ".mp3",
            folder: "/Moodify/songs"
        }).then(res => {
            if (res) songFile = res;
        })
    );

    const picture = tags.picture && tags.picture[0];
    const hasEmbeddedImage = picture && picture.data;
    if (hasEmbeddedImage) {
        const ext = picture.format ? picture.format.split('/')[1] : "jpeg";
        uploadPromises.push(
            storageService.uploadFile({
                buffer: picture.data,
                fileName: title + "." + ext,
                folder: "/Moodify/posters"
            }).then(res => {
                if (res) posterUrl = res.url;
            })
        );
    } else {
        // Fallback placeholder image URL
        posterUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop";
    }

    await Promise.all(uploadPromises);

    if(!songFile || !posterUrl){
        return res.status(400).json({ message: "Failed to upload song file or poster" });
    }

    const song = await songModel.create({
        fileUrl: songFile.url,
        posterUrl: posterUrl,
        title: title,
        artist: artist,
        mood: mood
    });

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
