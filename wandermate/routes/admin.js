const express=require('express');
const { check, validationResult } = require('express-validator');
// const session = require('express-session');

const router = express.Router();
const bodyparser=require('body-parser');
var fs = require('fs');
var multer =require('multer');
const bcrypt=require('bcryptjs');
var passport=require('passport');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

const Placeinfo=require('../models/Placeinfo');

router.get('/dashboard',(req,res)=>{

  res.render('admin.ejs',{layout:'adminlayout'})

});

router.get('/cities',(req,res)=>{
  Placeinfo.find({})
  .then(x=>{

    res.render('admin.ejs',{layout:'adminlayout',places:x})

  })
.catch(x=>{
  return res.redirect('dashboard')
});



});

router.get('/addcity',(req,res)=>{
res.render('adminaddcity',{layout:'adminlayout'})
});

router.post('/thingstodo',(req,res)=>{
  console.log(req.query.id)
  console.log(req.body)
  console.log(req.files)
  if(req.files[0]){

  var k = fs.readFileSync(req.files[0].path)
var path = '/uploads/'+req.files[0].filename
}
else{
var path = '/uploads/suriya1.jpg1573825247106.jpeg'

}
Placeinfo.findOne({_id:req.query.id})
.then(x=>{
  Placeinfo.updateOne({_id:req.query.id},{
    $push:{
      thingstodo:{
        img:path,
        title:req.body.title,
        description:req.body.description,
      }
    }

  })
  .then(y=>{

    res.redirect('/admin/cityinfo?id='+ x._id)

  })
  .catch(z=>{
    res.render('cityinfo',{layout:'adminlayout',place:x})

  })

})
.catch(err=>{
  res.redirect('cities')

  console.log(err);
})

});

router.post('/about',(req,res)=>{
  console.log(req.query.id)
  console.log(req.body)

Placeinfo.findOne({_id:req.query.id})
.then(x=>{
x.about=req.body.about
x.save().then(y=>{
  res.redirect('/admin/cityinfo?id='+x._id)
})
.catch(
  err=>{
    res.redirect('cities')

    console.log(err);
  }
)
})
.catch(err=>{
  res.redirect('cities')

  console.log(err);
})

});

router.post('/history',(req,res)=>{
  console.log(req.query.id)
  console.log(req.body)

Placeinfo.findOne({_id:req.query.id})
.then(x=>{
x.history=req.body.history
x.save().then(y=>{
  res.redirect('/admin/cityinfo?id='+x._id)
})
.catch(
  err=>{
    res.redirect('cities')

    console.log(err);
  }
)
})
.catch(err=>{
  res.redirect('cities')

  console.log(err);
})

});




router.get('/cityinfo',(req,res)=>{
  console.log(req.query)
Placeinfo.findOne({_id:req.query.id})
.then(x=>{

  res.render('cityinfo',{layout:'adminlayout',place:x})

})
.catch(err=>{
  res.redirect('cities')

  console.log(err);
})
});


module.exports = router;
