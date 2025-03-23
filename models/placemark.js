import mongoose from "mongoose";

// Type Schema (stores different placemark types)
const typeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true, lowercase: true }
    },
    { timestamps: true }
);

const PoiType = mongoose.model("PoiType", typeSchema);

// Category Schema
const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true, lowercase: true }
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

// Placemark Schema
const placemarkSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, lowercase: true },
        poitype: { type: mongoose.Schema.Types.ObjectId, ref: "PoiType", required: true }, // Reference to PoiType
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // Reference to Categories
        description: { type: String },
        location: {
            type: {
                type: String,
                enum: ["Point"], // Enforce GeoJSON "Point"
                required: true,
                default: "Point"
            },
            coordinates: {
                type: [Number], // Array: [longitude, latitude]
                required: true
            }
        },
        imageUrl: { type: String }
    },
    { timestamps: true }
);

const Placemark = mongoose.model("Placemark", placemarkSchema);

// Add GeoJSON index for location
placemarkSchema.index({ location: "2dsphere" });

export { Placemark, PoiType, Category };
