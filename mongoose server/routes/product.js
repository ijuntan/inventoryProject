var express = require('express')
var router = express.Router()
var Product = require('../models/product')
var Category = require('../models/category')
var Organization = require('../models/organization')
var async = require('async')
var mongoose = require('mongoose')

router.get('/list', (req,res) => {
    const options = {}
    if ( req.query.productId ){
        options._id=req.query.productId
    }
    Product.find(options)
    .populate([
        {
            path:'category',
            select:'name -_id',
            model:'category'
        },
        {
            path:'organization',
            select:'name -_id',
            model:'organization'
        }
    ])
    .exec((err,data)=>{
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
})

router.post('/add', (req,res) => {
    if (req.body && req.body.name && req.body.category && req.body.organization ){
        async.waterfall([
            function(checkOrganizationCallback){
                Organization.findOne({name:req.body.organization},(err,org)=>{
                    if(!err && org) checkOrganizationCallback(null,org._id);
                    else checkOrganizationCallback("Organization missing");
                })
            },

            function(organizationId, checkCategoryCallback){
                Category.findOne({name:req.body.category,organization:organizationId},(err,category)=>{
                    if(!err && category) checkCategoryCallback(null,organizationId,category._id);
                    else checkCategoryCallback("Category missing");
                })
            },

            function(organization,category,addProductCallback){
                var new_product =  new Product({
                    name:req.body.name,
                    amount:req.body.amount && !isNaN(req.body.amount)? Number(req.body.amount):0,
                    costPrice: req.body.costPrice && !isNaN(req.body.costPrice)? Number(req.body.costPrice):0,
                    salePrice: req.body.salePrice && !isNaN(req.body.salePrice)? Number(req.body.salePrice):0,
                    produced:req.body.produced,
                    description:req.body.description,
                    organization,
                    category
                })
        
                new_product.save((err)=>{
                    if(!err){
                        addProductCallback(null)
                    }
                    else{
                       addProductCallback(err.errmsg)
                    }
                })
            }
        ],(err)=>{
            if(!err){
                res.json({ status: 'ok!' })
            }
            else{
                res.json({err:true, message: err})
            }
        })
    }
    else{
        console.log({err:true, message: 'Missing product'})
    }
})

router.delete('/delete', (req,res) => {
    if (req.body.productId){
        Product.deleteOne({_id: req.body.productId}, (err)=>{
            if(!err){
                res.json({ status: 'product deleted!' })
            }
            else{
                console.log({err:true, message: err.errmsg})
            }
        })
    }
    else{
        console.log({err:true, message: 'No product found!'})
    }
})

router.put('/update', (req,res) => {
    if(req.body.productId && req.body.organization && req.body){
        let update = {}
        if(req.body.name) update.name=req.body.name;
        if(req.body.description) update.description=req.body.description;
        if(req.body.amount && !isNaN(req.body.amount)) update.amount=req.body.amount;
        if(req.body.costPrice && !isNaN(req.body.costPrice)) update.costPrice=req.body.costPrice;
        if(req.body.salePrice && !isNaN(req.body.salePrice)) update.salePrice=req.body.salePrice;
        if(req.body.produced) update.produced=req.body.produced;

        async.waterfall([
            function(checkOrganizationCallback){
                Organization.findOne({name:req.body.organization},(err,org)=>{
                    if(!err && org) checkOrganizationCallback(null,org._id);
                    else checkOrganizationCallback("Organization missing");
                })
            },

            function(organizationId, checkCategoryCallback){
                Category.findOne({name:req.body.category,organization:organizationId},(err,category)=>{
                    if(!err && category) update.category=category._id;
                    else checkCategoryCallback("Category missing");
                })
            },

            function(updateProductCallback){
                Product.findOneAndUpdate({_id:req.body.productId}, update, (err)=>{
                    if(!err){
                        updateProductCallback(null)
                    }
                    else{
                       updateProductCallback(err.errmsg)
                    }
                })
            }
        ],(err)=>{
            if(!err){
                res.json({ status: 'ok!' })
            }
            else{
                res.json({err:true, message: err})
            }
        })
       
    }
    else{
        console.log({err:true, message: 'No product found!'})
    }
    
})


module.exports = router