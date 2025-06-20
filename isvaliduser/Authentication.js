const jwt= require("jsonwebtoken");
const User = require('../models/User');
const protect =  async (req, res, next) => {
    const token = req.cookies.token;
console.log(token);

  if (!token) {
    return res.status(401).redirect("/login");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // verify token
    // optional: fetch full user info from database
    console.log(payload);
    
    const user = await User.findById(payload.userId);
    if (!user) {
      return  res.redirect("/login")
    }
    req.user = user; // assign full user object
    next();
  } catch (err) {
    res.redirect("/login")
  }
};

// Export the protect function
module.exports = protect;