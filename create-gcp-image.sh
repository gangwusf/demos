
TAG="gcr.io//warm-tome-332217/demos"
gcloud builds submit . -t=$TAG 


TAG="demos"
docker build -t $TAG .
docker tag $TAG gcr.io/warm-tome-332217/$TAG:v1
docker push gcr.io/warm-tome-332217/$TAG:v1

#kubectl delete -f deployment.yml
kubectl apply -f  deployment.yml
