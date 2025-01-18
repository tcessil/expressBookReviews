const express = require('express');
const customer_routes = express.Router();

// Example route for customer
customer_routes.get('/', (req, res) => {
    res.send('Customer route');
});

module.exports.customer = customer_routes;