# POI API

## Overview
A "Point of Interest" (POI) is a location for which information is available. POI data has many applications, including augmented reality browsers, location-based social networking games, geocaching, mapping, and navigation systems.

This project provides a RESTful API for managing POIs, allowing users to create, update, delete, and retrieve placemarks with various attributes, including categories and location data.

## Features
- User authentication (Signup/Login)
- CRUD operations for POIs
- Categorization of POIs
- GeoJSON-based location support
- JWT authentication (future improvement)
- Admin dashboard (future improvement)
- Deployment-ready configuration

## Technologies Used
- Node.js
- Hapi.js (for API routing)
- MongoDB (via Mongoose)
- JSON Web Tokens (JWT) (planned feature)
- Firebase (for future enhancements)
- Docker (for deployment)
- Heroku/Render (for cloud deployment)

## Installation & Setup

### Prerequisites
- Node.js (>= 14)
- MongoDB (local or MongoDB Atlas)
- Git

### Clone the Repository
```sh
git clone https://github.com/yourusername/poi-api.git
cd poi-api
```

### Install Dependencies
```sh
npm install
```

### Configure Environment Variables
Create a `.env` file in the root directory and configure the following:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/poi_db
JWT_SECRET=your_secret_key
```

### Run the Application
```sh
node server.js 
```

The API should now be running at `http://localhost:3000`.

## API Endpoints

### Placemarks
- `GET /placemarks` - Retrieve all placemarks
- `POST /placemarks` - Create a new placemark
- `PUT /placemarks/{id}` - Update an existing placemark
- `DELETE /placemarks/{id}` - Delete a placemark

### Categories
- `GET /placemark-categories` - Retrieve all categories
- `POST /placemark-categories` - Create a new category
- `PUT /placemark-categories/{id}` - Update an existing category

### POI Types
- `GET /poi-types` - Retrieve all POI types
- `POST /poi-types` - Create a new POI type
- `PUT /poi-types/{id}` - Update an existing POI type

## Authentication (Planned)
- User authentication via JWT
- Admin dashboard for managing users and data

## Deployment
For cloud deployment, configure MongoDB Atlas and deploy the application using Heroku or Render.

### Docker (Optional)
```sh
docker build -t poi-api .
docker run -p 3000:3000 poi-api
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT License