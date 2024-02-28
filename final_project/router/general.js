const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post('/register', (req,res) => {

    const doesExist = (username)=>{
        let userswithsamename = users.filter((user)=>{
          return user.username === username
        });
        if(userswithsamename.length > 0){
          return true;
        } else {
          return false;
        }
      }
      
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send( books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
        const author = req.params.author;
        const lenBooks = Object.keys(books);
        for (var i = 1; i < lenBooks.length; i++) {
            if (books[i].author===author){
                res.send( books[i])
            }
          }
        
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const lenBooks = Object.keys(books);
    for (var i = 1; i < lenBooks.length; i++) {
        if (books[i].title===title){
            res.send( books[i])
        }
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reviewBook= Object.values(books[parseInt(isbn)])
    //console.log(reviewBook[2])
    res.send(reviewBook[2])
});



module.exports.general = public_users;


//  get list of books using async-await with axios

axios.get("https://alexfernand2-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/")
.then((response) => console.log("Lista de libros",response.data))
.catch((error) => console.log(error));

//  getting the book details based on ISBN using  axios 

axios.get("https://alexfernand2-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/2")
.then((response) => console.log(response.data))
.catch((error) => console.log(error));

//  getting the book details based on Author using  axios 

axios.get("https://alexfernand2-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/Hans Christian Andersen")
.then((response) => console.log(response.data))
.catch((error) => console.log(error));

//  getting the book details based on title using  axios 

axios.get("https://alexfernand2-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/Things Fall Apart")
.then((response) => console.log(response.data))
.catch((error) => console.log(error));



