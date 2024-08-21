import { Router } from "express";
import User from "./../models/userModel.js";

const api = Router();

api.get("/", (req, res) => res.send("api Route"));

api.get("/search", async (req, res) => {
  const searchQuery = req.query.searchQuery;
  try {
    // Perform a case-insensitive search on username, email, or phoneno
    const results = await User.find({
      $or: [
      { username: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
      { phoneno: { $regex: searchQuery, $options: "i" } }
      ],
    });

    // Return the matching results as JSON
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

api.route("/users").get((req, res) => {
  User.find({}, { password: 0 }).then((users) => {
    res.json(users);
  });
});

api.delete("/delete-user/:userid", (req, res) => {
  User.deleteOne({ _id: req.params.userid }).then(() => {
    res.sendStatus("200");
  });
});

api.post("/update-user/:userid", (req, res) => {
  const { username, email, phoneno } = req.body;

  User.findByIdAndUpdate(req.params.userid, { username, email, phoneno })
    .then(() => {
      res.redirect("/admin");
    })
    .catch((error) => {
      res.redirect("/admin");
    });
});

export default api;
