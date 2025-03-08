const mongoose = require('mongoose');

const placemarkSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Placemark = mongoose.model('Placemark', placemarkSchema);

module.exports = Placemark;
