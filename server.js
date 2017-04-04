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

    /*cats.create({ name:"JEEBEN", age:12, gender:"Male" }).then(post => {
        console.log(post.id);
    });*/

    app.listen(3000);
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