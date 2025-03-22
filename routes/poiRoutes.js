import { Placemark, Category, PoiType } from '../models/placemark.js'; // Import the Placemark model
import authMiddleware from '../authMiddleware.js';
import Joi from 'joi';
const { options } = Joi;


const placemarkRoutes = (server) => {

    // =========================================== Placemarks ===========================================

    const basePath = "/placemarks"; // Define the base path for the routes

    // Route to get all placemarks (GET)
    server.route({
        method: 'GET',
        path: basePath,
        options: {
            tags: ["api"],
            description: "Get all POI objects",
            notes: "Returns detailed data"
        },
        handler: async (request, h) => {
            try {
                // Fetch all placemarks from the database
                const placemarks = await Placemark.find();
                return h.response(placemarks).code(200);
            } catch (err) {
                console.error('Error fetching placemarks:', err);
                return h.response({ message: 'Error fetching placemarks' }).code(500);
            }
        },
    });


    // Route to create a new placemark (POST)
    server.route({
        method: 'POST',
        path: basePath,
        handler: async (request, h) => {
            try {
                // Extract name, category, and description from the request payload
                const { name, categories, description, poitype, location } = request.payload;
                // Create a new Placemark instance with the provided data
                const newProduct = new Placemark({ name, categories, description, poitype, location });
                // Save the new placemark to the database
                await newProduct.save();
                // Return the created product with a 201 Created status
                return h.response(newProduct).code(201);
            } catch (err) {
                // Handle errors during product creation
                return h.response({ message: `Error creating product: ${err}` }).code(500);
            }
        }
    });

    // Route to update an existing placemark (PUT)
    server.route({
        method: 'PUT',
        path: `${basePath}/{id}`,
        options: {
            pre: [{ method: authMiddleware }]
        },
        handler: async (request, h) => {
            try {
                // Get the ID from the request params and the updated data from the payload
                const { id } = request.params;
                const { name, categories, description, poitype, location } = request.payload;
                // Find and update the placemark by its ID
                const updatedProduct = await Placemark.findByIdAndUpdate(id, { name, categories, description, poitype, location }, { new: true });
                if (!updatedProduct) {
                    // Return 404 if the placemark was not found
                    return h.response({ message: 'Placemark not found' }).code(404);
                }
                // Return the updated product with a 200 OK status
                return h.response(updatedProduct).code(200);
            } catch (err) {
                // Handle errors during product update
                return h.response({ message: 'Error updating product' }).code(500);
            }
        }
    });

    // Route to delete a placemark (DELETE)
    server.route({
        method: 'DELETE',
        path: `${basePath}/{id}`,
        options: {
            pre: [{ method: authMiddleware }]
        },
        handler: async (request, h) => {
            try {
                // Get the ID from the request params
                const { id } = request.params;
                // Find and delete the placemark by its ID
                const deletedProduct = await Placemark.findByIdAndDelete(id);
                if (!deletedProduct) {
                    // Return 404 if the placemark was not found
                    return h.response({ message: 'Placemark not found' }).code(404);
                }
                // Return a success message with a 200 OK status
                return h.response({ message: 'Placemark deleted' }).code(200);
            } catch (err) {
                // Handle errors during product deletion
                return h.response({ message: 'Error deleting product' }).code(500);
            }
        }
    });

    //  =========================================== Categories ===========================================

    const placemarcCategoriesPath = "/placemark-categories"
    // Route to ADD Category
    server.route({
        method: 'GET',
        path: `${placemarcCategoriesPath}`,
        handler: async (request, h) => {
            try {
                // Fetch all categories from the database
                const categories = await Category.find();
                // Return the fetched categories with a 200 OK status
                return h.response(categories).code(200);
            } catch (err) {
                // console.error('Error fetching categories:', err);
                // Handle errors if any occur during the database query
                return h.response({ message: 'Error fetching categories' }).code(500);
            }
        }
    });


    // Creating a new Category
    server.route({
        method: 'POST',
        path: placemarcCategoriesPath,
        handler: async (request, h) => {
            try {
                // Extract name from the request payload
                const { name } = request.payload;
                // Create a new Category instance with the provided data
                const newCategory = new Category({ name });
                // Save the new placemark to the database
                await newCategory.save();
                // Return the created category with a 201 Created status
                return h.response(newCategory).code(201);
            } catch (err) {
                // Handle errors during category creation
                return h.response({ message: 'Error creating Category' }).code(500);
            }
        }
    });

    // Route to update an existing category (PUT)
    server.route({
        method: 'PUT',
        path: `${placemarcCategoriesPath}/{id}`,
        options: {
            pre: [{ method: authMiddleware }]
        },
        handler: async (request, h) => {
            try {
                // Get the ID from the request params and the updated data from the payload
                const { id } = request.params;
                const { name } = request.payload;
                // Find and update the placemark by its ID
                const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });
                if (!updatedCategory) {
                    // Return 404 if the placemark was not found
                    return h.response({ message: 'Category not found' }).code(404);
                }
                // Return the updated product with a 200 OK status
                return h.response(updatedCategory).code(200);
            } catch (err) {
                // Handle errors during product update
                return h.response({ message: 'Error updating Category' }).code(500);
            }
        }
    });




    //  =========================================== POI Types ===========================================

    const poiTypePath = "/poi-types"; // Define the base path for the routes

    // Route to get all PoiType (GET)
    server.route({
        method: 'GET',
        path: poiTypePath,
        handler: async (request, h) => {
            try {
                // Fetch all poiType from the database
                const poiType = await PoiType.find();
                return h.response(poiType).code(200);
            } catch (err) {
                console.error('Error fetching poiType:', err);
                return h.response({ message: 'Error fetching poiType' }).code(500);
            }
        }
    });


    server.route({
        method: 'POST',
        path: poiTypePath,
        options: {
            pre: [{ method: authMiddleware }]
        },
        handler: async (request, h) => {
            try {
                // Extract name from the request payload
                const { name } = request.payload;
                // Create a new PoiType instance with the provided data
                const newPoiType = new PoiType({ name });
                // Save the new PoiType to the database
                await newPoiType.save();
                // Return the created PoiType with a 201 Created status
                return h.response(newPoiType).code(201);
            } catch (err) {
                // Handle errors during PoiType creation
                return h.response({ message: `Error creating PoiType: ${err}` }).code(500);
            }
        }
    });


    server.route({
        method: 'PUT',
        path: `${poiTypePath}/{id}`,
        options: {
            pre: [{ method: authMiddleware }]
        },
        handler: async (request, h) => {
            try {
                // Get the ID from the request params and the updated data from the payload
                const { id } = request.params;
                const { name } = request.payload;
                // Find and update the poiType by its ID
                const poiType = await PoiType.findByIdAndUpdate(id, { name }, { new: true });
                if (!poiType) {
                    // Return 404 if the poiType was not found
                    return h.response({ message: 'PoiType not found' }).code(404);
                }
                // Return the updated poiType with a 200 OK status
                return h.response(poiType).code(200);
            } catch (err) {
                // Handle errors during poiType update
                return h.response({ message: 'Error updating poiType' }).code(500);
            }
        }
    });

};

export default placemarkRoutes;
