const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const Email = require("../GlobalVariables/Email");
const userModel = require("../Models/userModel");
const saltRounds = 10;


module.exports = () => {
    router.get("/", (req, res) => {
        res.render("./Auth/signup");
    });

    router.post("/", async (req, res) => {
        const fname = req.body.firstname;
        const lname = req.body.lastname;
        const email = req.body.email;
        const password = req.body.password;

        try {
            const result = await userModel.findOne({email : email});

            if (result) {
                res.redirect("/?message=email-registered");
                return;
            }
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const ress = await userModel.create({firstname : fname,lastname : lname,email : email,password : hashedPassword});

            if (ress) {
                res.redirect("/?message=signup-success");
            } else {
                res.redirect("/?message=signup-failed");
            }            
        } catch (error) {
            console.error('Database error:', error);
            res.redirect("/?message=error");
        }
    });

    return router;
} 