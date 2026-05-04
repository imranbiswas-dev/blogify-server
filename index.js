const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Mongo URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@learning-db.ch9k7k3.mongodb.net/blogify?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

let blogCollection;
let userCollection;
let bookmarkCollection;

// ===== CONNECT DB =====
async function connectDB() {
  await client.connect();

  const db = client.db("blogify");

  blogCollection = db.collection("blogs");
  userCollection = db.collection("users");
  bookmarkCollection = db.collection("bookmarks");

  console.log("MongoDB Connected");
}

// ===== ROUTES =====

// ROOT
app.get("/", (req, res) => {
  res.send("Blogify Server Running 🚀");
});

// TEST
app.get("/test", (req, res) => {
  res.send("API WORKING");
});

// ===== BLOG =====
app.get("/blogs", async (req, res) => {
  const result = await blogCollection.find().toArray();
  res.send(result);
});

app.post("/blogs", async (req, res) => {
  const result = await blogCollection.insertOne(req.body);
  res.send(result);
});

app.get("/blogs/:id", async (req, res) => {
  const result = await blogCollection.findOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(result);
});

app.put("/blogs/:id", async (req, res) => {
  const result = await blogCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body },
    { upsert: true }
  );
  res.send(result);
});

app.delete("/blogs/:id", async (req, res) => {
  const result = await blogCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(result);
});

// ===== USER =====
app.post("/users", async (req, res) => {
  const result = await userCollection.insertOne(req.body);
  res.send(result);
});

// ===== BOOKMARK =====
app.get("/bookmarks", async (req, res) => {
  const email = req.query.userEmail;
  if (!email) return res.send([]);

  const result = await bookmarkCollection.find({ userEmail: email }).toArray();
  res.send(result);
});

app.post("/bookmarks", async (req, res) => {
  const result = await bookmarkCollection.insertOne(req.body);
  res.send(result);
});

app.delete("/bookmarks/:id", async (req, res) => {
  const result = await bookmarkCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(result);
});

// ===== START =====
async function startServer() {
  await connectDB();

  app.listen(port, () => {
    console.log("Server running on port", port);
  });
}

startServer();