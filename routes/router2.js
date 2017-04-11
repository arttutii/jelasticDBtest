/**
 * Created by arttu on 4/11/17.
 */
const express = require('express'),
    router = express.Router(),
    moment = require('moment');
const fs = require('fs');
const log_file = fs.createWriteStream('./debug.log', {flags : 'w'});
const log_stdout = process.stdout;

moment.locale('fi');
const saveToLog = (d) => {
    log_file.write(moment().format('L LTS') + ': ' + d + '\n');
    log_stdout.write(moment().format('L LTS') + ': ' + d + '\n');
};

router.use('/:query/:newUserName', (req, res, next) => {
    const timeStamp = moment().format('L LTS');
    const path = req.route.path;
    const ip = req.connection.remoteAddress;
    const browser = req.headers['user-agent'];

    console.log('timestamp: ' + timeStamp);
    console.log('requested path: ' + path);
    console.log('IP-Address: '+ ip);
    console.log('browser name: ' + browser);

});

router.use((err, req, res, next) => {
    res.status(500).send('Error, bad query.');
    saveToLog(err);
});

module.exports = router;
