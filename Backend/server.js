const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// const connectDB = require("./config/db");
// connectDB();
// const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    res.send('helo')
})

// app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 1001

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})