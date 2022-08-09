module.export ={
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'You must log in to view that resource');
        res.redirect('/users/login');
    }
}