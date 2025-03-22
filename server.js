import Hapi from "@hapi/hapi";
import connectDB from "./db.js";
import placemarkRoutes from "./routes/poiRoutes.js";
import usersRoutes from "./routes/userRoutes.js";
import userAuthRoutes from "./routes/authUser.js";
import Vision from '@hapi/vision';  // Plugin for rendering views (if you need it)
import Inert from '@hapi/inert';  // Plugin to handle static files
import HapiSwagger from 'hapi-swagger';  // Plugin to generate Swagger documentation


const init = async () => {
    // Create a new Hapi server instance with specified port and host
    const server = Hapi.server({
        port: 5000,  // Port number the server will listen on
        host: "localhost"  // Host to bind the server to
    });

    // Connect to MongoDB database
    connectDB();

    // Register Inert, Vision (if needed), and HapiSwagger plugins
    await server.register([
        Inert,  // Статичні файли
        Vision, // Якщо не використовуєте шаблони, видаліть
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Placemark API',
                    description: 'API Documentation for Placemark Service',
                    version: '1.0.0',
                },
                grouping: 'tags',  // Групуємо ендпоінти за тегами
                tags: ['Placemark', 'User', 'Auth'],  // Теги для маршрутов
                jsonPath: '/swagger.json',  // Шлях для JSON документації
                documentationPath: '/documentation',  // Шлях для UI Swagger
                validator: true
            }
        }
    ]);

    // Register the routes for placemarks, users, and user authentication
    placemarkRoutes(server);
    userAuthRoutes(server);
    usersRoutes(server);

    // Start the server and log the URL once it's running
    await server.start();
    console.log(`✅ Server running on ${server.info.uri}`);
};

// Handle any unhandled promise rejections (e.g., database errors)
process.on("unhandledRejection", (err) => {
    console.log(err);  // Log the error
    process.exit(1);  // Exit the process with a non-zero status code
});

// Call the function to initialize and start the server
init();
