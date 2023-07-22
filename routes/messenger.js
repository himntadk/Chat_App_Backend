const express= require('express');
const routes = express.Router();
const multer = require('multer');
const path = require('path');

const UserModel = require('../models/userModel');
//const uploadPath = path.join('public',"uploads/coverImage");
const AcceptedMimetyptes = ['image/jpeg','image/png','image/gif'];

// const upload = multer({
//     dest : uploadPath,
//     fileFilter : (req,file,cb)=>{
//         cb(null,AcceptedMimetyptes.includes(file.mimetype))
//     }
// })

var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"./uploadFile");
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
})

var upload = multer({storage : storage});

routes.get('/',async(req,res)=>{
    res.render('index');
})

routes.post('/users',async(req,res)=>{
    const is_user_available = await UserModel.findOne({name : req.body.uname});
    if(!is_user_available){
        const reg_user = new UserModel({
            name : req.body.uname
        })
        const response = await reg_user.save();
    }
    const data = await UserModel.find({});
    const sender = req.body.uname;
    res.render('users/usernames',{
        data : data,
        sender : sender
    });
})

routes.get('/message',async(req,res)=>{
    const sender= req.query.sender;
    const receiver= req.query.receiver;
    // console.log(sender);
    // console.log(receiver);
    const data = await UserModel.findOne({name : sender})
    //console.log(data.message)
    res.render('users/message',{
        data : data,
        sender : sender,
        receiver : receiver
    });
})

routes.post('/sendmessage',upload.single("image"),async(req,res)=>{
   const sender = req.body.sender;
   const receiver = req.body.receiver;
   let msg = req.body.msg;
   let fileName = req.file !=null ? req.file.filename : null;

   if((msg != null && msg !== '') || req.file != null){
   await UserModel.updateOne(
    {name : sender},
    {$push : {
        message : {
            sender : sender,
            receiver : receiver,
            msg : msg,
            image: fileName
        }
    }}
   ).catch((err)=>{
    console.log(err);
   })

   await UserModel.updateOne(
    {name : receiver},
    {$push : {
        message : {
            sender : sender,
            receiver : receiver,
            msg : msg,
            image : fileName
        }
    }}
   ).catch((err)=>{
    console.log(err);
   })
  }

   const data = await UserModel.findOne({name : sender});
   res.render('users/message',{
     data : data,
     sender : sender,
     receiver : receiver
   })
})

module.exports= routes