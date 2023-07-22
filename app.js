const express = require("express");
const ejsLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const app= express();

app.set('view engine','ejs');
app.set('views', __dirname + "/views");
app.set('layout','layouts/layout');
app.use(express.static('uploadFile'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(ejsLayouts);

const port = process.env.PORT | 5600;

require('./connection/connection');

const messengerRoute = require('./routes/messenger');

app.use('/',messengerRoute);

app.listen(port,()=>{
    console.log("listening at port!");
})
