# Image Management API


This project is a backend API for image CRUD operations, allowing users to upload, retrieve, update, and delete images stored in Cloudinary and MongoDB.

TECH Stack
Express.js
MongoDB
Cloudinary

## Features

- Upload images 
- Retrieve image 
- Update existing image record
- Delete images 
- Swagger documentation for API routes


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm
- MongoDB
- Cloudinary account


## Run Locally

Clone the project

```bash
  git clone https://github.com/mayanksharma18/ImageManagementChallenge.git
```

Go to the project directory

```bash
  cd ImageManagementChallenge
```

Set environment (vars):
```bash
cp .env.example .env
```
Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Project Structure

```
src\
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--app.js          # Express app
 |--server.js        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Image routes**:\
`POST /v1/image/upload` - upload image\
`GET /v1/image/getImage/{id}` - get image by id\
`GET /v1/image/getAllImages` - get all images\
`PUT /v1/image/update/{id}` - update image \
`DELETE /v1/image/delete/{id}` - delete image\


### Building and running your application through docker

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:3000.

Swagger docs available at localhost:3000/v1/docs