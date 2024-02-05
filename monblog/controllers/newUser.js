module.exports = async(req,res) =>{
    res.render('register',{
        errors: req.session.validationErrors
    })
}