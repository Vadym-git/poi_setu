import { User } from '../models/user.js'; // Import the User model

const usersRoutes = (server) => {

const basePath = "/users"; // Define the base path for the routes
    // Route to get all users (GET)
    server.route({
        method: 'GET',
        path: basePath,
        handler: async (request, h) => {
            try {
                // Fetch all users from the database
                const products = await User.find();
                // Return the fetched products with a 200 OK status
                return h.response(products).code(200);
            } catch (err) {
                // Handle errors if any occur during the database query
                return h.response({ message: 'Error fetching user' }).code(500);
            }
        }
    });

    // Route to create a new placemark (POST)
    server.route({
        method: 'POST',
        path: basePath,
        handler: async (request, h) => {
            try {
                // Extract name, category, and description from the request payload
                const { name, secondName, password } = request.payload;
                // Create a new User instance with the provided data
                const newUser = new User({ name, secondName, password });
                // Save the new placemark to the database
                await newUser.save();
                // Return the created product with a 201 Created status
                return h.response(newUser).code(201);
            } catch (err) {
                // Handle errors during product creation
                return h.response({ message: 'Error creating product' }).code(500);
            }
        }
    });

    // Route to update an existing placemark (PUT)
    server.route({
        method: 'PUT',
        path: `${basePath}/{id}`,
        handler: async (request, h) => {
            try {
                // Get the ID from the request params and the updated data from the payload
                const { id } = request.params;
                const { name, secondName, password } = request.payload;
                // Find and update the placemark by its ID
                const updatedUser = await User.findByIdAndUpdate(id, { name, secondName, password }, { new: true });
                if (!updatedUser) {
                    // Return 404 if the placemark was not found
                    return h.response({ message: 'User not found' }).code(404);
                }
                // Return the updated product with a 200 OK status
                return h.response(updatedUser).code(200);
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
        handler: async (request, h) => {
            try {
                // Get the ID from the request params
                const { id } = request.params;
                // Find and delete the placemark by its ID
                const deletedUser = await User.findByIdAndDelete(id);
                if (!deletedUser) {
                    // Return 404 if the placemark was not found
                    return h.response({ message: 'User not found' }).code(404);
                }
                // Return a success message with a 200 OK status
                return h.response({ message: 'User deleted' }).code(200);
            } catch (err) {
                // Handle errors during product deletion
                return h.response({ message: 'Error deleting product' }).code(500);
            }
        }
    });
};

export default usersRoutes;
