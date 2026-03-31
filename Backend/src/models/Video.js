const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    title: String,
    filePath: String,
    status: {
        type: String,
        default: "processing"
    },
    result: {
        type: String,
        default: "pending"
    },
    userId: String,
}, {timestamps: true});

module.exports = mongoose.model("video", videoSchema);