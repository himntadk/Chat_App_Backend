const mongoose = require('mongoose');
const path = require('path');
const fs= require('fs');

const UserSchema = mongoose.Schema({
    name : {
        type: String,
        require: true
    },
    message : [{
        sender : String,
        receiver : String,
        msg : String,
        image : String
    }]
})


// UserSchema.virtual('smsImage').get(function(){
//     if(this.message[0].image != null){
//         return path.join('/',uploadFilePath,this.message[0].image)
//     }
//     else{
//         return path.join('/',uploadFilePath)
//     }
// })

module.exports = mongoose.model('user',UserSchema);
// module.exports.uploadFilePath= uploadFilePath;