const express = require("express");
const { getEmail1, getEmail2, setEmail2 } = require("../GlobalVariables/chatEmails");
const chatModel = require("../Models/chatModel");
const router = express.Router();

module.exports = (io) => {
    router.get("/", async (req, res) => {
        const emailParam = req.query.email;
        const se = getEmail1();
        const re = emailParam || getEmail2();
        setEmail2(re);

        try {
            const results1 = await chatModel.find({ sender_email: se, receiver_email: re });
            const results2 = await chatModel.find({ sender_email: re, receiver_email: se });

            const messages = [...results1, ...results2].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );

            res.render("singlechat", { messages, eemail: se, reemail: re });
        } catch (error) {
            console.error("Error fetching messages: ", error);
            res.status(500).send("Internal Server Error");
        }
    });

    router.post("/", async (req, res) => {
        const emailParam = req.query.email;
        const se = getEmail1();
        const re = emailParam || getEmail2();
        const message = req.body.message;

        try {
            const newMessage = await chatModel.create({
                sender_email: se,
                receiver_email: re,
                message: message,
                createdAt: new Date()
            });

            // Emit message to the receiver
            io.to(re).emit('chat message', {
                sender: se,
                text: message,
                timestamp: newMessage.createdAt
            });

            res.redirect(`/singlechat?email=${re}`);
        } catch (error) {
            console.error("Error saving message: ", error);
            res.status(500).send("Internal Server Error");
        }
    });

    return router;
};
