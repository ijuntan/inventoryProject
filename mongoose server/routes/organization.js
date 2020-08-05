var express = require('express')
var router = express.Router()
var Organization = require('../models/organization')
var mongoose = require('mongoose')

router.get('/list', (req,res) => {
    if ( req.query.organizationId ){
        Organization.find({_id: req.query.organizationId}, (err,data)=>{
            if(!err){
                res.json({
                    status:'ok',
                    data:data
                })
            }
            else{
                res.json({status:'error'})
            }
        })
    }
    else
    {
        Organization.find({}, (err,data)=>{
            if(!err){
                res.json({
                    status:'ok',
                    data:data
                })
            }
            else{
                res.json({status:'error'})
            }
        })
    }
})

router.post('/add', (req,res) => {
    if (req.body.name && req.body.address && req.body){
        var new_organization =  new Organization({
            name: req.body.name,
            address: req.body.address,
            description: req.body.description
        })

        new_organization.save((err)=>{
            if(!err){
                res.json({ status: 'ok' })
            }
            else{
                console.log({err:true, message: err.errmsg})
            }
        })
    }
    else{
        console.log({err:true, message: 'Missing name and address'})
    }
    
})

router.delete('/delete', (req,res) => {
    if (req.body.organizationId){
        Organization.deleteOne({_id: req.body.organizationId}, (err)=>{
            if(!err){
                res.json({ status: 'organization deleted!' })
            }
            else{
                console.log({err:true, message: err.errmsg})
            }
        })
    }
    else{
        console.log({err:true, message: 'No organization found!'})
    }
    
})

router.put('/update', (req,res) => {
    if(req.body.organizationId){
        Organization.updateOne({_id:req.body.organizationId},req.body,(err)=>{
            if(!err) {
                console.log("updated") 
            }
            else {
                console.log({err:true,message:err.errmsg})
            }
        })
    }
    else{
        console.log({err:true, message: 'No organization found!'})
    }
    
})


module.exports = router