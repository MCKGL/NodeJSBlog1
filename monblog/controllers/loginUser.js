const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = (req,res) =>{
    const { username,password } = req.body
    User.findOne(
        {username: username}
    ).then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    req.session.userId = user._id
                    res.redirect('/');
                } else {
                    console.error("Login incorrect");
                    res.redirect('/auth/login')
                }
            })
        } else {
            console.error("Login incorrect");
            res.redirect('/auth/login')
        }
    });
}

