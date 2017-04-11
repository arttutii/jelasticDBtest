/**
 * Created by arttu on 4/11/17.
 */
const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
const https = require('https');
const config = require('getconfig');
const sockets = require('signal-master/sockets');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');
const certOptions = {
    key: sslkey,
    cert: sslcert
};

app.use(express.static('public'));


const server = https.createServer(certOptions, app).listen(8888);
// add this to the end of file
sockets(server, config);

app.get('/', (req, res) => {
    res.send('Hello Secure World!');
});