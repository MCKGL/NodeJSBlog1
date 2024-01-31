const BlogPost = require('../models/BlogPost.js')

module.exports = async(req,res) =>{
    try {
        const blogposts = await BlogPost.find({});
        console.log(blogposts);
        res.render('index', { blogposts });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
// Handle the error gracefully if needed
        res.status(500).send('Oops! Something went wrong.');
    }
}