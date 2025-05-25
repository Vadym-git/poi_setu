import { Placemark, Category } from '../models/placemark.js'; // Import the Placemark model
import authMiddleware from '../authMiddleware.js';
import Joi from 'joi';
const { options } = Joi;
import { standardResponse } from './types.js';


const placemarkRoutes = (server) => {
	const prefix = "/api";

    // =========================================== Placemarks ===========================================

    const basePath = "/placemarks"; // Define the base path for the routes

    // Route to get all placemarks (GET)
    server.route({
        method: 'GET',
        path: prefix+basePath,
        options: {
            tags: ["api"],
            description: "Get all POI objects",
            notes: "Returns detailed data"
        },
        handler: async (request, h) => {
            try {
                const placemarks = await Placemark.find(); // Отримуємо дані
                const cleanPlacemarks = placemarks.map(placemark => placemark.toObject());
                return h.response(standardResponse(200, "Placemarks found", cleanPlacemarks)).code(200);
            } catch (err) {
                console.error('Error fetching placemarks:', err);
                return h.response(standardResponse(404, "Placemarks not found", null, "Something went wrong")).code(404);
            }
        },
    });
    

    // GET single placemark GET
	server.route({
	  method: 'GET',
	  path: `${prefix}${basePath}/{id}`,
	  handler: async (request, h) => {
		try {
		  const { id } = request.params;

		  const placemark = await Placemark.findById(id);
		  if (!placemark) {
			return h
			  .response(standardResponse(404, "Placemark not found", null, "Something went wrong"))
			  .code(404);
		  }

		  // 🟡 Додаємо логіку підрахунку перегляду:
		  const today = new Date();
		  const todayStart = new Date(today.setHours(0, 0, 0, 0));

		  const result = await Placemark.updateOne(
			{ _id: id, "views.date": todayStart },
			{ $inc: { "views.$.count": 1 } }
		  );

		  if (result.modifiedCount === 0) {
			await Placemark.updateOne(
			  { _id: id },
			  {
				$push: {
				  views: {
					date: todayStart,
					count: 1,
				  },
				},
			  }
			);
		  }

		  return h.response(standardResponse(200, "Placemark found", placemark)).code(200);
		} catch (err) {
		  return h
			.response(standardResponse(500, "Error retrieving product", null, "Something went wrong"))
			.code(500);
		}
	  },
	});

    


    // Route to create a new placemark (POST)
    server.route({
        method: 'POST',
        path: prefix+basePath,
		options: {
			cors: {
			  origin: ["http://localhost:5173"],
			  credentials: true,
			},
            pre: [{ method: authMiddleware }]
        },
        handler: async (request, h) => {
            try {
                // Extract name, category, and description from the request payload
                const { name, categories, description, location, imageUrl, title } = request.payload;
                // Create a new Placemark instance with the provided data
                const newProduct = new Placemark({ name, categories, title, description, location, imageUrl });
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
	  path: `${prefix}${basePath}/{id}`,
	  options: {
		cors: {
		  origin: ["http://localhost:5173"],
		  credentials: true,
		},
		pre: [{ method: authMiddleware }],
	  },
	  handler: async (request, h) => {
		try {
		  const { id } = request.params;
		  const updateData = request.payload;

		  // 🧩 Оновлення з runValidators — щоб валідувати по схемі
		  const updatedPlacemark = await Placemark.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		  });

		  if (!updatedPlacemark) {
			return h.response({ message: "Placemark not found" }).code(404);
		  }

		  return h.response(updatedPlacemark).code(200);
		} catch (err) {
		  console.error("❌ Error updating placemark:", err);
		  return h.response({ message: "Error updating product" }).code(500);
		}
	  },
	});


    // Route to delete a placemark (DELETE)
    server.route({
        method: 'DELETE',
        path: `${prefix}${basePath}/{id}`,
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
	  path: `${prefix}${placemarcCategoriesPath}`,
	  options: {
		cors: {
		  origin: ['http://localhost:5173'],
		  credentials: true, // 🟢 обов'язково!
		},
	  },
	  handler: async (request, h) => {
		try {
		  const categories = await Category.find();
		  return h.response(categories).code(200);
		} catch (err) {
		  return h.response({ message: 'Error fetching categories' }).code(500);
		}
	  }
	});
	
	server.route({
	  method: "GET",
	  path: `${prefix}${placemarcCategoriesPath}/{id}`,
	  options: {
		cors: {
		  origin: ["http://localhost:5173"],
		  credentials: true,
		},
	  },
	  handler: async (request, h) => {
		try {
		  const { id } = request.params;
		  const category = await Category.findById(id);

		  if (!category) {
			return h.response({ message: "Category not found" }).code(404);
		  }

		  return h.response(category).code(200);
		} catch (err) {
		  return h.response({ message: "Error fetching category" }).code(500);
		}
	  },
	});

	server.route({
	  method: "DELETE",
	  path: `${prefix}${placemarcCategoriesPath}/{id}`,
	  options: {
		cors: {
		  origin: ["http://localhost:5173"],
		  credentials: true,
		},
	  },
	  handler: async (request, h) => {
		try {
		  const { id } = request.params;

		  const deletedCategory = await Category.findByIdAndDelete(id);

		  if (!deletedCategory) {
			return h.response({ message: "Category not found" }).code(404);
		  }

		  return h.response({ message: "Category deleted successfully" }).code(200);
		} catch (err) {
		  console.error("❌ Error deleting category:", err);
		  return h.response({ message: "Error deleting category" }).code(500);
		}
	  },
	});



    // Creating a new Category
	server.route({
	  method: "POST",
	  path: `${prefix}${placemarcCategoriesPath}`,
	  options: {
		cors: {
		  origin: ["http://localhost:5173"],
		  credentials: true,
		},
	  },
	  handler: async (request, h) => {
		try {
		  const { name } = request.payload;

		  if (!name || typeof name !== "string" || !name.trim()) {
			return h.response({ message: "Category name is required" }).code(400);
		  }

		  const normalized = name.trim().toLowerCase();
		  const newCategory = new Category({ name: normalized });
		  await newCategory.save();

		  return h.response(newCategory).code(201);
		} catch (err) {
		  console.error("❌ Category creation error:", err);
		  return h.response({ message: "Error creating Category" }).code(500);
		}
	  },
	});



    // Route to update an existing category (PUT)
    server.route({
        method: 'PUT',
        path: `${prefix}${placemarcCategoriesPath}/{id}`,
        options: {
			cors: {
			  origin: ["http://localhost:5173"],
			  credentials: true,
			},
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
        path: prefix+poiTypePath,
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
        path: prefix+poiTypePath,
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
        path: `${prefix}${poiTypePath}/{id}`,
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
