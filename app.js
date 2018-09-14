const express = require('express');
const app = express();


const tripRoutes = require('./api/routes/trips');
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});



app.use('/', tripRoutes);
module.exports = app;