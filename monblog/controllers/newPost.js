module.exports=async(req,res)=>{
    if(req.session.userId){
        res.render('create')
    } else {
        res.redirect('/auth/login')
    }
};