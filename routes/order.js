'use strict';

module.exports = function(app) {
    
    // Home route
    var order = require('../controllers/order');
    app.get('/api/order', order.getOrders);
    app.put('/api/order', order.create);
    app.get('/api/order/:id', order.getOrderById);
    app.post('/api/order/:id', order.completeOrder);
};