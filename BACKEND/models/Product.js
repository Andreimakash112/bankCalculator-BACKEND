const{ Schema, model } = require('mongoose')

const Product = new Schema({
    condition:{
        type: String,
        required: true
    },
    ratio:{
        type:String,
       
    },
  
    nameInfo:{
        type: String,
       
    } ,  
    nameCalc:{
        type: String,
       
    } 
  

})
module.exports = model('Product' , Product)