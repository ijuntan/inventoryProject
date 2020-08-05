var mongoose = require('mongoose')
var Schema = mongoose.Schema

var categorySchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    parent: Schema.ObjectId, 
    organization: Schema.ObjectId, 
    
})

const Category = mongoose.model('category',categorySchema)
module.exports = Category