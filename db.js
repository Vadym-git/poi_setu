import mongoose from "mongoose";

const myDockerMongo = "mongodb://vadym:123@localhost:27017/poi_db?authSource=admin";
const mongoAtlas = "mongodb+srv://vadym:VadiM23071990*@cluster0.tasmn.mongodb.net/poi_db?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
    try {
        await mongoose.connect(mongoAtlas, {
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
