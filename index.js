const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.girnwoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection("coffees");

    // create
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // read
    app.get("/coffee", async (req, res) => {
      const allCoffees = await coffeeCollection.find().toArray();
      res.send(allCoffees);
    });

    // delete 
    app.delete("/coffee/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // single request
    app.get("/coffee/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // update 
    app.put("/coffee/:id", async (req, res) => {
      const { id } = req.params;
      const updatedCoffee = req.body;
      const options = {upsert: true};
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.updateOne(query, { $set: updatedCoffee },options);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Coffee app listening on port ${port}`);
});
