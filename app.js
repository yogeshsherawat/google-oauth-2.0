const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



app.set("view engine", "ejs");
const atlasUrl = process.env.MongoURL;
mongoose.connect(atlasUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

app.use(express.static(__dirname + '/public'));
console.log(__dirname + "\\public");
app.use(express.json());
app.use('/', authRoutes);
app.listen(process.env.PORT || 3000, () => {
    console.log("App Started");
})