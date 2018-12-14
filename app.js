// imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/router');


// app creation
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// stuff
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app._session = session({
	secret: 'super duper secret',
	resave: true,
	saveUninitialized: false
});
app.use(app._session);


// router
app.use('/', indexRouter);


// ERROR Handlers
// 404
app.use(function(req, res, next) {
	next(createError(404));
});

app.use(function(err, req, res, next) {
  	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

  	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


// exports
module.exports = app;