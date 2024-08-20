import express from "express";
import path from "path";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import flash from "connect-flash";
import { dirname } from "path";
import User from "./models/userModel.js";
import adminRoute from "./routes/admin.js";
import apiRoute from './routes/api.js';
import { isAuthenticated,isNotAuthenticated } from "./middlewares/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new express();
const port = 3000;

app.set("view engine", "ejs");
9
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache , private , must-revalidate");
  return next();
});



//Mongo-DB setup
mongoose
.connect("mongodb://localhost:27017/UserDB")
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB", err);
});

app.use(flash());

app.use('/admin',
  session({
    name: "adminSessionID", // Name of the admin session cookie
    secret: "random@123123321321",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/UserDB",
      collectionName: "AdminSession",
    }),
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use('/',
  session({
    secret: "123123321321", //used to encrypt sessiontoken
    name: "userSessionID",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/UserDB",
      collectionName: "UserSession",
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    },
  })
);


app.use((req, res, next) => {
  res.locals.errorMessage = req.flash("error");
  next();
});


app.use("/admin", adminRoute);
app.use("/api", apiRoute);


app
  .route("/login")
  .get(isNotAuthenticated, (req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    console.log(req.body);
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
          req.session.user = { username: user.username };
          res.redirect("/");
        } else {
          req.flash("error", "Invalid credentials.");
          res.redirect("/login");
        }
      } else {
        req.flash("error", "User not found");
        res.redirect("/login");
      }
    } catch (error) {
      req.flash("error", "An error occurred.");
      res.redirect("/login");
    }
  });

app.get("/", isAuthenticated, (req, res) => {
  res.render("home", { username: req.session.user.username });
});

app
  .route("/signup")
  .get(isNotAuthenticated, (req, res) => {
    res.render("signup");
  })
  .post(async (req, res) => {
    try {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        req.flash("error", "User Already Exists. Please Login!");
        res.redirect("/signup");
      } else if (req.body.password !== req.body.cpassword) {
        req.flash("error", "Passwords do not match.");
        res.redirect("/signup");
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
          phoneno: req.body.phoneno,
          eamil: req.body.email,

        });
        await newUser.save();
        req.session.user = { username: newUser.username };
        res.redirect("/");
      }
    } catch (error) {
      req.flash("error", "An error occurred.");
      res.redirect("/signup");
    }
  });

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during session destruction:", err); // Log the actual error
      return res.status(500).send("Error logging out.");
    }
    // Clear the session cookie
    res.clearCookie("mySesseion"); // Ensure this matches the session name in your session configuration
    res.redirect("/login");
  });
});

// 404 Error handling middleware
app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
