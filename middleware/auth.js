// src/middlewares/auth.js
function isAdmin(req, res, next) {
    if (req.session.user?.role === "ADMIN") {
      return next();
    }
    return res.status(403).json({ message: "Akses khusus admin" });
  }
  

  
  module.exports = { isAdmin, };
  