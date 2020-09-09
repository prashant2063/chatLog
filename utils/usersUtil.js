const mongoClient = require("mongodb").MongoClient;
const dbConfig = require("./../dbConfig");

//db configuration
const dbUrl = dbConfig.Connection.dbUrl;
const dbName = dbConfig.Connection.dbName;
const collectionName = "users";

//add new user to database
function addNewUser(user) {
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.error("Error connecting to the server");
        }
        else {
            var db = dbHost.db(dbName);
            db.collection(collectionName, (err, coll) => {
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
function deleteUser(id, callback) {
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.error("Error connecting to the server");
        }
        else {
            var db = dbHost.db(dbName);
            db.collection(collectionName, (err, coll) => {
                if (err) {
                    console.error("Error connecting to the collection");
                }
                else {
                    coll.findOneAndDelete({ id }, (err, res) => {
                        if (err) {
                            console.error("Error while deleting the user");
                        }
                        else {
                            callback(res.value);
                        }
                    })
                }
            })
        }
    })
}

//fetch user details using roomName
function getUsersByRoomName(roomName, callback) {
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.error("Error connecting to the server");
        }
        else {
            var db = dbHost.db(dbName);
            db.collection(collectionName, (err, coll) => {
                if (err) {
                    console.error("Error connecting to the collection");
                }
                else {
                    coll.find({ roomName }).toArray((err, res) => {
                        if (err) {
                            console.error("Error while fetching user list");
                        }
                        else {
                            callback(res);
                        }
                    });
                }
            })
        }
    })
}


//get user by id
function getUserById(id, callback){
    mongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.error("Error connecting to the server");
        }
        else {
            var db = dbHost.db(dbName);
            db.collection(collectionName, (err, coll) => {
                if (err) {
                    console.error("Error connecting to the collection");
                }
                else {
                    coll.findOne({ id },(err, res) => {
                        if (err) {
                            console.error("Error while fetching user");
                        }
                        else {
                            callback(res);
                        }
                    });
                }
            })
        }
    })
}

module.exports = { addNewUser, deleteUser, getUsersByRoomName, getUserById };
