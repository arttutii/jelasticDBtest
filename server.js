const express = require('express'),
    path = require('path'),
    multer = require('multer'),
    dotenv = require('dotenv').config(),
    ExifImage = require('exif').ExifImage,
    DB = require('./modules/database'),
    thumbnail = require('./modules/thumbnail'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose');

const app = express();
app.enable('trust proxy');

// set up database
const user = process.env.DB_USER;
const pw = process.env.DB_PASS;
const host = process.env.DB_HOST;
DB.connect('mongodb://' + user + ":" + pw + "@" + host, app);

const spySchema = {
    time: Date,
    category: String,
    title: String,
    details: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    thumbnail: String,
    image: String,
    original: String
};

const Spy = DB.getSchema(spySchema, 'Spy');


// set up file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/original')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    }
});
const upload = multer({storage: storage});


// serve files
app.use(express.static('files'));

app.use('/doc', express.static('doc'));

app.use('/modules', express.static('node_modules'));

// get all items
app.get('/posts', (req, res) => {
    Spy.find().exec().then((posts) => {
        res.send(posts);
    });
});

// find specific item
/**
 *
 * @api {get} /post/:search Getting an item/items
 * @apiName Search
 * @apiGroup Items
 * @apiDescription Get items from database with a search query
 *
 * @apiParam {String} search User's query for the search
 *
 * @apiSuccess {Array} Array List of the items matching the query
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *     "_id":"58e2190793d2433b162979b8",
 *     "category":"Wizard",
 *     "title":"merlin",
 *     "details":"asd",
 *     "thumbnail":"thumb/1491212551665.jpg",
 *     "image":"img/1491212551665.jpg",
 *     "original":"original/1491212551665.jpg",
 *     "time":"2017-04-03T09:42:31.708Z",
 *     "__v":0
 *     }]
 *
 */
app.get('/posts/:search', (req, res) => {
    const re = new RegExp(req.params.search, 'i');

    Spy.find().or([
            { 'title': { $regex: re }},
            { 'details': { $regex: re }},
            { 'category': { $regex: re }}
        ]).exec((err, result) => {
            res.send(JSON.stringify(result));
    });
});

// add new *************
/**
 *
 * @api {post} /new Adding an item
 * @apiName Add new
 * @apiGroup Items
 * @apiDescription A sequence which happens when the Add-form's submit is triggered
 *
 * @apiParam {FormData} A FormData object containing all the information from the Add-form
 */
// get form data and create object for database (=req.body)
app.post('/new', upload.single('file'), (req, res, next) => {
    const file = req.file;
    req.body.thumbnail = 'thumb/' + file.filename;
    req.body.image = 'img/' + file.filename;
    req.body.original = 'original/' + file.filename;
    req.body.time = new Date().getTime();
    req.body.coordinates = {
        lat: 60.2196781,
        lng: 24.8079786
    };
    next();

});

// create thumbnails
app.use('/new', (req, res, next) => {
    const small = thumbnail.getThumbnail('files/'+req.body.original, 'files/'+req.body.thumbnail, 300, 300);
    if( typeof small === 'object'){
        res.send(small);
    }
    const medium = thumbnail.getThumbnail('files/'+req.body.original, 'files/'+req.body.image, 720, 480);
    if( typeof medium === 'object'){
        res.send(medium);
    }
    next();
});

// add to DB
app.use('/new', (req, res, next) => {
    // console.log(req.body);
    Spy.create(req.body).then(post => {
        res.send({status: 'OK', post: post});
    }).then(() => {
        res.send({status: 'error', message: 'Database error'});
    });

});
// end add new ******************

// start update ****************
app.patch('/update', upload.single('file'), (req, res, next) => {

    if (req.file != null) {
        const file = req.file;
        req.body.thumbnail = 'thumb/' + file.filename;
        req.body.image = 'img/' + file.filename;
        req.body.original = 'original/' + file.filename;
    }

    req.body.time = new Date().getTime();
    req.body.coordinates = {
        lat: 60.2196781,
        lng: 24.8079786
    };

    next();

});
// create thumbnails
app.use('/update', (req, res, next) => {
    if (req.file != null){
        const small = thumbnail.getThumbnail('files/'+req.body.original, 'files/'+req.body.thumbnail, 300, 300);
        if( typeof small === 'object'){
            res.send(small);
        }
        const medium = thumbnail.getThumbnail('files/'+req.body.original, 'files/'+req.body.image, 720, 480);
        if( typeof medium === 'object'){
            res.send(medium);
        }
    }

    next();
});

// add to DB
app.use('/update', (req, res, next) => {
    console.log(req.body);

    Spy.update(
        {_id  : req.body.id},
        {$set: req.body}
    ).then(post => {
        res.send({status: 'OK', post: post});
    }).then(() => {
        res.send({status: 'error', message: 'Database error'});
    });


});
// end update *************

app.delete('/remove', upload.single('file'), (req, res) => {
    console.log(req.body);
    Spy.findByIdAndRemove(req.body.id, (err, rmv) => {
        rmv.save((err, deletedItem) => {
            if (err) return handleError(err);
        })
    }).then(post => {
        res.send({status: 'OK', post: post});
    }).then(() => {
        res.send({status: 'error', message: 'Database error'});
    });

});

// convert GPS coordinates to GoogleMaps format
const gpsToDecimal = (gpsData, hem) => {
    let d = parseFloat(gpsData[0]) + parseFloat(gpsData[1] / 60) + parseFloat(gpsData[2] / 3600);
    return (hem === 'S' || hem === 'W') ? d *= -1 : d;
};