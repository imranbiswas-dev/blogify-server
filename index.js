const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@learning-db.ch9k7k3.mongodb.net/blogify?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

let blogCollection;
let userCollection;
let bookmarkCollection;

// ===== DB CONNECT FIRST =====
async function connectDB() {
  await client.connect();

  const db = client.db("blogify");

  blogCollection = db.collection("blogs");
  userCollection = db.collection("users");
  bookmarkCollection = db.collection("bookmarks");

  console.log("MongoDB Connected");
}

// ===== ROUTES =====

app.get("/", (req, res) => {
  res.send("Blogify Server Running 🚀");
});

app.get("/test", (req, res) => {
  res.send("API WORKING");
});

app.get("/blogs", async (req, res) => {
  const result = await blogCollection.find().toArray();
  res.send(result);
});

app.post("/blogs", async (req, res) => {
  const result = await blogCollection.insertOne(req.body);
  res.send(result);
});

// ===== START SERVER AFTER DB =====
async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log("Server running on port", port);
    });
  } catch (error) {
    console.log("Startup Error:", error);
  }
}

startServer();