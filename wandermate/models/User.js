const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  guide:String,
  date_n_time:{'date':String,'slot':String,'time':String},
  type:String,
  place:String,
  tot_no_of_tourits:Number,
  current:Boolean,
  plan:String,
  days:Number
});

const UserSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  usertype:{
    type:String,
    default:'user'
  },


  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  phone_number:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  booking:[BookingSchema],

notifications:{type:[{senderid:{type:String},typeid:{type:String},username:{type:String},img:{type:String},unread:{type:Boolean,default:false}}],default:void 0},
  img:
    { path: String, contentType: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date

});

const User = mongoose.model('User',UserSchema);

module.exports=User;
