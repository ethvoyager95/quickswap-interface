sync:
	rsync -avhzL --delete \
    --no-perms --no-owner --no-group \
    --exclude .git \
    --filter=":- .gitignore" \
    . sotatek@172.16.1.217:/home/sotatek/strike-boost
deploy:
	ssh sotatek@172.16.1.217 'cd /home/sotatek/strike-boost && docker build -t strike:latest . && \
  docker rm -f strike-fe && \
  docker run -d -it -p 5000:3000 --name strike-fe strike:latest'