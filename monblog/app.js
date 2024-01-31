var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload') ;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newPostController = require('./controllers/newPost');
const validateMiddleWare = require('./middleware/ValidationMiddleware')
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');

var app = express();
var id = "65b9009d4e5f44787012e7ec";

// connexion à la bdd
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/newBlog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const BlogPost = require('./models/BlogPost.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/posts/store',validateMiddleWare);

app.get('/',(req,res) =>{
    res.redirect('/index');
})
app.get('/index',homeController)
app.get('/posts/new',newPostController)
app.get('/post/:id',getPostController)
app.post('/posts/store',storePostController)
app.get('/auth/register',newUserController)
app.post('/users/register',storeUserController)

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
