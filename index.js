//imports
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");
const queryString = require("querystring");
var usersUtil = require("./utils/usersUtil");
var messagesUtil = require("./utils/messagesUtil");
const fs = require("fs");

//port
const PORT = 3000;

//define app
var app = express();
var server = http.createServer(app);
var io = socketio(server);

//use in app
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//entry point: login screen
app.get("/", (req, res) => {
    let fileUrl = path.join(__dirname, "public", "login.html");
    res.sendFile(fileUrl);
})

//login 
app.post("/login", (req, res) => {
    let data = req.body;
    let username = data.username;
    let room = data.room;
    let tmpObj = { username, room };
    let queryStr = queryString.stringify(tmpObj);
    res.redirect("/chat?" + queryStr);
})

//chat
app.get("/chat", (req, res) => {
    let fileUrl = path.join(__dirname, "public", "chat.html")
    res.sendFile(fileUrl);
})

//socket
io.on("connection", (socket) => {
    //when new user joins a room
    socket.on("joinRoom", (data) => {
        let roomName = data.roomName;
        let username = data.username;
        socket.join(roomName);
        let obj = { id: socket.id, roomName, username, message: "joined the room", timeStamp: data.timeStamp };
        usersUtil.addNewUser(obj);
        socket.emit("welcomeUser", `Welcome to the room`);
        messagesUtil.postMessage(obj);
        let message = `${username} has joined the room`;
        socket.to(roomName).broadcast.emit("updateUserState", message);
        usersUtil.getUsersByRoomName(roomName, (usersList) => {
            io.to(roomName).emit("updateUsersList", usersList);
        });
    })

    //when a user leaves a room
    socket.on("disconnect", () => {
        usersUtil.deleteUser(socket.id, (user) => {
            let obj = { id: socket.id, roomName: user.roomName, username: user.username, timeStamp:Date.now(), message: "left the room" };
            messagesUtil.postMessage(obj);
            let message = `${user.username} has left the room`;
            socket.to(user.roomName).broadcast.emit("updateUserState", message);
            usersUtil.getUsersByRoomName(user.roomName, (usersList) => {
                io.to(user.roomName).emit("updateUsersList", usersList);
            });
        })
    })

    //when a new message arrives
    socket.on("newMessage", (data) => {
        messagesUtil.postMessage(data);
        io.to(data.roomName).emit("broadcastMesage", data);
    })

    //download chat
    socket.on("getChatOfRoom", (roomName)=>{
        messagesUtil.getAllMessagesByRoom(roomName, socket.id, (messages)=>{
            for(message of messages){
                fs.writeFile('public/log_files/'+socket.id+".txt", JSON.stringify(messages),(err)=>{
                    if(err){
                        console.log("error downloading file");
                    }
                });
            }
            socket.emit("downloadFile", socket.id+".txt", (fileUrl)=>{
                fs.unlink('public/log_files/'+fileUrl,(err) => {
                    if (err) {
                      console.error(err)
                    }
                })
            });
        })
    })
})

//listen at port specified
server.listen(PORT, (err) => {
    if (!err)
        console.log(`Running on http://localhost:${PORT}/`);
})