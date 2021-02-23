const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
// const admin = require("firebase-admin");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// var serviceAccount = require("./configs/ema-john-simple-authentication-firebase-adminsdk-itjvb-c6033c568c.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9mvne.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("emaJohnStore").collection("products");
    const orderCollection = client.db("emaJohnStore").collection("orders");
    // console.log('Db Product Collection');

    // app.post("/addProduct", (req, res) => {
    //     const products = req.body;
    //     // console.log(products);
    //     productCollection.insertMany(products)
    //     .then( result => {
    //         res.send(result.insertedCount > 0)
    //         console.log(result);
    //     })
    // })

    // Create or Add Product
    app.post("/addProduct", (req, res) => {
        const products = req.body;
        // console.log(products);
        productCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })



    // Read or View Product
    app.get('/products', (req, res) => {
        const search = req.query.search;
        console.log(search);
        productCollection.find({ name: { $regex: search } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // Single Product
    app.get('/product/:key', (req, res) => {
        console.log(req.params.key);
        productCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                console.log(documents[0])
                res.send(documents[0])
            })
    })

    // Product keys
    app.post('/productsKeys', (req, res) => {
        const products = req.body;
        productCollection.find({ key: { $in: products } })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // Add or Create Order

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // Read Order

    // app.get('/orders', (req, res) => {
    //     const bearer = req.body.authorization;
    //     if (bearer && bearer.startsWith('Bearer ')) {
    //         const idToken = bearer.split(' ')[1];

    //         admin.auth().verifyIdToken(idToken)
    //             .then((decodedToken) => {
    //                 // const uid = decodedToken.uid;
    //                 const queryEmail = req.query.email;
    //                 const tokenEmail = decodedToken.email;
    //                 if(queryEmail === tokenEmail) {
    //                     orderCollection.find({email : queryEmail})
    //                     .toArray( (err, documents) => {
    //                         res.send(documents)
    //                     })
    //                 }
    //                 // ...
    //             })
    //             .catch((error) => {
    //                 // Handle error
    //                 console.log(error);
    //             });
    //     }
    //     else{
    //         console.log('Error Occured');
    //     }
    // })
});


app.get('/', (req, res) => {
    res.send('Hello World !!!');
})

app.listen(process.env.PORT || port);