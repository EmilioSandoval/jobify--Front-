const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

// IMPORTING ROUTES
const routes = require('./routes/routes');

// SETTINGS
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARES
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: 'Ultimatexbox16',
    port: 3306,
    database: 'a9dq91kuumptvfvd',
}, 'single'));

app.use(express.urlencoded({extended: false}));

app.use(fileUpload({
    createParentPath: true
}));

// ROUTES
app.use('/', routes);

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));





app.listen(app.get('port'), () => {
    console.log('Server on port 3000');
});

