const User = require('../models/User');
const isadmin =  async (req, res, next) => {
if(req.user.role=='admin'){
    next();
}else{
   res.redirect('/');
}

}
module.exports=isadmin;