const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster-1.yey930g.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
  try {
    // collections
    const products = client.db("emaJohn").collection("products");

    // get products
    app.get("/products", async (req, res) => {
      const currentPageIndex = parseInt(req.query.page);
      const productsPerPage = parseInt(req.query.size);
      const query = {};
      const cursor = products.find(query);
      const result = await cursor
        .skip(currentPageIndex * productsPerPage)
        .limit(productsPerPage)
        .toArray();
      const count = await products.estimatedDocumentCount();
      res.send({ count, result });
    });

    // get products by their _id property
    // post method is used to send ids from the front end
    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;
      const idsWithObjectId = ids.map(id => new ObjectId(id));
      const query = {_id: {$in : idsWithObjectId}};
      const cursor = products.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("test");
});

app.listen(port, () => {
  console.log(`Server running in ${port} port`);
});
