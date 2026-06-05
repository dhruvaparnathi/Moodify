const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/database');
connectDB();

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());



const authRouter = require('./routes/auth.routes');
const songRouter = require("./routes/song.routes");
const handleError = require('./middlewares/error.middleware');

app.use('/api/auth', authRouter);
app.use('/api/song', songRouter);

const frontendPath = path.join(__dirname, '../public/dist');
app.use(express.static(frontendPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use(handleError);


module.exports = app;
