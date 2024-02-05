const User = require("../models/User")
module.exports = async (req, res) => {
    try {
        await User.create({
            ...req.body,
        });
        res.redirect('/index');
    } catch (error) {
        const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
        req.session.validationErrors = validationErrors
        res.redirect('/auth/register');
        // console.error('Error creating blog post:', error);
        // res.status(500).send('Oops! Something went wrong.');
    }
}