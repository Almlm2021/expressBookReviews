const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let myUser=req.body.username;
  let myPass=req.body.password;
  if(!myUser||!myPass){
    return res.status(401).send("user data is empty");
  }
  if(!users.find(o=>o.username===myUser)){
    users.push({"username":myUser,"password":myPass});
    return res.status(200).send("user registered successfully");
  }else{
    return res.status(400).send("user already registered");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let myPromis=new Promise((resolve,reject)=>{
    let liste=JSON.stringify(books);

    setTimeout(()=>{
      resolve(liste);
    },600);
  })
  //using express
myPromis.then((d)=>{
  return res.status(200).send(d);
});
  

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  let myPromise=new Promise((resolve,reject)=>{
    let myIsbn=req.params.isbn;
    if(!myIsbn){
     //return res.status(401).send("isbn is empty");
     reject(res.send("isban is empty"))
    }
    resolve(books[myIsbn]);
  })
  let d=await myPromise;
  res.json(d);

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let myPromise=new Promise((resolve,reject)=>{
    let myAuthor=req.params.author;
    if(!myAuthor){
     reject( res.status(401).send("error"));
    }
    let myBook=Object.keys(books).filter(key=>myAuthor===books[key].author).reduce((result,key)=>{
     result[key]=books[key];
     return result;},{});
     resolve(myBook);
  });

 myPromise.then((d)=>{
  res.json(d);
 }).catch(()=>{
 console.log("Author not found");
 })

 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let myPromise=new Promise((resolved,reject)=>{
    let myTitle=req.params.title;
    if(!myTitle){
     reject( res.status(401).send("author is empty"));
    }
    let myBook=Object.keys(books).filter(key=>myTitle===books[key].title).reduce((result,key)=>{
     result[key]=books[key];
     return result;},{});
     resolved(myBook);
  }
  );
myPromise.then(d=>{
  res.json(d);
}).catch(()=>{
  console.log("error");
})
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let myIsbn=req.params.isbn;
  if(!myIsbn){
   return res.status(401).send("isbn is empty");
  }
  return res.status(200).send(books[myIsbn].reviews);
});

module.exports.general = public_users;
