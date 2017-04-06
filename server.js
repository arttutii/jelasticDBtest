const mongoose = require('mongoose');
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const dotenv = require('dotenv').config();
const app = express();

mongoose.Promise = global.Promise; //ES6 Promise
app.set('view engine', 'pug');
app.enable('trust proxy');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');
const certOptions = {
    key: sslkey,
    cert: sslcert
};

const Schema = mongoose.Schema;

const catSchema = new Schema({
    name:  String,
    age: Number,
    gender: String,
    color: String,
    weight: Number
});

const cats = mongoose.model('cats', catSchema);
const user = process.env.DB_USER;
const pw = process.env.DB_PASS;
const host = process.env.DB_HOST;
    mongoose.connect('mongodb://' + user + ":" + pw + "@" + host).then(() => {
    console.log('Connected successfully.');

    /*cats.create({ name:"JEEBEN", age:12, gender:"Male" }).then(post => {
        console.log(post.id);
    });*/

    https.createServer(certOptions, app).listen(3000);
    /*http.createServer((req, res) => {
        res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
        res.end();
    }).listen(8080);*/

    app.use ((req, res, next) => {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // request was via http, so redirect to https
            res.redirect('https://' + req.headers.host + req.url);
        }
    });

}, err => {
    console.log('Connection to db failed: ' + err);
});

app.get('/', (req, res) => {
    cats.find().exec().then((cats) => {
        res.render('catView', {
            title: 'cats cats cats',
            catValues: cats
        });
    });

});

app.get('/cats', (req, res) => {
    cats.find().exec().then((cats) => {
        res.render('catView', {
            title: 'Page title cats cats cats',
            message: 'cats cats cats ' + res.send(cats)
        });
    });


});