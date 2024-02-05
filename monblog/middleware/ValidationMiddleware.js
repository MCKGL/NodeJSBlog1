module.exports = (req,res,next) =>{
    if(req.files == null || req.body.body == null || req.body.title == null){
        return res.redirect('/posts/new')
    }
    next()
}