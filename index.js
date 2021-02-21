const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9mvne.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("emaJohnStore").collection("products");
    const orderCollection = client.db("emaJohnStore").collection("orders");
    // console.log('Db Product Collection');

    // Create or Add Product
    app.post("/addProduct", (req, res) => {
        const products = req.body;
        // console.log(products);
        productCollection.insertOne(products)
        .then( result => {
            res.send(result.insertedCount > 0)
        })
    })

    // Read or View Product
    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents)
        })
    })

    // Single Product
    app.get('/product/:key', (req, res) => {
        console.log(req.params.key);
        productCollection.find({key : req.params.key})
        .toArray( (err, documents) => {
            console.log(documents[0])
            res.send(documents[0])
        })
    })

    // Product keys
    app.post('/productsKeys', (req, res) => {
        const products = req.body;
        productCollection.find({key : {$in : products}})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
        .then( result => {
            res.send(result.insertedCount > 0)
        })
    })
});


app.get('/', (req, res) => {
    res.send('Hello World !!!');
})

app.listen(process.env.PORT || port);