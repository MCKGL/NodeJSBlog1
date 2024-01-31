var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload') ;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const newPostController = require('./controllers/newPost');

var app = express();
var id = "65b9009d4e5f44787012e7ec";

// connexion à la bdd
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/newBlog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const BlogPost = require('./models/BlogPost.js');

// BlogPost.create({
//     title: 'title blog',
//     body: 'description blog'
// })
//     .then(blogpost => {
//         console.log('Blog post created:', blogpost);
//     })
//     .catch(error => {
//         console.error('Error creating blog post:', error);
//     });

// //lecture du document de la collection
// BlogPost.find({ title: 'title blog' })
//     .then(blogposts => {
//       console.log('Blog posts found:', blogposts);
//     })
//     .catch(error => {
//       console.error('Error finding blog posts:', error);
//     });
//
// //lecture des documents de la collection contenant la chaine blog
// BlogPost.find({ title: /blog/ })
//     .then(blogposts => {
//       console.log('Blog posts found:', blogposts);
//     })
//     .catch(error => {
//       console.error('Error finding blog posts:', error);
//     });
//
// //read a document by Id
// BlogPost.findById(id)
//     .then(blogposts => {
//       console.log('Blog id posts found:', blogposts);
//     })
//     .catch(error => {
//       console.error('Error finding id blog posts:', error);
//     });
//
// //update document par id
// BlogPost.findByIdAndUpdate(id, {
//   title: 'update post',
//   body: 'update description'
// }, { new: true })
//     .then(updatedBlogPost => {
//       if (updatedBlogPost) {
//         console.log('Blog post updated:', updatedBlogPost);
//       } else {
//         console.log('Blog post not found');
//       }
//     })
//     .catch(error => {
//       console.error('Error updating blog post:', error);
//     });
//
// //delete a document by Id
// BlogPost.findByIdAndDelete(id)
//     .then(deletedBlogPost => {
//       if (deletedBlogPost) {
//         console.log('Blog post deleted:', deletedBlogPost);
//       } else {
//         console.log('Blog post not found');
//       }
//     })
//     .catch(error => {
//       console.error('Error deleting blog post:', error);
//     });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/users', usersRouter);


// app.get('/index',(req,res)=>{
//   res.sendFile(path.resolve(__dirname,'public/index.ejs'))
// });
// app.get('/about',(req,res)=>{
//   res.sendFile(path.resolve(__dirname,'public/about.ejs'))
// });
// app.get('/contact',(req,res)=>{
//   res.sendFile(path.resolve(__dirname,'public/contact.ejs'))
// });
// app.get('/post',(req,res)=>{
//   res.sendFile(path.resolve(__dirname,'public/post.ejs'))
// });

app.get('/index', async (req, res) => {
    try {
        const blogposts = await BlogPost.find({});
        console.log(blogposts);
        res.render('index', { blogposts });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
// Handle the error gracefully if needed
        res.status(500).send('Oops! Something went wrong.');
    }
});

app.get('/post/:id',async(req,res)=>{
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post',{blogpost})
});

// app.use('/users', usersRouter);
// app.get('/about',(req,res) =>{
//   res.render('about')
// })
// app.get('/index',(req,res) =>{
//   res.render('index')
// })
// app.get('/contact',(req,res) =>{
//   res.render('contact')
// })
// app.get('/post',(req,res)=>{
//   res.render('post')
// });

// app.get('/post',(req,res) =>{
//     res.redirect('/posts/new')
// })

// app.get('/posts/new',(req,res)=>{
//   res.render('create')
// });
app.get('/posts/new',newPostController)

//middleware pour ajout post
// app.post('/posts/store',async (req,res) =>{
//     await BlogPost.create(req.body)
//         .then(blogpost => {
//             console.log('Blog post created:', blogpost);
// //redirection a la racine de l'appli
//             res.redirect('/index');
//         })
//         .catch(error => {
//             console.error('Error creating blog post:', error);
//         });
// });

app.post('/posts/store', async (req, res) => {
    try {
        let image = req.files.image;
// Move the uploaded image to the specified path
        image.mv(path.resolve(__dirname, 'public/images', image.name), async (error)=> {
            if (error) {
                console.error('Error moving file:', error);
                return res.status(500).send('Oops! Something went wrong.');
            }
// Create a new blog post with the image path
            await BlogPost.create({
                ...req.body,
                image: '/images/' + image.name
            });
            res.redirect('/index');
        });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).send('Oops! Something went wrong.');
    }
});

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
