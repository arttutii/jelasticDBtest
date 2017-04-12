'use strict';
const socket = io.connect('http://localhost:3000');

socket.on('message', function (data) {
    console.log('got message from server: '+ JSON.stringify(data));
    document.getElementById('textArea').innerHTML += '<br>' + data.userName + ": " + data.message;
});
socket.on('connect', function() {
    console.log('socket.io connected!');
});
socket.on('disconnect', function() {
    console.log('socket.io connected!');
});
socket.on('joinChannel', (c) => {
    console.log('joined to channel: '+ c);
    document.querySelector('#currentChannel').innerHTML = c;
});

let myUserName = null;

const sendMsg = (message) => {
    console.log('send msg');
    let msg = {};
    msg.app_id = this.appName;
    msg.userName = myUserName || 'Guest';
    msg.time = Date.now();
    msg.message = message;
    // socket.json.emit('message', msg);
    socket.emit('message', msg);
    console.log(msg);
};

document.getElementById('sendBtn').addEventListener('click', (evt) => {
    evt.preventDefault();
    const txt = document.getElementById('textInput').value;
    sendMsg(txt);
});

document.getElementById('userBtn').addEventListener('click', (evt) => {
    evt.preventDefault();
    myUserName = document.getElementById('userNameInput').value;
});

document.getElementById('channelBtn').addEventListener('click', (evt) => {
    evt.preventDefault();
    const channelName = document.getElementById('channelInput').value;
    socket.emit('joinChannel', channelName);
});