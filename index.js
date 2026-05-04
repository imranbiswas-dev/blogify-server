const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// === MongoDB URI (FIXED) ===
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@learning-db.ch9k7k3.mongodb.net/blogify?retryWrites=true&w=majority`;

// Mongo Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // === CONNECT MONGODB === \\
    await client.connect();

    const db = client.db("blogify");
    const blogCollection = db.collection("blogs");
    const userCollection = db.collection("users");
    const bookmarkCollection = db.collection("bookmarks");

    console.log("MongoDB Connected Successfully");

    // === BLOG APIs === \\

    app.get("/blogs", async (req, res) => {
      try {
        const result = await blogCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.get("/blogs/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await blogCollection.findOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.post("/blogs", async (req, res) => {
      try {
        const result = await blogCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.put("/blogs/:id", async (req, res) => {
      try {
        const result = await blogCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body },
          { upsert: true },
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.delete("/blogs/:id", async (req, res) => {
      try {
        const result = await blogCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // === USER APIs ===

    app.post("/users", async (req, res) => {
      try {
        const result = await userCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // === BOOKMARK APIs === \\

    app.get("/bookmarks", async (req, res) => {
      try {
        const email = req.query.userEmail;
        if (!email) return res.send([]);

        const result = await bookmarkCollection
          .find({ userEmail: email })
          .toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.post("/bookmarks", async (req, res) => {
      try {
        const result = await bookmarkCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.delete("/bookmarks/:id", async (req, res) => {
      try {
        const result = await bookmarkCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.get("/test", (req, res) => {
      res.send("API WORKING");
    });

    // === Ping test === \\
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Ping Successful");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
}

run().catch(console.dir);

// === ROOT ROUTE === \\

app.get("/", (req, res) => {
  res.send("Blogify Server is Running ");
});

// === START SERVER === \\

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
