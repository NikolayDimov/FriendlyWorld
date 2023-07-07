const { verifyToken } = require("../services/userService");

exports.hasToken = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const userData = verifyToken(token);
            req.user = userData;
            // console.log(userData);
            // {
            //     _id: '6488c254945a8ea780decec9',
            //     username: 'niki',
            //     email: 'niki@abv.bg',
            //     iat: 1686684557,
            //     exp: 1686857357
            // }
              
        
            res.locals.email = userData.email;
            res.locals.isAuthenticated = true;
            
        } catch (err) {
            res.clearCookie('token');
            res.redirect('/login');
            return;
        }
    }

    next();
};


exports.isAuth = (req, res, next) => {
    if(!req.user) {
        res.redirect('/login');
    } 
    next();
}


