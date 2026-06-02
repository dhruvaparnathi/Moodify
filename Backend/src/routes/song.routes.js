const express = require("express");
const songRouter = express.Router();
const upload = require("../middlewares/upload.middleware");
const songController = require("../controllers/song.controller");

songRouter.post("/add", upload.single("song"), songController.addSong);
songRouter.get("/", songController.getAllSongs);
songRouter.get("/mood/:mood", songController.getTopMoodSongs);

module.exports = songRouter;