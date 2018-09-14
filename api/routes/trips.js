var glob = 0;
const express = require('express');
const router = express.Router();
var firebase = require('firebase');
require('firebase/auth');
var admin = require("firebase-admin");

var serviceAccount = require("../../trippy-f5dd6-firebase-adminsdk-lcwe4-8a6f777124.json");

firebase.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://trippy-f5dd6.firebaseio.com"
});


var trips = [{ "userId": 1, "id": 1, "title": "Leh", "body": "bikeride", "startdate": '', "enddate": '', "goers": ["Gourav", "anuj", "Gourav", "anuj", "Gourav", "anuj", "Gourav", "anuj", "Gourav", "anuj"] },
{ "userId": 1, "id": 2, "title": "shimla", "body": "the shimla trip", "goers": ["Gourav"] }, { "userId": 1, "id": 3, "title": "kullu", "body": "its raining", "goers": ["Gourav"] }, { "userId": 1, "id": 4, "title": "manali", "body": "cold", "goers": ["Gourav"] }, { "userId": 1, "id": 5, "title": "malana", "body": "Get hopes high", "goers": ["Gourav"] }];

router.get('/posts', (req, res, next) => {
    var dref = firebase.database().ref('/');
    dref.once('value', gotData, gotError);

    function gotData(data) {

        var score = data.val();
        var keys = Object.keys(score);


        var trippy = [];

        for (var i = 0; i < keys.length - 1; i++) {
            trippy.push({ "userId": 1, "id": score[keys[i]].id, "title": score[keys[i]].title, "body": score[keys[i]].content, "startdate": score[keys[i]].start, "enddate": score[keys[i]].end, "goers": Object.values(score[keys[i]].goers) });



        }

        res.json(trippy);
    }

    function gotError(err) {
        console.log('Error');
        console.log(err);
    }







});






router.get('/posts/:tripid', (req, res, next) => {
    const id = req.params.tripid;
    var dref = firebase.database().ref('/');
    dref.once('value', gotData, gotError);

    function gotData(data) {

        var score = data.val();
        var keys = Object.keys(score);


        var trippy;
        var j = req.params.tripid - 1;
        var c;

        trippy = ({ "userId": 1, "id": score[keys[j]].id, "title": score[keys[j]].title, "body": score[keys[j]].content, "startdate": score[keys[j]].start, "enddate": score[keys[j]].end, "goers": Object.values(score[keys[j]].goers) });


        console.log(trippy);
        res.json(trippy);


    }

    function gotError(err) {
        console.log('Error');
        console.log(err);
    }





});


router.post('/loginuser', (req, res, next) => {
    console.log(req.body);
})






router.post('/new-post', (req, res, next) => {
    const k = req.body;

    console.log(req.body)
    res.status(201).json({
        msg: "new post created"
    })
    var title = req.body.title;
    var content = req.body.content;
    var start = req.body.startdate;
    var end = req.body.enddate;
    var dbrf = firebase.database().ref('/global');

    var check;
    dbrf.once('value', gotData, gotError);
    function gotData(data) {
        check = data.val();
        check = check + 1;
        firebase.database().ref('/global').set(check);
        writeUserData(title, content, start, end, check);
    }

    function gotError(err) {
        console.log('error');
        console.log(err);
    }






    function writeUserData(title, content, start, end, global) {
        firebase.database().ref('/').push({
            id: global,
            title: title,
            content: content,
            start: start,
            end: end,
            goers: "",
            userId: 1


        });
    }


});
router.post('/posts/join/:id', (req, res, next) => {
    const k = req.body;
    res.status(201).json({
        msg: "joined"
    })
    console.log("join")
    console.log(req.params.id)
    console.log(req.body.goer)
    trips[(req.params.id) - 1].goers.push(req.body.goer);

    var dbrf = firebase.database().ref('/');
    dbrf.once('value', gotData, gotError);
    function gotData(data) {
        var scores = data.val();
        var keys = Object.keys(data.val());
        for (var i = 0; i < keys.length; i++) {
            var f = keys[i];
            if (scores[f].id == req.params.id) {
                firebase.database().ref('/' + f + '/goers').push(req.body.goer);

            }


        }

    }
    function gotError(err) {
        console.log('error');
        console.log(err);
    }







});

router.delete('/posts/delete/:theId', (req, res, next) => {
    const p = req.params.theId;
    res.status(200).json({
        message: "deleted"
    })
    console.log("delete")
    console.log(p)

});
module.exports = router;