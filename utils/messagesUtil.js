const mongoClient = require("mongodb").MongoClient;
const dbConfig = require("./../dbConfig");

//db configuration
const dbUrl = dbConfig.Connection.dbUrl;
const dbName = dbConfig.Connection.dbName;
const collectionName = "messages";

//add new message to database
function postMessage(message) {
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
                    coll.insertOne(message);
                }
            })
        }
    })
}

//get all messages of the specified room
function getAllMessagesByRoom(roomName, callback) {
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
                            console.error("Error while fetching messages");
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

//get all the messages
function getAllMessages(callback) {
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
                    coll.find({}).toArray((err, res) => {
                        if (err) {
                            console.error("Error while fetching messages");
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

module.exports = { postMessage, getAllMessages, getAllMessagesByRoom };