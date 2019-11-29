const express=require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false,limit:'50mb' })
const fs = require('fs');


const Blogs=require('../models/Blog')

ObjectId = require('mongodb').ObjectId;




var events = require('events');
var eventEmitter = new events.EventEmitter();


var count=0
var posts=0
var max_liked_blog
var show_posts

var user,type;


Blogs.find().sort({likes:-1}).limit(2)
  .catch(err=>{console.log(err)})
  .then( h_data=>{
      max_liked_blog=h_data
  })

  function CheckUser(req, res, next) {
      if (req.isAuthenticated()){
        if(req.user.usertype == 'user'){
          return next();
        }
        else {
          return res.sendStatus(404)
        }
      }
      res.redirect('/users/login');
  }

  function IsAuth(req,res,next){
    if(req.isAuthenticated())
      return next()
    return res.send(404)
  }

  function CheckGuide(req, res, next) {
      if (req.isAuthenticated()){
        if(req.user.usertype == 'guide'){
          return next();
        }
        else {
          return res.sendStatus(404)
        }
      }
      res.redirect('/guides/login');
  }



var i=0
router.get('/',IsAuth,function(req,res){
  var user=req.user.username //req.user.username
  var type=req.user.usertype

  console.log(req.query.pg);

  if(req.query.pg){
    i=i+1
  }
  else{
    i=0
  }

   Blogs.find({}).sort({_id:-1}).limit(9).skip(i*9)
   .catch(err=>{console.log(err)})
   .then( data=>{
      count=0
      posts=0

      Blogs.find({$and:[{name:user},{type:type}]}, function(err,p_data){
       if(err){
         console.log(err);
       }else{
         p_data.forEach(function(item,index){
           if(item.name==user && item.type==type){
             count=count+parseInt(item.likes)
             posts=posts+1
           }
         })
          }
          console.log(data.length);
          res.render('blog',{user:req.user,likes:count,posts:posts,blog:data,first:max_liked_blog[0],second:max_liked_blog[1],url:'blog',i:i});

    })
  })
});


var i=0
router.get('/myposts',IsAuth,function(req,res){
  var user=req.user.username //req.user.username
  var type=req.user.usertype

  if(req.query.pg){
    i=i+1
  }
  else{
    i=0
  }

   Blogs.find({$and:[{name:user},{type:type}]}).limit(9).skip(i*9)
   .catch(err=>{console.log(err)})
   .then( data=>{
          count=0
          posts=0
          Blogs.find({$and:[{name:user},{type:type}]}, function(err,p_data){
           if(err){
             console.log(err);
           }else{
             p_data.forEach(function(item,index){
               if(item.name==user && item.type==type){
                 count=count+parseInt(item.likes)
                 posts=posts+1
               }
             })
              }
              res.render('blog',{user:req.user,likes:count,posts:posts,blog:data,first:max_liked_blog[0],second:max_liked_blog[1],url:'myposts',i:i});

        })

  })
});


router.get('/:id',IsAuth,function(req,res){

  Blogs.find({'_id':req.params.id})
  .catch(err=>{console.log(err)})
  .then( user_data=>{

      count=0
      posts=0
      Blogs.find({name:user_data[0].name,type:user_data[0].type}, function(err,p_data){
       if(err){
         console.log(err);
       }else{
         p_data.forEach(function(item,index){
           if(item.name==user_data[0].name && item.type==user_data[0].type){
             count=count+parseInt(item.likes)
             posts=posts+1
           }
         })
          }
            res.render('post',{user:req.user,likes:count,posts:posts,blog:user_data,first:max_liked_blog[0],second:max_liked_blog[1]})

    })


  })

});


var i=0
router.get('/:id/all',IsAuth,function(req,res){

  if(req.query.pg){
    i=i+1
  }
  else{
    i=0
  }

  Blogs.find({'_id':req.params.id})
  .catch(err=>{console.log(err)})
  .then( user_data=>{

    Blogs.find({$and:[{name:user_data[0].name},{type:user_data[0].type}]}).limit(9).skip(i*9)
    .catch(err=>{console.log(err)})
    .then( data=>{

           count=0
           posts=0
           Blogs.find({$and:[{name:user_data[0].name},{type:user_data[0].type}]}, function(err,p_data){
            if(err){
              console.log(err);
            }else{
              p_data.forEach(function(item,index){
                if(item.name==user_data[0].name && item.type==user_data[0].type){
                  count=count+parseInt(item.likes)
                  posts=posts+1
                }
              })
               }
               res.render('blog',{user:req.user,likes:count,posts:posts,blog:data,first:max_liked_blog[0],second:max_liked_blog[1],url:'posts',i:i,id:req.params.id});

         })

   })
  })

});

router.post('/',IsAuth, urlencodedParser, function(req, res){
  var img='uploads/places/Hyderabad/imgs/bg0.jpg';
  console.log('here')
  console.log(req.body);
  if(req.files){
    var k = fs.readFileSync(req.files[0].path)
    img = '/uploads/'+req.files[0].filename
  }

  var blogpost = new Blogs({
    name: req.user.name,
    type: req.user.usertype,
    heading: req.body.title,
    text: req.body.text,
    images: img,
    likes:0
  })
  blogpost.save()
  res.redirect('/blog');
})



//
//
// router.get('/add_post',function(req,res){
//
//   res.render('add_post');
//
//
// });
//
//
// router.post('/add_post',function(req,res){
//
//   var data = req.body.hiddenfield
//   var blog = Blogs()
//   blog = data
//   console.log(blog)
//   blog.save()
//   res.render('add_post')
//
// });

module.exports = router;
