const express = require("express");
const { getEmail } = require("../GlobalVariables/Email");
const { setEmail1, setEmail2 } = require("../GlobalVariables/chatEmails");
const router = express.Router();
const userModel = require("../Models/userModel");
const chatModel = require("../Models/chatModel");

module.exports = () => {
    router.get("/", (req, res) => {
        res.render("home", { senderMail: getEmail() });
    });

    router.post("/", async (req, res) => {
        const other_user = req.body.usernameoth;
        const email = getEmail();


        if (!email) {
            return res.redirect("/home?message=No_email_found");
        }

        const resultt = await userModel.findOne({ email: email });
        
        if (!resultt) {
            return res.redirect("/home?message=No_such_user_found");
        }

        if (other_user === email) {
            return res.redirect("/home?message=Cannot_chat_with_yourself");
        }

        const results = await chatModel.find({
            $or: [
                { sender_email: email, receiver_email: other_user },
                { sender_email: other_user, receiver_email: email }
            ]
        });

        setEmail1(email);
        setEmail2(other_user);

        try {
            if (results.length === 0) {
                // Create initial chat messages if no previous chat exists
                await chatModel.create({ sender_email: email, receiver_email: other_user, message: "HI" });
                await chatModel.create({ sender_email: other_user, receiver_email: email, message: "HI" });
            }
        } catch (error) {
            console.error('Error creating chat records:', error);
            return res.redirect("/home?message=Error_creating_chat_records");
        }

        res.redirect("/singlechat");
    });

    return router;
};
