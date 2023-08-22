const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const cors = require("cors")

const app = express();

app.use(cors({
  origin:'http://localhost:3000'
  }))
app.use(bodyParser.urlencoded({extended: true}));
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/blogDB")

const blogSchema = ({
  title:String,
  content:String
})
const Blog = mongoose.model("Blog",blogSchema)

let posts= [];

app.get("/", async (req, res)=>{
    const blog = await Blog.find({})
    res.send(blog).status(200)
});
app.delete('/delete',async(req,res)=>{
  await Blog.findByIdAndDelete({_id:req.body.id}).then((err)={
      if(err){
          console.log(err)
      }
  })
  res.send('delete')
})

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){
  const newNote = await req.body;
  const title = _.capitalize(req.body.title);

  const blog = new Blog({
    title: title,
    content: req.body.content

  });
  blog.save()
  .then(()=>{
    res.redirect("/");
}).catch((err) =>{
    console.log(err)
})


});

app.get("/posts/:postid",async  function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  const id = req.params.postid
  // console.log(id);
  const article = await Blog.findById({_id:id})
  res.send(article).status(200)
});

app.listen(5000, function() {
  console.log("Server started on port 5000");
});
