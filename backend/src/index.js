const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require("http"); // Import HTTP module
const socketIo = require("socket.io"); // Import Socket.IO

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

routes(app);

// Kết nối MongoDB
mongoose.connect(`mongodb+srv://vodat0301:${process.env.MONGO_DB}@doanchuynganh.9nlq8.mongodb.net/`)
    .then(() => {
        console.log('Connect Database success');
    }).catch((err) => {
        console.log(err);
    });

// Tạo HTTP server và Socket.IO
const server = http.createServer(app); // Khởi tạo HTTP server từ Express app
const io = socketIo(server); // Khởi tạo Socket.IO với HTTP server

// Lưu trữ Socket.IO instance vào Express app
app.set('socketio', io);

// Sử dụng Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Khởi động server
server.listen(port, () => {
    console.log('Server is running on port:', port);
});

