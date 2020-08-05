var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    secret: String,
    hash: {
        type:String,
        required:true,
    },
    firstName: String,
    lastName: String,
    email:{
        type:String,
        required:true,
        unique:true,
    },
    organization: {
        type:Schema.Types.ObjectId,
        ref:'organization'
    },
    permission:{
        type: Number,
        default:0
    }
})

const User = mongoose.model('user',userSchema)
module.exports = User