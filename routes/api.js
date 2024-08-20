import { Router } from "express";
import User from "./../models/userModel.js";

const api = Router();

api.route("/users").get((req, res) => {
  User.find({},{password:0}).then((users) => {
    res.json(users);
  });
});

api.delete('/delete-user/:userid',(req,res)=>{
  console.log(req.params.userid);
  User.deleteOne({_id:req.params.userid}).then(()=>{
    res.sendStatus('200')
  })
})

export default api;
