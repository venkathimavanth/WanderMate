const Tp = require('../models/tour_plans')
const Guide = require('../models/Guide')

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
            if(key !=='dates')
            {
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
        }
        Guide.findOne({username:req.user.username})
        .then(async (guide)=>{
if(guide.availabledates){
  var dates = req.body['dates'].split('-')

  if(guide.availabledates.length!=0){
    var dates = req.body['dates'].split('-')

          for (var j = dates.length; j < 0 ; j++) {
            var m1=dates[j]
            if(m1 != '' || m1 != '-'){
            var m2=new Date(m1)
            check=[]
            for (var i = 0; i < days-1; i++) {
              m2.setDate(m2.getDate()+1)
              check.append(m2.getFullYear() + '/' + (m2.getMonth()+1).toString().padStart(2, '0') + '/' + m2.getDate().toString().padStart(2, '0'))

                    }

            var clear=0
            for (var k = 0; k < check.length; k++) {


            for (var i = 0; i < guide.availabledates.length; i++) {
            if(check[k]==guide.availabledates[i].date && guide.availabledates.totalbookings!=0  ){
                  clear=1
            }
          }
}
if(clear==1){
  function arrayRemove(arr, value) {

   return arr.filter(function(ele){
       return ele != value;
   });


}

var result = arrayRemove(dates,m1);
var dates=result

}
else{
  for (var i = 0; i < check.length; i++) {
    for (var k = 0; k < guide.availabledates.length; i++) {
      if(guide.availabledates[i].date==check[i]){
        guide.availabledates[i].plantype='tourplan'
        await guide.save()

      }
    }
  }
}
hold=[]
for (var m=0;m<guide.booking.length;m++){
  if(guide.booking[m].current==true && guide.booking[m].plantype=='tourplan' ){
    hold.push(guide.booking[m].date_n_time.date)
    var t2=new Date(guide.booking[m].date_n_time.date)

    days1=guide.booking[m].days
    for (var i = 0; i < days1-1; i++) {
      t2.setDate(t2.getDate()+1)
      hold.append(t2.getFullYear() + '/' + (t2.getMonth()+1).toString().padStart(2, '0') + '/' + t2.getDate().toString().padStart(2, '0'))

            }
            var t2=new Date(guide.booking[m].date_n_time.date)
            for (var i = 0; i < days1-1; i++) {
              t2.setDate(t2.getDate()-1)
              hold.append(t2.getFullYear() + '/' + (t2.getMonth()+1).toString().padStart(2, '0') + '/' + t2.getDate().toString().padStart(2, '0'))

                    }

  }
}
var booked= new Set(hold)
var dated = new Set(dates)
var datees = new Set([...dated].filter((x) => !booked.has(x)));

var dates=Array.from(datees)
console.log(datees)
console.log('-----')
console.log(dates)
}
        }




removedate=[]
for (var i=0;i<guide.availabledates.length;i++){
    if(guide.availabledates[i].plantype=='singleplace' || guides.availabledates[i].plantype=='daylong'){
                if(guide.availabledates[i].totalbookings == 0){
                  removedate.push(guide.availabledates[i])
                }
    }
}
var myplans=guide.plans

Guide.updateOne({"_id":req.user._id},{
$pullAll: { availabledates: removedate ,plans:myplans},

}).then(x=>{console.log('done')})
}
else{
  hold=[]
  for (var m=0;m<guide.booking.length;m++){
    if(guide.booking[m].current==true && guide.booking[m].plantype=='tourplan' ){
      hold.push(guide.booking[m].date_n_time.date)
      var t2=new Date(guide.booking[m].date_n_time.date)

      days1=guide.booking[m].days
      for (var i = 0; i < days1-1; i++) {
        t2.setDate(t2.getDate()+1)
        hold.append(t2.getFullYear() + '/' + (t2.getMonth()+1).toString().padStart(2, '0') + '/' + t2.getDate().toString().padStart(2, '0'))

              }
              var t2=new Date(guide.booking[m].date_n_time.date)
              for (var i = 0; i < days1-1; i++) {
                t2.setDate(t2.getDate()-1)
                hold.append(t2.getFullYear() + '/' + (t2.getMonth()+1).toString().padStart(2, '0') + '/' + t2.getDate().toString().padStart(2, '0'))

                      }

    }
  }
  var booked= new Set(hold)
  var dated = new Set(dates)
  var datees = new Set([...dated].filter((x) => !booked.has(x)));

  var dates=Array.from(datees)
  console.log(datees)
  console.log('-----')
  console.log(dates)

}
}
console.log(dates)
        tp.dates = dates
        tp.name = name
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
        console.log(tp)
        await tp.save()
        // console.log(tp)
        res.status(201).end()
})
.catch(err=>{console.log(err)})
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
    var tour = await Tp.find({guide:req.user.username}).sort({ _id:-1 }).limit(1)
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
