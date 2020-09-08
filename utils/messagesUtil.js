// const mongoClient = require("mongodb").MongoClient;

var messagesList = [];

//add new message to database
function postMessage(message){
    messagesList.push(message);
}

//get all messages of the specified room
function getAllMessagesByRoom(roomName){
    return messagesList.filter(message => message.roomName == roomName);
}

//get all the messages
function getAllMessages(){
    return messagesList;
}

module.exports = {postMessage, getAllMessages, getAllMessagesByRoom};