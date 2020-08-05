var express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
var config = require('./configs');

var app = express();
var user = require('./routes/user')
var organization = require('./routes/organization');
var product = require('./routes/product');
var category = require('./routes/category');
var Schema = mongoose.Schema;

var session = require('express-session');

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'secretSession',
    resave:false,
    saveUninitialized:true,
}))

connectDB = () => {
    mongoose.connect(config.mongo.urlstring, {useNewUrlParser: true,useUnifiedTopology: true });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', function(){
        console.log('DB connected');
    });
}

app.use(cors())
app.use('/organization', organization);
app.use('/product', product);
app.use('/category', category);
app.use('/user', user);
app.use('/public',express.static('public'))

connectDB();
app.listen(8080, ()=>{
    console.log('SERVER STARTING on 8080')
});