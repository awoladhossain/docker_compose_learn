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
### জায়গা ১ — Service এর ভেতরে
services:
  mongodb:
    volumes:
      - mongodata:/data/db    ← "USE করছি"

### জায়গা ২ — নিচে top-level
volumes:
  mongodata:                  ← "DECLARE করছি"

এটা ঠিক যেমন JavaScript এ:

// আগে declare করতে হয়
const myVariable;

// তারপর use করতে পারো
myVariable = "hello";

Docker ও same। আগে বলতে হবে "এই নামে একটা volume আছে", তারপর service এ use করতে পারবে।

### এটা না লিখলে এই error আসবে:
`service "mongodb" refers to undefined volume mongodata`
volumes:
  mongodata:

**mongodata: এর পরে কিছু নেই কেন?**

volumes:
  mongodata:
    driver: local        # এটা default, না লিখলেও same
    driver_opts: {}      # এটাও default
```

শুধু নাম লিখলে Docker নিজে সব default দিয়ে তৈরি করে। তাই শুধু `mongodata:` লিখলেই চলে।
```
Host এ physically কোথায় থাকে?
/var/lib/docker/volumes/todo-app_mongodata/_data/

Docker নিজে manage করে, তোমাকে কিছু করতে হয় না।

### networks: todo-net: driver: bridge — এটা কী?
এখানে তিনটা জিনিস আছে, একটা একটা করে বোঝো।

1. networks: (top-level) — Declare করা
### জায়গা ১ — Service এর ভেতরে
services:
  mongodb:
    networks:
      - todo-net    ← "এই network এ রাখো"

### জায়গা ২ — নিচে top-level
networks:
  todo-net:         ← "এই নামে network declare করছি"

2. driver: — Network এর ধরন
```
networks:
  todo-net:
    driver: bridge
```

Docker এ ৪ ধরনের network driver আছে:
```bash
bridge   → একই machine এর containers connect করে (99% কাজে এটাই)
host     → Container host এর network directly use করে
overlay  → আলাদা আলাদা machine এর containers connect করে (Kubernetes এ)
none     → কোনো network নেই, সম্পূর্ণ isolated
```
তুমি bridge লিখেছো, এটাই সঠিক। এটা default ও।

networks:
  todo-net:
    driver: bridge   ← এটা লিখলে

networks:
  todo-net:          ← এটা না লিখলেও same, bridge default
```

তাহলে কেন explicitly লিখবো? **Clarity এর জন্য।** কেউ file দেখলে বুঝবে কোন driver use হচ্ছে।

---

### ৩. Bridge Network আসলে কী?

Real life analogy দিয়ে বোঝো:
```
তোমার বাড়িতে WiFi router আছে।
Phone, Laptop, TV সব router এর সাথে connect।
এরা নিজেদের মধ্যে কথা বলতে পারে।
বাইরের কেউ directly ঢুকতে পারে না।

Bridge Network = এই WiFi router
Containers = Phone, Laptop, TV
```
```
[todo-net bridge network]
┌────────────────────────────────────┐
│                                    │
│  [mongodb]  [backend]  [frontend]  │
│      ↕           ↕          ↕      │
│   নিজেদের মধ্যে নাম দিয়ে কথা বলে  │
│                                    │
└────────────────────────────────────┘
         ↕
    বাইরে যায় ports দিয়ে
    (5000:5000, 8080:80)
```

**Bridge এর কাজ ৩টা:**
```
১. Isolation:
   todo-net এর বাইরের containers এদের দেখতে পাবে না

২. DNS (নাম দিয়ে চেনা):
   backend থেকে "mongodb" লিখলেই connect হয়
   IP মনে রাখতে হয় না

৩. Internal Communication:
   mongodb port 27017 বাইরে expose না করেও
   backend সেটা access করতে পারে
```

---

### Default Bridge vs Custom Bridge — পার্থক্য
```
Default Bridge (Docker এর নিজের):
  ❌ DNS নেই → IP দিয়ে connect করতে হয়
  ❌ IP বদলে গেলে সব ভাঙে
  ❌ সব containers একসাথে, isolation নেই

Custom Bridge (তুমি তৈরি করলে):
  ✅ DNS আছে → "mongodb" লিখলেই হয়
  ✅ IP বদলালে কিছু হয় না, নাম কাজ করে
  ✅ শুধু same network এর containers কথা বলতে পারে

তাই সবসময় custom network তৈরি করো।
