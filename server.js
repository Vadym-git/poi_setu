// Import necessary modules
const Hapi = require('@hapi/hapi');
const connectDB = require('./db');
const placemarkRoutes = require('./routes/poiRoutes');

// Function to initialize the server
const init = async () => {

    // Create a new Hapi server instance with specified port and host
    const server = Hapi.server({
        port: 5000,  // Port number the server will listen on
        host: 'localhost'  // Host to bind the server to
    });

    // Connect to MongoDB database
    connectDB();

    // Register the routes for placemarks
    placemarkRoutes(server);

    // Start the server and log the URL once it's running
    await server.start();
    console.log(`✅ Server running on ${server.info.uri}`);
};

// Handle any unhandled promise rejections (e.g., database errors)
process.on('unhandledRejection', (err) => {
    console.log(err);  // Log the error
    process.exit(1);  // Exit the process with a non-zero status code
});

// Call the function to initialize and start the server
init();
