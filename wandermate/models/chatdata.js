const mongoose = require('mongoose');

let chatdataschema = mongoose.Schema({
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

let chatdata = mongoose.model('chatdata', chatdataschema,'chatdata');
module.export = chatdata
