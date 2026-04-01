const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { uploadVideo, getVideos, streamVideo } = require("../controllers/video.controller");

router.post("/upload", upload.single("video"), uploadVideo);
router.get("/", getVideos);
router.get("/stream/:id", streamVideo);

module.exports = router;