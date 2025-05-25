import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";  // Додай це!
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./db.js";
import placemarkRoutes from "./routes/poiRoutes.js";
import usersRoutes from "./routes/userRoutes.js";
import userAuthRoutes from "./routes/authUser.js";
import HapiSwagger from "hapi-swagger";
import setupGoogleAuth from "./routes/authGoogle.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const init = async () => {
  const port = process.env.PORT || 8000;

  const server = Hapi.server({
    port: port,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"], // Якщо треба дозволити CORS (на розробці наприклад)
      },
    },
  });

  connectDB();

  // Спочатку реєструємо Inert та Vision, а потім HapiSwagger
  await server.register([
    Inert,
    Vision,  // Додай Vision сюди
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Placemark API",
          description: "API Documentation for Placemark Service",
          version: "1.0.0",
        },
        grouping: "tags",
        tags: ["Placemark", "User", "Auth"],
        jsonPath: "/swagger.json",
        documentationPath: "/documentation",
        validator: true,
      },
    },
  ]);

  // Реєстрація API маршрутів
  placemarkRoutes(server);
  userAuthRoutes(server);
  usersRoutes(server);
  await setupGoogleAuth(server);

  // Обробка фронтенду (React static files)
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: path.join(__dirname, "client_build"), // ТУТ буде твій React build
        index: ["index.html"],
      },
    },
  });

  // Якщо маршрут не знайдено — віддаємо index.html для React Router
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
    if (response.isBoom && response.output.statusCode === 404) {
      return h.file(path.join(__dirname, "client_build", "index.html"));
    }
    return h.continue;
  });

  await server.start();
  console.log(`✅ Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
