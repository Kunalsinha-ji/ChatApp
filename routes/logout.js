const express = require("express");
const { setEmail, getEmail } = require("../GlobalVariables/Email");
const { setEmail1, setEmail2 } = require("../GlobalVariables/chatEmails");
const router = express.Router();

router.get("/",(req,res)=>{
    if(getEmail()===""){
        return res.redirect("/?message=No_login_found");
    }
    setEmail("");
    setEmail1("");
    setEmail2("");
    res.redirect("/");
});

module.exports = router;
