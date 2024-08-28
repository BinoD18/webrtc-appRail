// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', socket => {
    console.log('New user connected');

    socket.on('join', room => {
        socket.join(room);
        socket.to(room).emit('user-connected');
    });

    socket.on('disconnect', () => {
        io.emit('user-disconnected');
    });

    socket.on('offer', payload => {
        io.to(payload.target).emit('offer', payload);
    });

    socket.on('answer', payload => {
        io.to(payload.target).emit('answer', payload);
    });

    socket.on('ice-candidate', payload => {
        io.to(payload.target).emit('ice-candidate', payload);
    });

    socket.on('screen-offer', payload => {
        io.to(payload.target).emit('screen-offer', payload);
    });

    socket.on('screen-answer', payload => {
        io.to(payload.target).emit('screen-answer', payload);
    });

    socket.on('chat-message', message => {
        io.to(message.room).emit('chat-message', message);
    });
});

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

// Utilisation de FFmpeg
ffmpeg('input.webm')
  .output('output.m3u8')
  .run();


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
