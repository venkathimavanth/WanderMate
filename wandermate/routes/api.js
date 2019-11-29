const Api = require('../models/apis')
const express = require('express')
const Guide = require('../models/Guide')

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
var urlencodedparser = bodyParser.urlencoded({extended:false});
const API = require('../models/apis')
const TP = require('../models/tour_plans')
const nodemailer = require('nodemailer')
const axios = require('axios')
const router = new express.Router()

router.post('/API', urlencodedparser, [check('plan').not().isEmpty().withMessage('Please select a plan i'),
                                      check('cost').not().isEmpty().withMessage('Please select a plan i'),
                                      check('type').not().isEmpty().withMessage('Please select a plan i'),
                                      check('email').not().isEmpty().withMessage('Please enter your Email')
                                                    .isEmail().withMessage('Enter valid email-ID')
                                      .custom(async (value,{ req }) => {
          var res = await API.findOne({ email:value,type:req.body.type,time:req.body.plan }).countDocuments()
          if(!res){
            return false
          }
        }).withMessage('You have already registered for the plan')],async (req,res) => {
        try{
          console.log('----------------------------From main function----------------------')
          console.log(req.body)
            const errors = validationResult(req)
            console.log(errors);
            if(!errors.isEmpty()){
                console.log('Error found')
                return res.status(422).json(errors.array())
            }
            else{
                  const api = new Api()
                  api.email = req.body.email
                  api.price = req.body.cost
                  api.plan = req.body.plan
                  api.type = req.body.type
                  var current = new Date()
                  if(req.body.plan === "monthly"){
                      api.expiry = current.setMonth(current.getMonth() + 1)
                  }
                  else if(req.body.plan === "yearly"){
                      api.expiry = current.setMonth(current.getMonth() + 12)
                  }
                  console.log(api)
                  await api.save()
                  // let result = await api.completeAPI()

                  res.status(201).end()
                }
        }catch(e){
            console.log('------hello------')
            console.log(e)
            res.status(400).json(e['error'].message)
        }
})

router.get('/pricing', (req,res) => {
    res.status(200).render('pricing')
})

router.get('/guides',async (req,res) => {
    try{
        if(req.query.api){
            let api_key = req.query.api
            let result = await Api.checkAPI(api_key)
            console.log(result)
            var final_guides = []
            if(result.result === true && result.isexpired === false){
                if(req.query.city){
                    let place = req.query.city
                    console.log(place)
                    const guides = await Guide.find({ city:place })
                    console.log(guides)
                    for(var i=0;i<guides.length;i++)
                    {
                      var len = guides[i].plans.length;
                      if(guides[i].plans[len-1].plantype ==="daylong"){
                        final_guides.push(guides[i])
                      }
                    }
                    console.log(final_guides)
                    return res.status(200).send(final_guides)
                }
                const guides = await Guide.find({})
                for(var i=0;i<guides.length;i++)
                {
                  var len = guides[i].plans.length;
                  if(guides[i].plans[len-1]==="daylong"){
                    final_guides.push(guides[i])
                  }
                }
                return res.status(200).send(final_guides)
            }
            else{
                throw "Please check your api and it's expiry date"
            }

        }
    }catch(e){
        res.status(400).send([{
            error:e,
        }])
    }
})

router.post('/guides/book', async(req,res) =>{
    try{
        console.log(req.query)
        let api_key = req.query.api
        var g_id = req.query.guide_id
        let result = await Api.checkAPI(api_key)
        let email = req.query.email
        console.log(result)
        if(result.result === true && result.isexpired === false){
           //Booking
            var guide = await Guide.find({ _id:g_id })
            guide = guide[0]
            console.log('Booking is done here')
            var dates = []
            var da=req.query.dates.split('-')
            console.log(da)
            for(var i =0; i < da.length;i++)
            {
                dates.push(da[i])
            }
            console.log(dates)
            var url = (("http://127.0.0.1:8080/gettransaction/".concat('2')).concat("/password/")).concat(req.query.tranc_id)
            console.log(url)
            var status
            axios.get(url).then(async (response) =>{
                // console.log(response)
                status = response.status
                console.log(response.status)
                if(status === 200){
                    console.log('in here')
                    // console.log(guide)
                for(var j = 0; j < guide.availabledates.length;j++){
                    for(var k = 0; k<dates.length;k++){
                        if(guide.availabledates[j].date === dates[k]){
                            guide.availabledates[j].plantype = "booked"
                            guide.availabledates[j].totalbookings = 1
                var itemOne = {
                    users:{username:email,no_of_tourists:'5'},
                    date_n_time:{date:dates[k]},
                    type:'solo',
                    place:guide.city,
                    tot_no_of_tourits:5,
                    current:true,
                    plan:'daylong'};
                    guide.booking.push(itemOne)
                    await guide.save()
                    }
                }
                }
                var smtpTransport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // use SSL
                    auth: {
                        user: 'koushiks666@gmail.com',
                        pass: 'Narayanaetechno@1'
                        }
                    });

                    var mailOptions = {
                        to: req.query.email,
                        from: 'koushiks666@gmail.com',
                        subject: 'Conformation',
                        text: 'booking confirmed'
                    };
                    smtpTransport.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          var text="name:".concat(guide.phone_number)
                          console.log('Email sent: ' + info.response);
                        }
                      });
                    console.log('hey there!')
                }
                }).catch(function (error){
                console.log(error)
            });
            console.log(status)
                }
        res.status(200).send("Worked")
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.get('/plans',async (req,res) => {
    try{
        if(req.query.api){
            let api_key = req.query.api
            let result = await Api.checkAPI(api_key)
            console.log(result)
            if(result.result === true && result.isexpired === false){
                if(req.query.city){
                    let place = req.query.city
                    const tps = await TP.find({ city:place })
                    return res.status(200).send(tps)
                }
                const tps = await TP.find({})
                return res.status(200).send(tps)
            }
            else{
                throw "Please check your api and it's expiry date"
            }

        }
    }catch(e){
        res.status(400).send([{
            error:e,
        }])
    }
})

router.post('/tour/book', async(req,res) =>{
    try{
        //Booking......
        console.log('Booking is done here')
        res.status(200).send("Worked")
    }
    catch(e){
        res.status(500).send(e)
    }
})

// router.get('/guides_place',async (req,res) => {
//     try{
//     let place = req.query.city
//     let api_key = req.query.api
//     let result = await Api.checkAPI(api_key)
//     console.log(result.result)
//     if(result.result === false){
//         throw "Please check your api and it's expiry date"
//     }
//     if(result.result === true && result.isexpired === false){
//         const guides = await Guide.find({ city:place })
//         res.status(200).send(guides)
//     }
//     else{
//         throw "Please check your api and it's expiry date"
//     }
//     }catch(e){
//         res.status(400).send([{
//             error : e
//         }])
//     }
// })

module.exports = router
