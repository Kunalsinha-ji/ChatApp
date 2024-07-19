const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname : {type : String,required : true},
    lastname : {type : String,required : true},
    email : {type : String,minlength : 3,required : true},
    password : {type : String,minlength : 3,required : true},
});

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;