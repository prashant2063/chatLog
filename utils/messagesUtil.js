const mongoClient = require("mongodb").MongoClient;
const dbConfig = require("./../dbConfig");
const usersUtil = require("./usersUtil");

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
function getAllMessagesByRoom(roomName, id, callback) {
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
                    usersUtil.getUserById(id,(user)=>{
                        let timeStamp = user.timeStamp;
                        coll.find({roomName: roomName, timeStamp: {$gte: timeStamp} },{'_id':0,'id':0}).toArray((err, res) => {
                            if (err) {
                                console.error("Error while fetching messages");
                            }
                            else {
                                callback(res);
                            }
                        });
                    });
                }
            })
        }
    })
}

module.exports = { postMessage, getAllMessagesByRoom };