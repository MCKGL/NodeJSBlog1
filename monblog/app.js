var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload') ;
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newPostController = require('./controllers/newPost');
const validateMiddleWare = require('./middleware/ValidationMiddleware')
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const expressSession = require('express-session')
const authMiddleware = require('./middleware/authMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const logoutController = require('./controllers/logout')
const flash = require('connect-flash');

var app = express();
var id = "65b9009d4e5f44787012e7ec";

// connexion à la bdd
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/newBlog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const BlogPost = require('./models/BlogPost.js');

//variable globale
global.loggedIn = null;


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
app.use(expressSession({
//définition du sale
  secret : 'nodejs est top'
}))
app.use(flash());

app.use("*",(req,res,next)=>{
  loggedIn = req.session.userId
  next()
})

app.get('/index',homeController)
// app.get('/posts/new',newPostController)
app.get('/posts/new',authMiddleware, newPostController)
app.get('/post/:id',getPostController)
// app.post('/posts/store',storePostController)
app.post('/posts/store',authMiddleware, storePostController)
// app.get('/auth/register',newUserController)
app.get('/auth/register',redirectIfAuthenticatedMiddleware,newUserController)
// app.post('/users/register',storeUserController)
app.post('/users/register',redirectIfAuthenticatedMiddleware,storeUserController)
// app.get('/auth/login',loginController)
app.get('/auth/login',redirectIfAuthenticatedMiddleware, loginController)
// app.post('/users/login',loginUserController)
app.post('/users/login',redirectIfAuthenticatedMiddleware,loginUserController)
app.get('/auth/logout', logoutController)

app.get('/',(req,res) =>{
  res.redirect('/index');
})

app.use((req,res)=>{
  res.render('notfound')
})

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
