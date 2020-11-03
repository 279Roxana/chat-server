const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const mongodb = require("mongodb");
const uri = process.env.MONGOLAB_URI;
const mongoOptions = { useUnifiedTopology: true };
const client = new mongodb.MongoClient(uri, mongoOptions);
app.use(cors());

app.use(bodyParser.json());


app.get("/messages", function (req, res) {
  client.connect(function () {
    const db = client.db("node-project");
    const collection = db.collection("chat-server");

    collection.find().toArray(function (error, messages) {
      res.send(error || messages);
      client.close()

    });


  });

})


app.post("/messages", function (req, res) {
  client.connect(function () {
    const db = client.db("node-project");
    const collection = db.collection("chat-server");
    const addMessage = req.body;
    addMessage.timeSent = new Date();
    !addMessage.from || !addMessage.text
      ? res.send(404)
      : collection.insertOne(addMessage, function (error, result) {
        res.send({ success: true });
        client.close()
      });
  });
})

app.get("/messages/search", function (req, res) {
  client.connect(function () {
    const db = client.db("node-project");
    let searchText = { text: req.query.text };
    const collection = db.collection("chat-server");

    collection.findOne(searchText, function (error, messages) {
      res.send(error || messages);

    });
  });
})
app.get("/messages/latest", function (req, res) {
  client.connect(function () {
    const db = client.db("node-project");
    const collection = db.collection("chat-server");
    collection.find().toArray(function (error, messages) {
      res.send(error || messages.slice(-10));

    });
  });
})
app.get("/messages/:id", function (req, res) {
  client.connect(function () {
    const db = client.db("node-project");
    let messageId = { _id: mongodb.ObjectId(req.params.id) };
    const collection = db.collection("chat-server");

    collection.findOne(messageId, function (error, messages) {
      res.send(error || messages);
    });

  });
})
app.put("/messages/:id", function (req, res) {
  client.connect(function () {
    const db = client.db("node-project");
    let messageId = { _id: mongodb.ObjectId(req.params.id) };
    const collection = db.collection("chat-server");

    collection.findOneAndUpdate(messageId, function (error, messages) {
      res.send(error || messages);
    });

  });
})

app.delete("/messages/:id", function (req, res) {
  client.connect(function () {
    const db = client.db("node-project");
    let messageId = { _id: req.params.id };
    const collection = db.collection("chat-server");

    collection.findOne(messageId, function (error, messages) {
      res.send(error || messages);
    });

  });
})

let port = process.env.PORT;

app.listen(port || 5000);
