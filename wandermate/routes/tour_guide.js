const Tp = require('../models/tour_plans')
const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const session = require('express-session');
const multer = require('multer')
const router = new express.Router()
const verify = require('./validating_form')

var urlencodedparser = bodyParser.urlencoded({extended:false});

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

router.post('/tour_plan',CheckGuide, urlencodedparser,verify, async (req,res) => {
    try{
        console.log("-------------------------main function------------------------------")
        console.log(req.body)
        // console.log(req.files)
        var tp = new Tp()
        var order = 0
        var plans = []
        var name,cost,city,days
        for(var key in req.body){
            order += 1
            var items = req.body[key].split(",")
            console.log(items)
            day = items[0]
            city = items[1]
            place = items[2]
            start_time = items[3]
            end_time = items[4]
            var temp_js = {day,order,place,start_time,end_time}
            plans.push(temp_js)
            name = items[5]
            cost = parseInt(items[6])
            days = items[7]
        }
        tp.name = name
        // console.log(plans)
        tp.city=city
        tp.plans = plans
        tp.cost = cost
        tp.num_of_days = days
        tp.guide=req.user.username
        if(req.files[0].originalname !== 'blob'){
            var i;
            var images = []
            for(i=0;i<req.files.length;i++){
                var img = "/uploads/" + req.files[i].filename
                var img_path = { img }
                images.push(img_path)
            }
            tp.images = images
        }
        await tp.save()
        // console.log(tp)
        res.status(201).end()
    }catch(e){
        res.send(e)
    }
})

router.get('/tour_plan',CheckGuide, (req,res) => {
    res.status(200).render('guides')
})

router.get('/tour_plan_details',CheckGuide, async (req,res) => {
    try{
    console.log("-----------------------------------------Entered new page--------------------------")
    var tour = await Tp.find().sort({ _id:-1 }).limit(1)
    console.log(tour[0].plans)
    // var tour_plan =
    var tour_plan = JSON.stringify(tour)
    // var tour_plan = await Tp.find({ _id:tour[0]._id })
    console.log(tour_plan)
    res.status(200).render('detailed_view_of_tour_plan',{ tour })
    }catch(e){
    res.status(404).send(e)
    }

})

module.exports = router
