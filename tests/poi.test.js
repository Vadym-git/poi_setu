import { assert } from 'chai';
import mongoose from 'mongoose';
import { Category, PoiType, Placemark } from '../models/placemark.js';
import { suite, test, before, after } from 'mocha';
const { MongoMemoryServer } = await import('mongodb-memory-server');

suite("POI API tests", () => {

    let mongoServer;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    test("Creating and retrieving a Placemark", async () => {
        // Create and save the Category and PoiType first
        const testCategory = new Category({ name: "TestCategory" });
        const testPoiType = new PoiType({ name: "TestTypePOI" });
    
        const savedCategory = await testCategory.save();
        const savedPoiType = await testPoiType.save();
    
        // Now, create the Placemark and associate it with the saved Category and PoiType
        const testPlacemark = new Placemark({
            name: "TestPlacemark",
            categories: [savedCategory._id],
            description: "A description for the test placemark",
            poitype: savedPoiType._id,
            location: { type: 'Point', coordinates: [-0.1278, 51.5074] },  // Corrected location format (Longitude, Latitude)
        });
    
        const savedPlacemark = await testPlacemark.save();
    
        // Retrieve the Placemark and check if it correctly references the Category and PoiType
        const placemarkFromDB = await Placemark.findById(savedPlacemark._id)
            .populate('categories')  // Populate the category field
            .populate('poitype');     // Populate the POI type field
    
        // Check if the names match and relationships are correctly set
        assert.equal(placemarkFromDB.name, "testplacemark");
        assert.equal(placemarkFromDB.categories[0].name, "testcategory");
        assert.equal(placemarkFromDB.poitype.name, "testtypepoi");
    });
    

    test("Deleting a Placemark", async () => {
        const testCategory = new Category({ name: `TestCategory${Date.now()}` });  // Ensure unique name
        const testPoiType = new PoiType({ name: `TestTypePOI${Date.now()}` });     // Ensure unique name
    
        const savedCategory = await testCategory.save();
        const savedPoiType = await testPoiType.save();
    
        const testPlacemark = new Placemark({
            name: "TestPlacemarkToDelete",
            categories: [savedCategory._id],
            description: "A description for the test placemark",
            poitype: savedPoiType._id,
            location: { type: 'Point', coordinates: [-0.1278, 51.5074] },  // Corrected location format
        });
    
        const savedPlacemark = await testPlacemark.save();
        await Placemark.findByIdAndDelete(savedPlacemark._id);
    
        const placemarkFromDB = await Placemark.findById(savedPlacemark._id);
        assert.isNull(placemarkFromDB);
    });
    

    test("Unique validation for Category", async () => {
        const testCategory1 = new Category({ name: "UniqueCategory" });
        const testCategory2 = new Category({ name: "UniqueCategory" });

        await testCategory1.save();

        try {
            await testCategory2.save();
            assert.fail("Duplicate category should not be allowed");
        } catch (err) {
            assert.include(err.message, "duplicate key error collection");
        }
    });

    test("Unique validation for PoiType", async () => {
        const testPoiType1 = new PoiType({ name: "UniquePoiType" });
        const testPoiType2 = new PoiType({ name: "UniquePoiType" });

        await testPoiType1.save();

        try {
            await testPoiType2.save();
            assert.fail("Duplicate POI type should not be allowed");
        } catch (err) {
            assert.include(err.message, "duplicate key error collection");
        }
    });

    test("Creating a Placemark without required fields", async () => {
        const testPlacemark = new Placemark({
            description: "A description without a name or category",
            location: { lat: 51.5074, lon: -0.1278 },
        });

        try {
            await testPlacemark.save();
            assert.fail("Placemark should not be saved without required fields");
        } catch (err) {
            assert.include(err.message, "Placemark validation failed");
        }
    });
});
