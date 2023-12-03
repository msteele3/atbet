aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 967368641896.dkr.ecr.us-east-2.amazonaws.com
docker tag docker-image:test_8803_backend 967368641896.dkr.ecr.us-east-2.amazonaws.com/atbet-backend:latest
docker push 967368641896.dkr.ecr.us-east-2.amazonaws.com/atbet-backend:latest
