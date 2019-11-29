const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  type:{
    type:String,
    required:true
  },
  heading:{
    type:String,
    required:true
  },
  text:{
    type:String,
    required:true
  },
  likes:{
    type:String,
    default:'0'
  },
  images:{
    type:String,
    required:false
  }
});

const Blog = mongoose.model('Blog',blogSchema)
module.exports=Blog;
