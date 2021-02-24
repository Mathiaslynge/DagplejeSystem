const express = require('express');
var cors = require('cors');
const { request, response } = require('express');
const app = express()
const config = require('./config');
const bodyParser = require("body-parser");
const fs = require('fs')

const hbs = require('hbs'); 
const session = require('express-session');
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'hbs');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');

app.use(session({ secret: 'hemmelig', saveUninitialized: true, resave: true }));


app.use(cors()); 
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/loginBruger', require('./routes/loginBruger'));
app.use('/ugeoversigt', require('./routes/ugeoversigter'));
app.use('/bruger', require('./routes/bruger'));
app.use('/profil', require('./routes/profil'));
app.use('/infotavle', require('./routes/infotavle'));
app.use('/galleri', require('./routes/image'));
app.use('/beskeder', require('./routes/message'));
app.use('/', require('./routes/private'));

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({extended: true}))


app.use(express.static(__dirname + '/public'));
const port = process.env.PORT || config.localPort; // Heroku
app.listen(port);
console.log('Listening on port ' + port + ' ...');

module.exports = app; // test