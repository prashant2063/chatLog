const mongoClient = require("mongodb").MongoClient;

var usersList = [];

//add new user to database
function addNewUser(user) {
    // mongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, (err, dbHost) => {
    //     if (err) {
    //         console.error("Error connecting to the server");
    //     }
    //     else {
    //         var db = dbHost.db("slDb");
    //         db.collection("users", (err, coll) => {
    //             if (err) {
    //                 console.error("Error connecting to the collection");
    //             }
    //             else {
    //                 coll.insertOne(user);
    //             }
    //         })
    //     }
    // })
    usersList.push(user);
}

//delete a user from database
function deleteUser(id){
    let pos = usersList.findIndex(user => user.id == id);
    if(pos<0){
        console.error("User not found");
    }
    else{
        usersList.splice(pos,1);
    }
}

//fetch all users
function getAllUsers(){
    // mongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, (err, dbHost) => {
    //     if (err) {
    //         console.error("Error connecting to the server");
    //     }
    //     else {
    //         var db = dbHost.db("slDb");
    //         db.collection("users", (err, coll) => {
    //             if (err) {
    //                 console.error("Error connecting to the collection");
    //             }
    //             else {
    //                 coll.findAll({},(err,result)=>{
    //                     if (err)
    //                         console.error("User not found");
    //                     else{
    //                         console.log(result);
    //                         // return result;
    //                     }
    //                 });
    //             }
    //         })
    //     }
    // })
    return usersList;
}

//fetch user details using socket_id
function getUserById(id){
    // mongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, (err, dbHost) => {
    //     if (err) {
    //         console.error("Error connecting to the server");
    //     }
    //     else {
    //         var db = dbHost.db("slDb");
    //         db.collection("users", (err, coll) => {
    //             if (err) {
    //                 console.error("Error connecting to the collection");
    //             }
    //             else {
    //                 coll.findOne({id},(err,result)=>{
    //                     if (err)
    //                         console.error("User not found");
    //                     else
    //                         console.log(result);
    //                 });
    //             }
    //         })
    //     }
    // })
    let pos = usersList.findIndex(user => user.id == id);
    if(pos<0){
        console.error("User not found");
    }
    else{
        return usersList[pos];
    }
}

//fetch user details using roomName
function getUsersByRoomName(roomName){
    // mongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, (err, dbHost) => {
    //     if (err) {
    //         console.error("Error connecting to the server");
    //     }
    //     else {
    //         var db = dbHost.db("slDb");
    //         db.collection("users", (err, coll) => {
    //             if (err) {
    //                 console.error("Error connecting to the collection");
    //             }
    //             else {
    //                 coll.find({roomName},(err,result)=>{
    //                     if (err)
    //                         console.error("User not found");
    //                     else
    //                         console.log(result);
    //                 });
    //             }
    //         })
    //     }
    // })
    return usersList.filter(user => user.roomName == roomName);
}

module.exports = {addNewUser, deleteUser, getAllUsers, getUserById, getUsersByRoomName};
