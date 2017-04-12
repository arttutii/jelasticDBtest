'use strict';
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
        const socketid = socket.id;
        console.log('a user connected with session id '+socket.id);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('message',(jsonMsg) => {
            console.log('received message from client: '+JSON.stringify(jsonMsg));
            const allChannels = [];

            for (let channel in socket.rooms){
                if (channel != socket.id){
                    allChannels.push(channel);
                }
            }
            for (let channel of allChannels){
                io.sockets.in(channel).emit('message', jsonMsg);
            }
        });
        socket.on('joinChannel', (roomName) => {
            socket.join(roomName);
            socket.emit('joinChannel', 'Joined channel "' + roomName + '"');
        });
    }
);
server.listen(3000, () => {
    console.log('Server started (3000)');
});