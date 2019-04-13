# Wobbly Time

## CLONE REPO

```
git clone git@github.com:lazy-ants/lazy-time.git
cd lazy-time
```

## CREATE APP CONFIG FILES

```
cp docker/nginx/nginx.conf.dist docker/nginx/nginx.conf
cp docker-compose.override.yml.dist docker-compose.override.yml
```

## BUILD APPLICATION

- in development mode, http://localhost:3000

```
bash dev.sh
```

- in production mode, http://wobbly.me

```
bash prod.sh
```

