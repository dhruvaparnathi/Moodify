const express = require('express');
const cookieParser = require('cookie-parser');
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

app.use('/api/auth', authRouter);


module.exports = app;
