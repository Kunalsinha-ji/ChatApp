const express = require("express");
const { getEmail } = require("../GlobalVariables/Email");
const router = express.Router();
const chatModel = require("../Models/chatModel");

module.exports = () => {
    router.get("/", async (req, res) => {
        const user_email = getEmail();

        const receiverEmails = await chatModel.distinct('receiver_email', { sender_email: user_email });

        res.render("chats", { receiverEmails });
    });

    return router;
};
