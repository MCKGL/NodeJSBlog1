module.exports = (req,res,next) =>{
    if(req.files == null || req.body == null || req.title == null){
        return res.redirect('/posts/new')
    }
    next()
}