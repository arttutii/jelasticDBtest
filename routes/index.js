/**
 * Created by arttu on 4/11/17.
 */
const express = require('express'),
    router = express.Router();

router.use('/users', require('./router1'));
router.use('/', require('./router2'));

module.exports = router;