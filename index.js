const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// === MongoDB Connection ===

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@learning-db.ch9k7k3.mongodb.net/?appName=Learning-DB`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Database and Collection Setup
    const blogCollection = client.db("blogify").collection("blogs");
    const userCollection = client.db("blogify").collection("users");
    const bookmarkCollection = client.db("blogify").collection("bookmarks");

    // === Blog APIs ===
    app.get("/blogs", async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
    });

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });

    // === POST a new blog ===

    app.post("/blogs", async (req, res) => {
      const userBlog = req.body;
      const result = await blogCollection.insertOne(userBlog);
      res.send(result);
    });

    // === UPDATE a blog by ID ===

    app.put("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBlog = req.body;
      const updateDoc = {
        $set: updatedBlog,
      };
      const result = await blogCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // DELETE API
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.deleteOne(query);
      res.send(result);
    });

    // === User APIs ===
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // === Bookmark APIs ===
    app.get("/bookmarks", async (req, res) => {
      const email = req.query.userEmail;
      if (!email) return res.send([]);
      const query = { userEmail: email };
      const result = await bookmarkCollection.find(query).toArray();
      res.send(result);
    });

    // === POST ===
    app.post("/bookmarks", async (req, res) => {
      const bookmark = req.body;
      const result = await bookmarkCollection.insertOne(bookmark);
      res.send(result);
    });

    // === DELETE ===
    app.delete("/bookmarks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookmarkCollection.deleteOne(query);
      res.send(result);
    });

    // Ping check
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB, Sir!");
  } catch (error) {
    console.error("Connection error:", error);
  } finally {
    // keep connection open
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Blogify Server is Running, Sir!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
