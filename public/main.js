//user and room data
const userObj = Qs.parse(location.search, { ignoreQueryPrefix: true });
const username = userObj.username;
const roomName = userObj.room;

var usersListElem = document.getElementById("usersList");
var messagesSectionElem = document.getElementById("messagesSection");
var inputMsg = document.getElementById("inputMsg");

//set roomName
document.getElementById("roomName").innerHTML = roomName;

//create socket
const socket = io();

//new user joins the room
socket.emit("joinRoom", { username, roomName, timeStamp: Date.now() });



//update list of active users
socket.on("updateUsersList", (usersList) => {
    // console.log(usersList);
    usersListElem.innerHTML = "";
    for (user of usersList) {
        let li = document.createElement("li");
        // console.log(user.username)
        let textNode = document.createTextNode(user.username);
        li.appendChild(textNode);
        usersListElem.appendChild(li);
    }
});

//welcome new user
socket.on("welcomeUser", (message) => {
    formatUserMessage(message);
})

//when a user joins or leaves a room
socket.on("updateUserState", (message) => {
    formatUserMessage(message);
});

//
socket.on("broadcastMesage",(message)=>{
    formatMessage(message);
});

function formatMessage(message) {
    let div = document.createElement("div");
    let small = document.createElement("small");
    let p = document.createElement("p");
    let name;
    let msg = document.createTextNode(message.message);
    if(message.username == username){
        div.classList.add('float-right');
        name = document.createTextNode("You");
    }
    else{
        name = document.createTextNode(message.username);
    }
    small.appendChild(name);
    p.appendChild(msg);
    div.appendChild(small);
    div.appendChild(p);
    small.classList.add('text-warning')
    div.classList.add('bg-dark','text-light','p-2','m-1','w-75','rounded');
    
    messagesSectionElem.appendChild(div);
    messagesSectionElem.innerHTML += `<div class="clearfix"></div>`;
}


function formatUserMessage(message) {
    let div = document.createElement("div");
    let small = document.createElement("small");
    let textNode = document.createTextNode(message);
    small.appendChild(textNode);
    div.appendChild(small);
    div.classList.add('text-center');
    messagesSectionElem.appendChild(div);
}

function sendMessageEventHandler() {
    let message = inputMsg.value;
    if (message == "")
        return;
    socket.emit("newMessage", { message, username, roomName, date: Date.now() });
    inputMsg.value = "";
}