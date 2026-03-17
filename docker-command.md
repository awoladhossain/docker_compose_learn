# 🐳 Docker Commands — সম্পূর্ণ গাইড

---

## 📋 Container দেখো — `docker ps`

```bash
docker ps
```

**Output:**
```
CONTAINER ID   IMAGE           COMMAND                  CREATED         STATUS         PORTS                    NAMES
a1b2c3d4e5f6   todo-backend    "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:5000->5000/tcp   todo-backend
b2c3d4e5f6a1   mongo:6         "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   27017/tcp                todo-mongodb
```

---

### Container এর variables দেখো

| কমান্ড | মানে |
|---------|------|
| `docker ps` | শুধু চলমান containers |
| `docker ps -a` | বন্ধ সহ সব containers |
| `docker ps -q` | শুধু container ID (চলমান) |
| `docker ps -aq` | সব containers এর ID (বন্ধ সহ) |

---

## 📝 Logs দেখো — `docker logs`

```bash
docker logs todo-backend
```

### Log এর options

| কমান্ড | মানে |
|---------|------|
| `docker logs todo-backend` | সব logs একবারে |
| `docker logs -f todo-backend` | Live follow (নতুন log আসলে দেখাবে) |
| `docker logs --tail 20 todo-backend` | শেষ ২০ লাইন |
| `docker logs --tail 20 -f todo-backend` | শেষ ২০ লাইন + live follow |
| `docker logs -t todo-backend` | Timestamp সহ |

> **কখন use করবে:**
> - App crash করেছে কেন? → `docker logs container_name`
> - MongoDB connect হচ্ছে না কেন? → `docker logs todo-backend`
> - Live request দেখতে চাও? → `docker logs -f todo-backend`

---

## 🔧 Container এ ঢোকো — `docker exec`

```bash
docker exec -it todo-backend sh
```

এখন container এর ভেতরে আছো:
```bash
ls /app
cat /app/index.js
node --version
exit   # বেরিয়ে আসো
```

---

### Shell না খুলে সরাসরি command চালাও

```bash
docker exec todo-backend node --version
docker exec todo-backend ls /app
docker exec todo-backend cat /app/package.json
```

> **`-it` মানে:**
> - `-i` = interactive (input দিতে পারবে)
> - `-t` = tty (terminal এর মতো দেখাবে)

---

## 🔍 Container এর details — `docker inspect`

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

---

## ⏸️ Container manage করো

### বন্ধ করো (gracefully)
```bash
docker stop todo-backend
```

### চালু করো
```bash
docker start todo-backend
```

### Restart করো
```bash
docker restart todo-backend
```

### একসাথে অনেক containers
```bash
docker stop todo-backend todo-frontend todo-mongodb
```

### Delete করো (আগে বন্ধ করতে হবে)
```bash
docker stop todo-backend
docker rm todo-backend
```

### Force delete (container চলছে তাও)
```bash
docker rm -f todo-backend
```

### সব বন্ধ containers delete
```bash
docker container prune
```

### চলমান সহ সব delete ⚠️ সাবধানে!
```bash
docker rm -f $(docker ps -aq)
```

---

## 🖼️ Images manage করো

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

### সব unused images delete ⚠️
```bash
docker image prune -a
```

---

## 💾 Volumes manage করো

### সব volumes দেখো
```bash
docker volume ls
```

### Volume details দেখো
```bash
docker volume inspect todo-app_mongodata
```

### Volume delete করো
```bash
docker volume rm todo-app_mongodata
```

### Unused volumes delete
```bash
docker volume prune
```

---

## 🧹 সব কিছু clean করো

### সব unused জিনিস একসাথে delete
**stopped containers, unused networks, dangling images**
```bash
docker system prune
```

### Volumes সহ সব unused delete ⚠️ সাবধানে! Data যাবে
```bash
docker system prune -a --volumes
```

### Docker কত জায়গা নিচ্ছে দেখো
```bash
docker system df
```

---

## 🐳 Docker Compose Commands

### Build করে চালু করো
```bash
docker compose up --build
```

### Background এ চালু করো
```bash
docker compose up -d
```

### Background এ build করে চালু করো
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

### Restart করো
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

### Cache ছাড়া build করো
```bash
docker compose build --no-cache
```

---

## 📝 docker-compose.yml — Volumes Configuration

### জায়গা ১ — Service এর ভেতরে use করা
```yaml
services:
  mongodb:
    volumes:
      - mongodata:/data/db    ← "USE করছি"
```

### জায়গা २ — নিচে top-level declare করা
```yaml
volumes:
  mongodata:                  ← "DECLARE করছি"
```

> **JavaScript এর মতো:**
> ```javascript
> // আগে declare করতে হয়
> const myVariable;
>
> // তারপর use করতে পারো
> myVariable = "hello";
> ```
>
> Docker ও same। আগে বলতে হবে "এই নামে একটা volume আছে", তারপর service এ use করতে পারবে।

### Error না পেতে এটা দিতেই হবে:
```
service "mongodb" refers to undefined volume mongodata
```

### `mongodata:` এর পরে কিছু না থাকলে?

```yaml
volumes:
  mongodata:
    driver: local        # এটা default, না লিখলেও same
    driver_opts: {}      # এটাও default
```

> শুধু নাম লিখলে Docker নিজে সব default দিয়ে তৈরি করে। তাই শুধু `mongodata:` লিখলেই চলে।

### Host এ physically কোথায় থাকে?
```
/var/lib/docker/volumes/todo-app_mongodata/_data/
```

> Docker নিজে manage করে, তোমাকে কিছু করতে হয় না।

---

## 🌐 docker-compose.yml — Networks Configuration

### জায়গা १ — Service এর ভেতরে
```yaml
services:
  mongodb:
    networks:
      - todo-net    ← "এই network এ রাখো"
```

### জায়গা २ — নিচে top-level declare করা
```yaml
networks:
  todo-net:         ← "এই নামে network declare করছি"
    driver: bridge
```

---

## 🔗 Network Drivers — কোনটা use করবো?

Docker এ ४ ধরনের network driver আছে:

| Driver | ব্যবহার |
|--------|---------|
| `bridge` | একই machine এর containers connect করে (99% কাজে এটাই) |
| `host` | Container host এর network directly use করে |
| `overlay` | আলাদা আলাদা machine এর containers connect করে (Kubernetes) |
| `none` | কোনো network নেই, সম্পূর্ণ isolated |

> তুমি bridge লিখেছো, এটাই সঠিক এবং default ও।

### explicit লিখবে নাকি না লিখবে?

```yaml
# এটা লিখলে
networks:
  todo-net:
    driver: bridge

# এটা না লিখলেও same, bridge default
networks:
  todo-net:
```

> **Clarity এর জন্য explicitly লিখো।** কেউ file দেখলে বুঝবে কোন driver use হচ্ছে।

---

## 🌉 Bridge Network — আসলে কী?

**Real life analogy:**

```
তোমার বাড়িতে WiFi router আছে।
Phone, Laptop, TV সব router এর সাথে connect।
এরা নিজেদের মধ্যে কথা বলতে পারে।
বাইরের কেউ directly ঢুকতে পারে না।

Bridge Network = এই WiFi router
Containers = Phone, Laptop, TV
```

### Network Diagram

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

### Bridge এর কাজ ३টা

့ **१. Isolation:**
> todo-net এর বাইরের containers এদের দেখতে পাবে না

> **२. DNS (নাম দিয়ে চেনা):**
> backend থেকে "mongodb" লিখলেই connect হয়, IP মনে রাখতে হয় না

> **३. Internal Communication:**
> mongodb port 27017 বাইরে expose না করেও backend সেটা access করতে পারে

---

## 🔄 Default Bridge vs Custom Bridge

| Feature | Default Bridge | Custom Bridge |
|---------|---|---|
| DNS | ❌ নেই | ✅ আছে |
| নাম দিয়ে connect | ❌ হয় না | ✅ হয় (mongodb লিখলেই) |
| IP বদলালে | ❌ সব ভাঙে | ✅ কিছু হয় না |
| Isolation | ❌ নেই | ✅ আছে |

> **তাই সবসময় custom network তৈরি করো।** এটাই best practice।
