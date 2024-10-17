const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {l
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
