'use strict';
const mongoose = require('mongoose');
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const dotenv = require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');

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

app.use(express.static('public'));

const cats = mongoose.model('cats', catSchema);
const user = process.env.DB_USER;
const pw = process.env.DB_PASS;
const host = process.env.DB_HOST;
    mongoose.connect('mongodb://' + user + ":" + pw + "@" + host).then(() => {
    console.log('Connected successfully.');

    /*cats.create({ name:"JEEBEN", age:12, gender:"Male" }).then(post => {
        console.log(post.id);
    });*/

    //https.createServer(certOptions, app).listen(3000);
    /*http.createServer((req, res) => {
        res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
        res.end();
    }).listen(8080);*/

    /*app.use ((req, res, next) => {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // request was via http, so redirect to https
            res.redirect('https://' + req.headers.host + req.url);
        }
    });*/

    app.listen(3000);

}, err => {
    console.log('Connection to db failed: ' + err);
});

//app.use(cookieParser());

/*app.get('/!*', (req, res) => {
    const param1 = req.path;
    const queryparams = req.query;

    let cookie = req.cookies.testCookie;
    if (cookie === undefined) {
        res.cookie('testCookie',"test", { maxAge: 900000, httpOnly: true });
        console.log('cookie created');
    } else {
        console.log('cookie exists: ', cookie);
    }

    res.set('content-type', 'json');
    console.log(res.get('content-type'));

    res.format({
        text: function(){
            res.send('hey texttt');
        },

        html: function(){
            res.send('<p>hey html</p>');
        },

        json: function(){
            res.send({ message: 'hey jsonjson' });
        }
    });
    /!*res.send(
        '<b>Got to the root with path:</b> '+ param1
        + '<br> <b>with query params:</b> '+ JSON.stringify(queryparams)
        + '<br> <b>cookies:</b> ' + JSON.stringify(req.cookies)
        + '<br> <b>date:</b> ' + moment().format('L')
        + '<br> <b>user-agent:</b> ' + req.headers['user-agent']
        + '<br> <b>ip-address: </b>' + req.connection.remoteAddress

    );*!/

});*/

app.use(require('./routes'));

/*
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


});*/
