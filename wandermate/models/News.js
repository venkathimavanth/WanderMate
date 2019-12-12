const mongoose = require('mongoose');


const newsSchema = mongoose.Schema({

<<<<<<< HEAD
  guide:{type:String},
  place:{type:String},
=======
  guide:{type:String,lowercase:true,},
>>>>>>> b159eb215a9db752811a808049f45a8f45b73ba4
  img:{type:String},
  guideimg:{type:String},
  title:{type:String},
  news:{type:String},
  upvotes:{type:Array,default:void 0},
  time:{type:Date,default:Date.now},
  place:{type:String},
  array_length:{type:Number,default:0}
})
const News = mongoose.model('News',newsSchema)
module.exports=News;
