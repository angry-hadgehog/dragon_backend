const auth = require('basic-auth');
const express = require('express');
const User = require('../models/user');

exports.auth = (req, res, next) => {
    req.remoteUser = User.auth(req);
    next();
};

exports.user = (req, res, next) => {
    User.get(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user.id) return res.send(404);
        res.json(user);
    });
};