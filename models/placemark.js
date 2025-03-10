const mongoose = require('mongoose');

// Type Schema (stores different placemark types)
const typeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const Type = mongoose.model('Type', typeSchema);

// Category Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const Category = mongoose.model('Category', categorySchema);

// Placemark Schema
const placemarkSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true }, // Reference to Type
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Reference to Categories
    description: { type: String },
    location: {
        type: {
            type: String,
            enum: ['Point'], // Enforce GeoJSON "Point"
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // Array: [longitude, latitude]
            required: true
        }
    }
}, { timestamps: true });

const Placemark = mongoose.model('Placemark', placemarkSchema);

// Add GeoJSON index for location
placemarkSchema.index({ location: '2dsphere' });

module.exports = { Placemark, Type, Category };
