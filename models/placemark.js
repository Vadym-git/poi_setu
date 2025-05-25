import mongoose from "mongoose";

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
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // Reference to Categories
        title: { type: String },
        address: { type: String },
        openh: { type: String },
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
        images: [String],
		views: [
      {
        date: { type: Date, required: true },
        count: { type: Number, default: 1 },
      },
    ],
    },
    { timestamps: true }
);

const Placemark = mongoose.model("Placemark", placemarkSchema);

// Add GeoJSON index for location
placemarkSchema.index({ location: "2dsphere" });

export { Placemark, Category };
