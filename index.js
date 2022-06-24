const express = require("express");
const cors = require("cors");
const credentials = require("./credentials");
const bookData = require("./book");
const jwt = require("jsonwebtoken");
const path = require('path');
const PORT = process.env.PORT || 8080

const app = new express();
app.use(cors());
app.use(express.json({ urlencoded: true }));

app.use(express.static('dist/library-frontend'));
app.get('/*', (req, res)=> {
  res.sendFile(path.join(__dirname + 'dist/library-frontend/index.html'))})


// Authentication&Authorization Part

app.post("/api/signup", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Method:GET,POST,PUT,DELETE");
  var userCred = {
    username: req.body.username,
    email: req.body.email,
    regid: req.body.regid,
    password: req.body.password,
  };
  var userdb = new credentials(userCred);
  userdb.save();
  res.send();
});

app.post("/api/login", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Method:GET,POST,PUT,DELETE");
  credentials
  .findOne({ email: req.body.email, password: req.body.password },(err,user)=>{
    if(err){
      console.log("error is",err)
    }
    else{
      console.log(user)
    }
  }).clone()
  .then((user) => {
    if(user !== null){
    let payload = { subject: user.email + user.password };
    let token = jwt.sign(payload, "secretKey");
    res.status(200).send({ token });
    }
    else{
      res.status(401).send('Wrong Credentials')
    }
  });
});

// Book Database CRUD Operations


app.get("/api/book", (req, res) => {
  bookData.find().then((data) => {
    res.send(data);
  });
});

app.post("/api/add", (req, res) => {

  var bookInfo = {
    author: req.body.author,
    bookname: req.body.bookname,
    imgUrl: req.body.imgUrl,
    synopsis: req.body.synopsis,
  };
  var bookdb = new bookData(bookInfo);
  bookdb.save();

  res.send();
  
  }
  )
  app.get('/api/edit/:id',(req,res)=>{
    bookData.findById(req.params.id).then((data)=>{
      res.send(data)
    })
  })

app.put("/api/update", (req, res) => {
  bookData.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        author: req.body.author,
        bookname: req.body.bookname,
        imgUrl: req.body.imgUrl,
        synopsis: req.body.synopsis,
      },
    },
    { new: true },
    (err, updatedBook) => {
      if (err) {
        res.send("Error While Updating");
      } else {
        res.send(updatedBook);
      }
    }
  );
});

app.delete('/api/book/remove/:id',(req,res)=>{
bookData.findByIdAndDelete(req.params.id)
.then(()=>{
      console.log('success')
      res.send();
  })
})



app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
