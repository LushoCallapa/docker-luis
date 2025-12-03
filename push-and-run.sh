#!/bin/bash

export $(grep -v '^#' .env | xargs)

IMAGE="lushocallapa/nginx-demo:latest"
CONTAINER="nginx-demo"

echo "Construyendo la imagen $IMAGE..."
docker build -t $IMAGE .

echo "Logueando en Docker Hub..."
echo $DOCKER_PASS | docker login --username $DOCKER_USER --password-stdin

echo "Subiendo la imagen a Docker Hub..."
docker push $IMAGE

if [ "$(docker ps -aq -f name=$CONTAINER)" ]; then
    echo "Deteniendo y eliminando contenedor existente $CONTAINER..."
    docker stop $CONTAINER
    docker rm $CONTAINER
fi

echo "Levantando nuevo contenedor $CONTAINER..."
docker run -d -p 8080:80 --name $CONTAINER $IMAGE

echo "¡Listo! Nginx corriendo en http://localhost:8080"
