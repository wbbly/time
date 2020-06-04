# Wobbly Time

## CLONE REPO

```
git clone git@github.com:wbbly/time.git
cd time
```

## CREATE APP CONFIG FILES

```
cp docker/nginx/nginx.conf.dist docker/nginx/nginx.conf
cp docker-compose.override.yml.dist docker-compose.override.yml
cp project/application/src/config.js.dist project/application/src/config.js
```

## BUILD APPLICATION

- in development mode, http://localhost:3000

```
docker-compose up -d --build
docker exec -ti <nodejs-container-name> npm install
docker exec -ti <nodejs-container-name> bash -c 'npm run copy:libs'
docker exec -ti <nodejs-container-name> bash -c 'npm start'
```

- in production mode, https://wobbly.me

```
docker-compose up -d --build
docker exec -ti <nodejs-container-name> npm install
docker exec -ti <nodejs-container-name> bash -c 'npm run copy:libs'
docker exec -ti <nodejs-container-name> bash -c 'npm run build -- --prod'
```

