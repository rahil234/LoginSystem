import { Router } from "express";
import {isAuthenticated,isNotAuthenticated} from './../middlewares/auth.js'
// import session from "express-session";
// import MongoStore from "connect-mongo";
import {dirname} from 'path'
import url from 'node:url'

const admin = Router();


//admin login route
admin.route("/login")
.get(isNotAuthenticated,(req, res) => {
  res.render("adminLogin");
})
.post((req, res) => {
  const { username, password } = req.body;
  // Example authentication logic (replace with actual logic)
  if (username === "admin" && password === "adminpassword") {
    // Set the session for the admin user
    req.session.user = {
      id: req.session.user,
    };
    console.log(req.session.user);
    
    // Redirect to the admin dashboard
    res.redirect("/admin");
  } else {
    req.flash("error", "Invalid credentials.");
    res.redirect("/admin/login");
  }
});


//admin logout route
admin.route("/logout").get((req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during session destruction:", err); // Log the actual error
      return res.status(500).send("Error logging out.");
    }
    // Clear the session cookie
    res.clearCookie("adminSessionID"); // Ensure this matches the session name in your session configuration
    res.redirect("/admin/login");
  });
});

//admin root Route
admin.route("/")
.get(isAuthenticated,(req, res) => {
  res.render("adminHome");
});

export default admin;
