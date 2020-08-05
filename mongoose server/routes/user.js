var express = require('express')
var router = express.Router()
var User = require('../models/user');
var Organization = require('../models/organization');
var crypto = require('crypto');
var async = require('async');
var multer  = require('multer')
var upload = multer({ dest: 'upload/' })
var fs = require('fs'); 

router.get('/list', (req, res) => {
    let options = {}
    if (req.query.userId)
        options._id = req.query.userId;

    User.find(options)
        .populate({
            path: 'organization',
            select: 'name address -_id',
            model: 'organization'
        })
        .exec((err, data) => {
        if (!err)
        {
            res.json({
                status: 'ok',
                data: data
            })
        }
        else
        {
            res.json({status: 'error', message: err});
        }
    });
})

router.post('/profile', upload.single('profile'), function(req, res) {
    if (req.session.name)
    {
        console.log(req.file);
        fs.rename(req.file.path, 'upload/' + req.session.name, function(err) {
            if (!err)
            {
                res.json({status: 'ok'});
            }
            else
            {
                console.log(err);
                res.json({err: true, message: err});
            }        
        })
    }
    else
    {
        //Delete temporary filename
        fs.unlink(req.file.path, function (err) {
            console.log(err);
        });
        res.json({err: true, message: 'Please login first'});
    }
  
})

router.get('/profile', function (req, res) {
    if (req.session.name)
    {
        fs.readFile('upload/' + req.session.name, function(err, data) {
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(data);
            return res.end();
        });
    }
    else
    {
        res.json({err: true, message: 'Please login first'});
    }
})

router.get('/find', function (req, res) {
    if (req.query && req.query.keyword)
    {
        User.find({firstName: req.query.keyword}, (err, data) => {
            if (!err)
            {
                userData = [];
                for(let i=0; i < data.length; ++i)
                {
                    userData.push({
                        name: data[i].name,
                        firstName: data[i].firstName,
                        lastName: data[i].lastName,
                        email: data[i].email
                    })
                }
                res.json({user: userData});
            }
            else
            {
                res.json({err: true, message: err})
            }
        })
    }
    else
    {
        res.json({err: true, message: 'Missing parameter keyword'});
    }
})

router.post('/login', (req, res) => {
    if (req.body && req.body.name && req.body.password)
    {
        let userData = null;

        async.waterfall([
            // 1. Get User with name and password
            function (getUserCallback) {
                User.findOne({name: req.body.name}, function (err, data) {
                    if (!err)
                    {
                        if (!data)
                            getUserCallback('Invalid name', null);
                        else
                        {
                            userData = data;
                            getUserCallback(null);
                        }                            
                    }
                    else
                    {
                        getUserCallback(err, null);
                    }
                });
            },
            function (checkPasswordCallback) {
                // 2. Get secret and hash                
                let hash = userData.hash;
                let secret = userData.secret;
                // 3. Use this secret to encrypt password
                const thisHash = crypto.createHmac('sha256', secret)
                                .update(req.body.password)
                                .digest('hex');
                // 4. Compare this encrypted password to hash
                if (thisHash == hash)
                {
                    checkPasswordCallback(null);
                }
                else
                {
                    checkPasswordCallback('Incorrect Password')
                }                
            }
        ], function (err) {
            if (!err)
            {
                req.session.name = req.body.name;
                req.session.userId = userData._id;
                res.json({status: 'ok'});
            }                
            else
                res.json({err: true, err});
        })
    }
    else
    {
        res.json({err: true, message: 'Missing parameter name or password'});
    }
})

router.post('/add', (req,res) => {
    if (req.body && req.body.name && req.body.password && req.body.email &&
        req.body.organization)
    {
        async.waterfall([
            function(callback) {
                // Query Organization to get the Id
                Organization.findOne({name: req.body.organization}, (err, data) => {
                    callback(err, data);
                });                
            },
            function(organization, callback) {
                // Create User
                const secret = crypto.randomBytes(16).toString('hex');
                const hash = crypto.createHmac('sha256', secret)
                                   .update(req.body.password)
                                   .digest('hex');
        
                var new_user = new User({
                    name: req.body.name,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    secret,
                    hash,
                    organization: organization._id
                })
                // Save to Database throught mongoose
                new_user.save((err) => {
                    if (!err)
                    {
                        callback(null);
                    }
                    else
                    {
                        callback(err.errmsg);
                    }
                })                
            }
        ], function (err) {
            if (!err)
            {
                res.json({status: 'ok'});
            }
            else
            {
                res.json({err: true, message: err})
            }
        });                
    }
    else
    {
        res.json({status: 'error', errMessage: 'Missing user data'});
    }
})

module.exports = router;