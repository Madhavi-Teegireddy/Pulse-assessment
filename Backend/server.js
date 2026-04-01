const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require("./src/config/db.js");
connectDB();
const authRoutes = require("./src/routes/auth.routes");
const videoRoutes = require("./src/routes/video.routes.js");
const cors = require("cors");

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    res.send('helo')
})

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})