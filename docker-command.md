# Container Commands
```bash
docker ps
```

Output:
```bash
CONTAINER ID   IMAGE           COMMAND                  CREATED         STATUS         PORTS                    NAMES
a1b2c3d4e5f6   todo-backend    "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:5000->5000/tcp   todo-backend
b2c3d4e5f6a1   mongo:6         "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   27017/tcp                todo-mongodb
```

### বন্ধ সহ সব containers দেখো
- docker ps -a

### শুধু container ID দেখো
- docker ps -q

### বন্ধ সহ সব এর ID
- docker ps -aq

### # সব logs একবারে দেখো
- docker logs todo-backend

### Live follow করো (নতুন log আসলে দেখাবে)
- docker logs -f todo-backend

### শেষ ২০ লাইন দেখো
- docker logs --tail 20 todo-backend


### শেষ ২০ লাইন + live follow
- docker logs --tail 20 -f todo-backend

### Timestamp সহ দেখো
- docker logs -t todo-backend

**কখন use করবে:**
- App crash করেছে কেন? → docker logs container_name
- MongoDB connect হচ্ছে না কেন? → docker logs todo-backend
- Live request দেখতে চাও? → docker logs -f todo-backend

## docker exec — চলমান container এ ঢোকো

```bash
# Container এর ভেতরে shell খোলো
docker exec -it todo-backend sh

# এখন container এর ভেতরে আছো
# যা খুশি করো
ls /app
cat /app/index.js
node --version
exit   # বেরিয়ে আসো
```

### Shell না খুলে সরাসরি command চালাও

```bash
docker exec todo-backend node --version
docker exec todo-backend ls /app
docker exec todo-backend cat /app/package.json
```

`-it` মানে:
```
-i = interactive (input দিতে পারবে)
-t = tty (terminal এর মতো দেখাবে)
```

### docker inspect — Container এর সব details

```bash
docker inspect todo-backend
```

### IP address দেখো
```bash
docker inspect todo-backend | grep IPAddress
```

### Environment variables দেখো
```bash
docker inspect todo-backend | grep -A 10 "Env"
```

### Mounts দেখো

```bash
docker inspect todo-backend | grep -A 10 "Mounts"
```
### Container বন্ধ করো (gracefully)
```bash
docker stop todo-backend
```

### Container চালু করো
```bash
docker start todo-backend
```

### Container restart করো
```bash
docker restart todo-backend
```

### একসাথে অনেকগুলো
```bash
docker stop todo-backend todo-frontend todo-mongodb
```

### Container delete (আগে বন্ধ করতে হবে)
```bash
docker stop todo-backend
docker rm todo-backend
```

### চলমান container force delete
```bash
docker rm -f todo-backend
```

### সব বন্ধ container delete
```bash
docker container prune
```

### চলমান সহ সব delete (সাবধানে!)
```bash
docker rm -f $(docker ps -aq)
```

### সব images দেখো
```bash
docker images
```

### নির্দিষ্ট image delete
```bash
docker rmi todo-app-backend
```

### Force delete (container চলছে তাও)
```bash
docker rmi -f todo-app-backend
```

### Unused images delete
```bash
docker image prune
```

### সব unused images delete
```bash
docker image prune -a
```

### সব volumes দেখো
```bash
docker volume ls
```

### Volume details
```bash
docker volume inspect todo-app_mongodata
```

### Volume delete
```bash
docker volume rm todo-app_mongodata
```

### Unused volumes delete
```bash
docker volume prune
```

### সব unused জিনিস একসাথে delete
**(stopped containers, unused networks, dangling images)**
```bash
docker system prune
```

### Volume সহ সব unused delete (সাবধানে! data যাবে)
```bash
docker system prune -a --volumes
```

### Docker কত জায়গা নিচ্ছে দেখো
```bash
docker system df
```

### Build করে চালু করো
```bash
docker compose up --build
```

### Background এ চালু
```bash
docker compose up -d
```

### Background এ build করে চালু
```bash
docker compose up -d --build
```

### বন্ধ করো
```bash
docker compose down
```

### বন্ধ করো + volumes delete
```bash
docker compose down -v
```

### বন্ধ করো + images delete
```bash
docker compose down --rmi all
```

### সব logs দেখো
```bash
docker compose logs
```

### Specific service এর logs
```bash
docker compose logs backend
```

### Live logs
```bash
docker compose logs -f
```

### Container এ ঢোকো
```bash
docker compose exec backend sh
docker compose exec mongodb mongosh
```
### চলমান services দেখো
```bash
docker compose ps
```
### Restart
```bash
docker compose restart
docker compose restart backend
```

### শুধু একটা service চালু করো
```bash
docker compose up backend
```
### Build করো (run না করে)
```bash
docker compose build
```
### Cache ছাড়া build
```bash
docker compose build --no-cache
```
```bash
```
