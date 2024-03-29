const BlogPost = require('../models/BlogPost.js')
const path = require('path')

module.exports = async(req,res) =>{
    try {
        let image = req.files.image;
        await image.mv(path.resolve(__dirname, '../public/images', image.name));
            await BlogPost.create({
                ...req.body,
                image: '/images/' + image.name,
                userid : req.session.userId,
            });
            res.redirect('/index');
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).send('Oops! Something went wrong.');
    }
}