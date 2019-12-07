const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const WishList=require('../models/WishList')

router.get('/:name', function(req, res){
  WishList.find({username:req.params.name}, function(err, wishlist){
    if(err){
      console.log(err);
    }else{
      console.log("abc");
      console.log(wishlist[0].boards);
      res.render('wanderlist', {wishlist:wishlist});
    }
  })
})

module.exports = router;
