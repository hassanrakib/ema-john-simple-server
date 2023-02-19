const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
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
            const currentPageIndex = req.query.page;
            const productsPerPage = req.query.size;
            console.log(currentPageIndex, productsPerPage);
            const query = {};
            const cursor = products.find(query);
            const result = await cursor.toArray();
            const count = await products.estimatedDocumentCount();
            res.send({count, result});
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("test");
});

app.listen(port, () => {
  console.log(`Server running in ${port} port`);
});
