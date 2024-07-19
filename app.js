const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const { setEmail1 } = require("./GlobalVariables/chatEmails");
const Email = require("./GlobalVariables/Email");
const mongoose = require('mongoose');
const userModel = require("./Models/userModel");
const chatModel = require("./Models/chatModel");
require("dotenv").config();
// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: true }));

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

app.get("/", (req, res) => {
    res.render("./Auth/login");
});

app.post("/", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.redirect("/?message=invalid_credentials");
    }

    try {
        const result = await userModel.findOne({email : email});
        
        if (result) {
            const hashedPassword = result.password;
            const match = await bcrypt.compare(password, hashedPassword);
    
            if (match) {
                Email.setEmail(email);
                setEmail1(email);
                res.redirect("/home");
            } else {
                res.redirect("/?message=invalid_credentials");
            }
        } else {
            res.redirect("/?message=invalid_credentials");
        }
    } catch (error) {
        console.error('Error executing query or comparing password:', error);
        res.redirect("/?message=invalid_credentials");
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (email) => {
        socket.join(email);
        console.log(`${email} joined the chat`);
    });

    socket.on('chat message', async (msg) => {
        const { sender, receiver, text } = msg;

        await chatModel.create({ sender_email: sender, receiver_email: receiver, message: text });


        io.to(receiver).emit('chat message', {
            sender,
            text,
            timestamp: new Date()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const homeRouter = require("./routes/home");
const signupRouter = require("./routes/signup");
const chatRouter = require("./routes/chats");
const singlechatRouter = require("./routes/singlechat");
const logoutRouter = require("./routes/logout");

app.use("/signup", signupRouter());
app.use("/home", homeRouter());
app.use("/chats", chatRouter());
app.use("/singlechat", singlechatRouter(io));
app.use("/logout", logoutRouter);

const port = process.env.PORT;

server.listen(port, () => {
    console.log(`Server active at port: ${port}`);
});
