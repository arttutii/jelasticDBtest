const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
mongoose.Promise = global.Promise; //ES6 Promise
app.set('view engine', 'pug');

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

    /*cats.create({ name:"asd", age:12, gender:"Robot" }).then(post => {
        console.log(post.id);
    });*/

    app.listen(3000);
}, err => {
    console.log('Connection to db failed: ' + err);
});

app.get('/', function(req, res) {
    res.send("Hello");

});

app.get('/cats', function(req, res) {
    cats.find().where('age').gt('10').exec().then((cats) => {
        res.render('catView', {
            title: 'Page title',
            message: res.send("hello" + cats)
        });
    });


});