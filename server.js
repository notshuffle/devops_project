const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const port = 5050;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB connection string (update this to your host IP)
const mongoURL = "mongodb://172.31.80.1:27017";
const client = new MongoClient(mongoURL);

let usersCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db("demo-db");
    usersCollection = db.collection("users");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
connectToDatabase();

// POST route for form submission
app.post("/addUser", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    await usersCollection.insertOne({ username, email, password });
    console.log("✅ User inserted into MongoDB:", { username, email });
    res.status(200).send("User registered successfully!");
  } catch (error) {
    console.error("❌ Error inserting user:", error);
    res.status(500).send("Failed to register user");
  }
});
app.get("/", (req, res) => {
  res.send("🚀 Server is alive and responding!");
});
// Start the server on all interfaces for Docker access
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});