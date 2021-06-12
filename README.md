# Covid Application (Backend Node.Js with Express)

This project contains the logic of covid application which showing the data of death an cases of covid around world until 2021 May 26th. The backend uses JWT to secure endpoints and Moongoose like ORM.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the dependencies.

```bash
npm install
```

## .env File

You need .env file for configurations. in the .env file you need to put the next variables:

```bash
DB_CONNECT = your_db_connect
TOKEN_SECRET = your_secret
```

## DB

You can find the data in this project shared/db/data.json . You need to import the script for example in cloud.mongodb.com

## Visuals

If you can watch some images of the project you can check this link https://github.com/VManuelPM/CovidFront

## Development server

Run `nodemon` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

## Swagger Documentation

Run `nodemon` for a dev server. Navigate to `http://localhost:3000/api-docs/`. The app will automatically reload if you change any of the source files.

## Frontend

You can find the frontend in this link https://github.com/VManuelPM/CovidFront
