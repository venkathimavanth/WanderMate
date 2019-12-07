const mongoose = require('mongoose');

const chatdataschema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  guidename:{
    type: String,
    required: true
  },
  messages:{type:[
    {
      text:{type:String},
      sentby:{type:String},
      time:{type:String}
    }
  ]}
})

const Chatdata = mongoose.model('Chatdata', chatdataschema,'chatdata');
module.exports = Chatdata;
