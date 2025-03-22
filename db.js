import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://vadym:123@localhost:27017/poi_db?authSource=admin", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
};

export default connectDB;
