var express = require('express');
var leaderRouter = express.Router();

var mongoose = require('mongoose');

var leaders = require('../models/leadership');
var Verify = require('./verify');

leaderRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {

        leaders.find({}, function(err, leader) {
            if (err) throw err;
            res.json(leader);
        });

    })

.post(Verify.verifyOrdinaryUser, function(req, res, next) {
    leaders.create(req.body, function(err, leader) {
        if (err) throw err;
        console.log('leader created!');
        var id = leader._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the leader with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, function(req, res, next) {
    leaders.remove({}, function(err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

leaderRouter.route('/:leaderId')

.get(Verify.verifyOrdinaryUser, function(req, res, next) {
    leaders.findById(req.params.leaderId, function(err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin,  function(req, res, next) {
    leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function(err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin,  function(req, res, next) {
    leaders.findByIdAndRemove(req.params.leaderId, function(err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = leaderRouter;
