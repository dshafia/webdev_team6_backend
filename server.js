const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const artsthopRoutes = express.Router();
const PORT = 4000;

let Products = require('./Model/product.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/artsthop', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

artsthopRoutes.route('/').get(function (req, res) {
    Products.find(function (err, products) {
        if (err) {
            console.log(err);
        } else {
            console.log(products);
            res.json(products);
        }
    });
});

artsthopRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Products.findById(id, function(err, product) {
        console.log(product);
        res.json(product);
    });
});

artsthopRoutes.route('/add').post(function (req, res) {
    let products = new Products(req.body);

    products.save()
        .then(product => {
            console.log(product);
            res.status(200).json({ 'product': 'product added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new product failed');
        });
});

app.use('/artsthop', artsthopRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});