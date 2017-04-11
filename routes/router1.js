/**
 * Created by arttu on 4/11/17.
 */
const express = require('express'),
    router = express.Router();

const dummyUsers = [
    {id: '0', name: 'John'},
    {id: '1', name: 'Jill'},
    {id: '2', name: 'Jones'}
];

const findUser = (type, id) => {
    for (let user in dummyUsers){
        if (type == 'findById'){
            if(dummyUsers[user].id == id) {
                return {obj: dummyUsers[user], id: user};
            }
        } else if(type == 'findByName'){
            if(dummyUsers[user].name == id){
                return {obj: dummyUsers[user], id: user};
            }
        }
    }

};

router.get('/', (req, res) => {
    res.send(dummyUsers);
});

router.route('/:query/:newUserName')
    .get((req, res, next) => {
        const user = findUser('findById', req.params.query);
        if(user) {
            res.send(JSON.stringify(user.obj));
        } else {
            res.send('User not found with query: ' + JSON.stringify(req.params.query));
        }
        next();
    })
    .post((req, res, next) => {
        dummyUsers.push({id: (dummyUsers.length), name: req.params.query});
        console.log('user added');
        next();
    })
    .put((req, res, next) => {
        const user = findUser('findByName', req.params.query);
        if (user){
            user.obj.name = req.params.newUserName;
            console.log('user updated');
        } else {
            console.log('user not found');
            res.send('User not found with query: ' + JSON.stringify(req.params.query));
        }
        next();
    })
    .delete((req, res, next) => {
        const user = findUser('findByName', req.params.query);
        const userIndex = user.id;
        if(user){
            if (userIndex > -1) {
                console.log('user removed');
                dummyUsers.splice(userIndex, 1);
            }
        } else {
            console.log('user not found');
            res.send('User not found with query: ' + JSON.stringify(req.params.query));
        }
        next(); // next(500);
    });

module.exports = router;