//imports
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");
const queryString = require("querystring");
var usersUtil = require("./utils/usersUtil");
var messagesUtil = require("./utils/messagesUtil");
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
        let obj = { id: socket.id, roomName, username, message: "joined the room" };
        usersUtil.addNewUser(obj);
        socket.emit("welcomeUser", `Welcome to the room`);
        messagesUtil.postMessage(obj);
        let message = `${username} has joined the room`;
        socket.to(roomName).broadcast.emit("updateUserState", message);
        let usersList = usersUtil.getUsersByRoomName(roomName);
        io.to(roomName).emit("updateUsersList", usersList);
    })

    //when a user leaves a room
    socket.on("disconnect", () => {
        // console.log("User has left the room.");
        let user = usersUtil.getUserById(socket.id);
        if (user) {
            let message = `${user.username} has left the room.`;
            socket.to(user.roomName).broadcast.emit("updateUserState", message);
            let obj = { id: socket.id, roomName: user.roomName, username: user.username, message: "joined the room" };
            messagesUtil.postMessage(obj);
            usersUtil.deleteUser(socket.id);
            let usersList = usersUtil.getUsersByRoomName(user.roomName);
            io.to(user.roomName).emit("updateUsersList", usersList);
        }
    })

    //when a new message arrives
    socket.on("newMessage", (data) => {
        messagesUtil.postMessage(data);
        io.to(data.roomName).emit("broadcastMesage", data);
    })
})

//listen at port specified
server.listen(PORT, (err) => {
    if (!err)
        console.log(`listening to port ${PORT}`);
})