const{ Schema, model } = require('mongoose')

const Report = new Schema({
    s:{
        type: String,
        required: true
    },
    r:{
        type: String
       
    },
  
    y:{
        type:  String
       
    },  
    
    i :{
        type:  String
       
    },  

})
module.exports = model('Report' , Report)