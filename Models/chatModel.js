const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender_email : {type : String,minlength : 3,required : true},
    receiver_email : {type : String,minlength : 3,required : true},
    message : {type : String,required : true},
},{
    timestamps : true
});

const chatModel = mongoose.model('chat',chatSchema);

module.exports = chatModel;