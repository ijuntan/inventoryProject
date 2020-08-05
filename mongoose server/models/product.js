var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    category: {
        type: Schema.ObjectId,
        require:true
    },
    amount:{
        type:Number,
        required:true,
    },
    produced:{
        type:String,
        required:true,
    },
    costPrice:{
        type:Number,
        required:true
    },
    salePrice:{
        type:Number,
        required:true
    },
    organization:{
        type: Schema.ObjectId,
        require:true
    },
    description:{
        type:String
    }
})

const Product = mongoose.model('product',productSchema)
module.exports = Product