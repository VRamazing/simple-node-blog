var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exhbs = require('express-handlebars');
const mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
const helmet = require('helmet')
var mongoStore = require('connect-mongo')(session);

require('./config/passport');

var indexRouter = require('./routes/index.route');
var usersRouter = require('./routes/users.route');
var blogRouter = require('./routes/blog.route');
var projectsRouter = require('./routes/projects.route');
var app = express();

mongoose.Promise = global.Promise;

mongoose.connect(
    "mongodb+srv://vramazing:"
    + process.env.MONGO_ATLAS_PW
    + "@blog-y7003.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true 
    }
)
.then(res => {
    console.log("Connected to DB");
})
.catch(err => console.log(err));


var hbs = exhbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
      isequal: function (url1, url2, options) { 
        if(url1 == url2){
          return options.fn(this);
        }
      },
      substr: function(passedString, options){
        if(passedString !== undefined){
          return passedString.substring(0,170) + "...";
        }
      },
      convertDateToLocal: function(date, options){
        if(date !== undefined){
          return date.toLocaleString();
        }
      }
  },
  defaultLayout: 'layout', extname: '.hbs'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180*60*1000}
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist/umd'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/uploads/users',express.static(__dirname + '/uploads/users'));
app.use('/uploads/posts',express.static(__dirname + '/uploads/posts'));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blog/posts', blogRouter);
app.use('/portfolio/projects', projectsRouter);
// app.use('/portfolio/design', designsRouter);
//app.use('/portfolio/music', ); //Serve music link

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
