# My Express

## Overview
Basic API Skeleton using [Express](https://expressjs.com/)

## Prerequisites
- NodeJS (v18.17.0)
- Postgresql

## Installation
- Clone the project
- Install dependencies
```
$ npm install
```
- Copy `env.example` to `.env`
- Adjust database configuration inside `.env`

## Migration and Seeding
- Run database migration (command below is using production environment)
```
$ knex migrate:latest --env production
```
- Seed database users
```
$ node ./bin/cli.js --seed users
```

## Running
- Run with node server
```
$ npm run start
```

## Docker Installation
- Use docker-compose for easy deployment
```
$ docker-compose up --build
```
- Go into nodejs docker shell and run the database migration with full path of knex command
```
$ node_modules/.bin/knex migrate:latest --env production
```
- Do not forget to seed the users
