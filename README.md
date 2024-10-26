Here’s a sample README file for the [Movie API App](https://github.com/MalvinaAna/movie-api-app) repository, including sections for setup, usage, and more.

---

# Movie API App

This project is a RESTful API built with Node.js, Express, and MongoDB, designed to serve as the backend for a movie application. It allows users to register, authenticate, and access a collection of movies, including detailed information on genres and directors. Users can manage their profiles and create lists of favorite movies.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [License](#license)

---

## Features
- **User Authentication:** Secure registration, login, and JWT-based authentication.
- **Movie Database:** CRUD operations for movies, genres, and directors.
- **User Profile Management:** Edit user profile details and manage favorite movies.
- **Secure API:** Passwords are hashed with bcrypt, and access is restricted via JWT.

## Technologies Used
- **Node.js & Express:** Backend framework and server.
- **MongoDB & Mongoose:** Database and object modeling.
- **Passport.js & JWT:** Authentication and token-based authorization.
- **JSDoc:** Documentation for API endpoints.

## Getting Started

### Prerequisites
- **Node.js** (v12+)
- **MongoDB** (local instance or MongoDB Atlas)
- **Git**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MalvinaAna/movie-api-app.git
   cd movie-api-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   CONNECTION_URI=<your_mongodb_connection_uri>
   JWT_SECRET=<your_jwt_secret>
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will be running on `http://localhost:8080` by default.

## Endpoints

### Users
- **POST /users**: Register a new user
- **POST /login**: Login a user and receive a JWT token
- **GET /users/:Username**: Get a user’s profile
- **PUT /users/:Username**: Update a user’s profile
- **DELETE /users/:Username**: Delete a user

### Movies
- **GET /movies**: Get a list of all movies
- **GET /movies/:Title**: Get a movie by title
- **GET /movies/Genre/:GenreName**: Get details about a genre
- **GET /movies/Director/:DirectorName**: Get details about a director

### Favorites
- **POST /users/:Username/movies/:MovieID**: Add a movie to user’s favorites
- **DELETE /users/:Username/movies/:MovieID**: Remove a movie from user’s favorites

## Authentication
This API uses **JWT (JSON Web Token)** for authentication. To access protected routes, users must provide a valid JWT in the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
```

## Error Handling
Errors are handled with appropriate HTTP status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses typically include a message field to help diagnose issues.

## License
This project is licensed under the MIT License.

---

This README provides setup, usage, and endpoint documentation for easy deployment and testing. You can adjust specific fields (like URIs and descriptions) as needed. Let me know if you want any additional details included!
