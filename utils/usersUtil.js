const mongoClient = require("mongodb").MongoClient;

// var usersList = [];
var dbUrl = "mongodb://localhost:27017";
var dbName = "dummyDb";


//add new user to database
function addNewUser(user) {
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.error("Error connecting to the server");
        }
        else {
            var db = dbHost.db(dbName);
            db.collection("users", (err, coll) => {
                if (err) {
                    console.error("Error connecting to the collection");
                }
                else {
                    coll.insertOne(user);
                }
            })
        }
    })
}

//delete a user from database
function deleteUser(id,callback){
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.error("Error connecting to the server");
        }
        else {
            var db = dbHost.db(dbName);
            db.collection("users", (err, coll) => {
                if (err) {
                    console.error("Error connecting to the collection");
                }
                else {
                    coll.findOneAndDelete({id},(err,res)=>{
                        if (err) {
                            console.error("Error while deleting the user");
                        }
                        else{
                            callback(res.value);
                        }
                    })
                }
            })
        }
    })
}

//fetch user details using roomName
function getUsersByRoomName(roomName, callback){
     mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.error("Error connecting to the server");
        }
        else {
            var db = dbHost.db(dbName);
            db.collection("users", (err, coll) => {
                if (err) {
                    console.error("Error connecting to the collection");
                }
                else {
                    coll.find({roomName}).toArray((err,res)=>{
                        if (err) {
                            console.error("Error while fetching user list");
                        }
                        else{
                            callback(res);
                        }
                    });
                }
            })
        }
    })
}

module.exports = {addNewUser, deleteUser, getUsersByRoomName};
