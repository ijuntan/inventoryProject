var express = require('express')
var router = express.Router()
var Category = require('../models/category')
var Organization = require('../models/organization')
var async = require('async')
var mongoose = require('mongoose')
const { ensureIndexes } = require('../models/category')

router.get('/list', async (req,res) => {
    if(req.query.organization){
        let orgId;
        await Organization.findOne({name:req.query.organization},(err,org)=>{
            orgId=org._id
        })
        
        let category = await Category.find({organization:orgId}).lean();
        
        if(category){
            let hashMap = {};
            for(let i=0; i<category.length;i++){
                hashMap[category[i]._id] = category[i];
            }

            for(let i=0; i<category.length;i++){
                category[i].children=[]
                for(let j=0;j<category.length;j++){

                    console.log('id:',category[i]._id)
                    console.log('parent:',category[j].parent)
                    if(category[j].parent){
                        if(category[i]._id.toString()==category[j].parent.toString()){
                            console.log('correct')
                            category[i].children.push(hashMap[category[j]._id])
                        }
                    }
                }
            }

            for(let i=0; i<category.length;i++){
                let parent = category[i].parent;
                if(parent){
                    category[i].parent = hashMap[parent]
                }
            }
            
            res.json({err:false,data:category})
        }
        else{
            res.json({err:true,message:'missing parameters'})
        }
    }
})

router.post('/add', (req,res) => {
    if (req.body.organization && req.body.name && req.body){
        let organizationId= null;
        let parentId = null;

        async.waterfall([
            function(checkOrganizationCallback){
                Organization.findOne({name:req.body.organization},(err,org)=>{
                    if(!err && org) {
                        organizationId = org._id;
                        checkOrganizationCallback(null);
                    }
                    else checkOrganizationCallback("Organization missing");
                })
            },

            function(checkParentCategoryCallback){
                if(req.body.parentId || req.body.parentName){
                    let parentQuery = {}

                    if(req.body.parentId) parentQuery._id = req.body.parentId
                    else if(req.body.parentName) parentQuery.name = req.body.parentName
                    parentQuery.organization = organizationId

                    Category.findOne(parentQuery,(err,cat)=>{
                        if(!err && cat) {
                            parentId = cat._id;
                            checkParentCategoryCallback();
                        }
                        else checkParentCategoryCallback("Invalid parent id");
                    })
                }
                else checkParentCategoryCallback();
            },

            function(checkDuplicateCategoryCallback){
                Category.findOne({name:req.body.name,organization:organizationId},(err,data)=>{
                    if(!err && data) checkDuplicateCategoryCallback("Duplicate category");
                    else checkDuplicateCategoryCallback();
                })
            },

            function(addCategoryCallback){
                var new_category =  new Category({
                    name:req.body.name,
                    organization:organizationId
                })
                
                if(req.body.parentId||req.body.parentName){
                    new_category.parent = parentId
                }

                new_category.save((err)=>{
                    if(!err){
                        addCategoryCallback(null)
                    }
                    else{
                        addCategoryCallback(err)
                    }
                })
            }
        ],(err)=>{
            if(!err) res.json({status:'ok'})
            else res.json({err:true, message: err})
        })
    }
    else{
        console.log({err:true, message: 'Missing name or organization'})
    }
    
})

router.delete('/delete', (req,res) => {
    if (req.body.categoryId){
        Category.deleteOne({_id: req.body.categoryId}, (err)=>{
            if(!err){
                res.json({ status: 'category deleted!' })
            }
            else{
                console.log({err:true, message: err.errmsg})
            }
        })
    }
    else{
        console.log({err:true, message: 'No category found!'})
    }
})

router.put('/update', (req,res) => {
    if(req.body.categoryId){
        Category.updateOne({_id:req.body.categoryId},req.body,(err)=>{
            if(!err) {
                res.json({status:"updated"}) 
            }
            else {
                console.log({err:true,message:err.errmsg})
            }
        })
        Category.findOne({_id:req.body.organizationId}).populate({path:"parent",model:Category});
    }
    else{
        console.log({err:true, message: 'No category found!'})
    }
})

module.exports = router