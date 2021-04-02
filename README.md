## Pre-requisites

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Usage

- Clone this repo on a machine where you'd like to deploy frontend application
- Copy `docker/nginx/nginx.conf.dist` to `docker/nginx/nginx.conf`
- Copy `docker-compose.override.yml.dist` to `docker-compose.override.yml`
- Copy `project/application/src/config.js.dist` to `project/application/src/config.js`
- Edit `docker/nginx/nginx.conf` and change '127.0.0.1' with Wobbly Frontend domain
- Edit `docker/nginx/nginx.conf` and change 'http://127.0.0.1:8081' with Wobbly API domain
- Edit `project/application/src/config.js` and change '<apiURL>' substring with Wobbly API domain
- `docker-compose up -d --build`
- `docker exec -ti <nodejs-docker-container> bash -c 'npm install'`
- `docker exec -ti <nodejs-docker-container> bash -c 'npm run copy:libs'`
- `docker exec -ti <nodejs-docker-container> bash -c 'npm run build -- --prod'`

## Important endpoints

- Frontend application will be `http://127.0.0.1:8082`
