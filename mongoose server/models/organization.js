var mongoose = require('mongoose')

var organizationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    description:{
        type:String
    }
})

const Organization = mongoose.model('organization',organizationSchema)
module.exports = Organization