const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userInUsers=users.filter(users=>{
      return username===users.username;
    });
    if(userInUsers.length>0){
      return true;
    }else{
      return false;
    }

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let matchUserData=users.filter((users)=>{
  return (username===users.username&&password===users.password);
});
if(matchUserData.length>0){
  return true;
}else{
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //‘username’ and ‘password’ provided in the body of the request
  const userName=req.body.username;
  const userPass=req.body.password;
  //test if the req has the username &password
  if(!userName||!userPass){
  res.status(401).send("user data are empty!");
  }
  // save the user credentials for the session as a JWT.
  if(authenticatedUser(userName,userPass)){
    let accessToken=jwt.sign({
      data:userPass
    },'accessToken',{expiresIn:360});
    req.session.authenticated={
      accessToken,userName
    }
    console.log(req.session); 
    res.status(200).send("user logged in successfully");
  }else{
    res.status(401).send("user not authenticated");
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isBan=req.params.isbn;
    const username = req.user;
    const queery=req.query.reviews;
    if((!isBan)||(!queery)){
      res.status(400).send("isban is empty");
    }
    console.log(queery,isBan,username);

  if(books[isBan].reviews[username]){
    books[isBan].reviews[username].text=queery;

    return res.status(200).send("same user modified the review");
   }else{
    books[isBan].reviews[username] = { text: queery };
    return res.status(200).send("another user added a review");
   }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isBan=req.params.isbn;
  const username = req.user;  
    if(!isBan){
      res.status(400).send("isban is empty");
    }
    if(books[isBan].reviews[username]){
    delete books[isBan].reviews[username];
      res.status(200).send("the review is deleted");
    }else{
      res.status(404).send("review not found");
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
