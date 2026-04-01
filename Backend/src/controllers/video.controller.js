const Video = require("../models/Video");

// exports.uploadVideo = async (req, res) => {
//   try {
//     const file = req.file;

//     console.log(file);
//     const video = await Video.create({
//       title: file.originalname,
//       filePath: file.path,
//       status: "uploaded"
//     });

//     res.json({
//       message: "Video uploaded successfully",
//       video
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.uploadVideo = async (req, res) => {
  try {
    const file = req.file;
if (!file) {
  console.log("File is missing");
  return res.status(400).json({ message: "No file uploaded" });
}

    const video = await Video.create({
      title: file.originalname,
      filePath: file.path,
      status: "processing"
    });

    res.json({
      message: "Video uploaded successfully",
      video
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
exports.getVideos = async (req, res) => {
    try{
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json({videos});
    }catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const fs = require("fs");
const path = require("path");

exports.streamVideo = async (req, res) => {
  try {
    const videoId = req.params.id;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    

    const videoPath = video.filePath;

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    const range = req.headers.range;

    // if (!range) {
    //   return res.status(400).send("Requires Range header");
    // }

    if (!range) {
       const headers = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    };

    res.writeHead(200, headers);
    fs.createReadStream(videoPath).pipe(res);
    return;
   }

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4"
    };

    res.writeHead(206, headers);

    const stream = fs.createReadStream(videoPath, { start, end });
    stream.pipe(res);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};