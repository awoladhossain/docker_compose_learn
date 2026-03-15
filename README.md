# 📝 Todo App — React + Node.js + MongoDB + Docker

একটি সম্পূর্ণ 3-Tier Todo Application যেটা Docker Compose দিয়ে চালানো হয়।

---

## 🏗️ Architecture

```
Browser
  │
  ▼
React Frontend (port 5173)   ← User যা দেখে
  │  API Call (/api/...)
  ▼
Node.js + Express (port 5000) ← Business Logic
  │  Database Query
  ▼
MongoDB (port 27017)          ← Data Storage
```

---

## 📁 Project Structure

```
todo-app/
│
├── docker-compose.yml        ← সব services একসাথে manage করে
│
├── backend/
│   ├── Dockerfile            ← Backend এর image তৈরির instructions
│   ├── package.json          ← Node.js dependencies
│   └── index.js              ← Express API server
│
└── frontend/
    ├── Dockerfile            ← Frontend এর image তৈরির instructions
    ├── package.json          ← React + Vite dependencies
    ├── vite.config.js        ← Vite configuration + API proxy
    └── src/
        ├── main.jsx          ← React entry point
        └── App.jsx           ← Todo UI component
```

---

## 🐳 docker-compose.yml — লাইন বাই লাইন ব্যাখ্যা

```yaml
version: '3.8'
```
> Docker Compose file এর version। `3.8` সবচেয়ে stable এবং widely used।
> নতুন Docker এ এটা obsolete, তাই warning দেখায় — কিন্তু কাজ করে।
> Remove করলে warning চলে যায়।

---

```yaml
services:
```
> এখান থেকে সব containers define করা হয়।
> প্রতিটা `service` = একটা container।

---

### 🍃 MongoDB Service

```yaml
  mongodb:
    image: mongo:6
```
> `image: mongo:6` মানে Docker Hub থেকে MongoDB version 6 এর official image নামাবে।
> এখানে `build` নেই কারণ আমরা নিজেরা Dockerfile লিখিনি — ready-made image use করছি।

```yaml
    container_name: todo-mongodb
```
> Container এর নাম manually দিলাম। না দিলে Docker automatically দেয়: `todo-app_mongodb_1`
> নাম দিলে `docker logs todo-mongodb` এভাবে সহজে access করা যায়।

```yaml
    volumes:
      - mongodata:/data/db
```
> `mongodata` হলো একটা **Named Volume**।
> `/data/db` হলো MongoDB container এর ভেতরে যেখানে data রাখে।
> এই mapping মানে: MongoDB যা data save করবে, সেটা `mongodata` volume এ যাবে।
> Container delete করলেও data থাকবে কারণ Volume আলাদাভাবে থাকে।

```yaml
    networks:
      - todo-net
```
> এই container টাকে `todo-net` network এ রাখা হলো।
> Same network এ থাকা অন্য containers এটাকে `mongodb` নামে চিনবে।

```yaml
    restart: always
```
> যদি কোনো কারণে MongoDB crash করে বা Docker restart হয়, এটা automatically আবার চালু হবে।

---

### ⚙️ Backend Service

```yaml
  backend:
    build: ./backend
```
> `build` মানে Docker Hub থেকে নামাবে না, বরং `./backend` folder এর Dockerfile দিয়ে নিজে image build করবে।

```yaml
    container_name: todo-backend
    ports:
      - "5000:5000"
```
> `"5000:5000"` মানে `host_port:container_port`।
> তোমার PC এর 5000 port → Container এর 5000 port এ forward হবে।
> তাই browser থেকে `localhost:5000` দিয়ে backend access করা যায়।

```yaml
    environment:
      - MONGO_URL=mongodb://mongodb:27017/tododb
      - PORT=5000
```
> Container এর ভেতরে environment variable set করা।
> `MONGO_URL` এ `mongodb` হলো MongoDB container এর **service name**।
> Docker automatically DNS resolve করে — মানে `mongodb` লিখলেই সে বুঝবে কোন container।
> IP address মনে রাখতে হয় না!

```yaml
    volumes:
      - ./backend:/app
```
> **Bind Mount**: তোমার PC এর `./backend` folder → Container এর `/app` folder।
> তুমি `backend/index.js` edit করলে Container এও সাথে সাথে reflect হবে।
> এটা development এ কাজে লাগে — code change করলে আবার build করতে হয় না।

```yaml
      - /app/node_modules
```
> এটা একটু tricky। উপরের bind mount এর কারণে host এর `./backend` folder container এর `/app` এ map হয়।
> কিন্তু host এ `node_modules` না থাকলে container এর `node_modules` ও মুছে যাবে!
> এই line টা বলছে: `/app/node_modules` কে bind mount থেকে আলাদা রাখো।
> Container এর নিজের `node_modules` intact থাকবে।

```yaml
    depends_on:
      - mongodb
```
> Backend container start হওয়ার আগে MongoDB container start হবে।
> ⚠️ সতর্কতা: এটা শুধু container START হওয়া নিশ্চিত করে।
> MongoDB সম্পূর্ণ ready হতে কয়েক সেকেন্ড লাগতে পারে।
> তাই `index.js` এ retry logic লেখা আছে।

```yaml
    networks:
      - todo-net
    restart: on-failure
```
> `on-failure` মানে শুধু error হলে restart করবে। Manually বন্ধ করলে restart করবে না।

---

### ⚛️ Frontend Service

```yaml
  frontend:
    build: ./frontend
```
> `./frontend` folder এর Dockerfile দিয়ে image build করবে।

```yaml
    container_name: todo-frontend
    ports:
      - "5173:5173"
```
> Browser থেকে `localhost:5173` দিয়ে React app access করা যাবে।

```yaml
    volumes:
      - ./frontend:/app
      - /app/node_modules
```
> Backend এর মতোই — live code reload এর জন্য bind mount।
> `node_modules` আলাদা রাখা হয়েছে যাতে container এর install করা packages নষ্ট না হয়।

```yaml
    depends_on:
      - backend
```
> Frontend চালু হওয়ার আগে Backend container start হবে।

```yaml
    networks:
      - todo-net
    restart: on-failure
```

---

### 💾 Volumes (top level)

```yaml
volumes:
  mongodata:
```
> এখানে Named Volume declare করতে হয়।
> শুধু নাম লিখলেই হয় — Docker বাকিটা manage করে।
> এটা না লিখলে service এ `mongodata:` use করলে error আসবে।
> Host এ physically থাকে: `/var/lib/docker/volumes/todo-app_mongodata/`

---

### 🌐 Networks (top level)

```yaml
networks:
  todo-net:
```
> Custom bridge network declare করা।
> এই network এ থাকা সব containers নিজেদের **নাম দিয়ে** চিনতে পারে।
> যেমন: backend থেকে `mongodb://mongodb:27017` লিখলেই MongoDB পাওয়া যায়।
> আলাদা network এ থাকলে এই DNS কাজ করত না।

---

## 🔄 কীভাবে কাজ করে — Flow

```
1. docker compose up --build

2. Docker তিনটা container চালু করে:
   mongodb → backend → frontend (depends_on অনুযায়ী)

3. MongoDB ready হলে Backend connect করে (retry logic দিয়ে)

4. Browser এ localhost:5173 খুললে:
   React app লোড হয়

5. Todo add করলে:
   React → fetch('/api/todos') POST
        ↓
   Vite proxy → backend:5000/api/todos
        ↓
   Express → MongoDB তে save
        ↓
   Response → React UI update
```

---

## ❌ যে সমস্যাগুলো হয়েছিল এবং কেন

### সমস্যা ১: External Drive এ Bind Mount কাজ করেনি

**Error:**
```
The path /media/awolad/MEDIA1.1/todo-app/backend is not shared from the host
```

**কারণ:** Docker by default শুধু home directory (`/home/...`) access করতে পারে।
External drive বা mount point এ Docker এর permission থাকে না।

**Solution:** Project home directory তে রাখো।
```bash
cp -r /media/.../todo-app ~/todo-app
cd ~/todo-app
```

---

### সমস্যা ২: Vite + Node 18 Incompatibility

**Error:**
```
You are using Node.js 18.20.8.
Vite requires Node.js version 20.19+ or 22.12+
TypeError: crypto.hash is not a function
```

**কারণ:** `package.json` এ Vite এর latest version ছিল।
নতুন Vite এর কিছু feature Node 20+ এ introduce হয়েছে।
`frontend/Dockerfile` এ `node:18-alpine` ছিল, তাই conflict হলো।

**Solution:** `frontend/Dockerfile` এ Node version upgrade করো।
```dockerfile
# আগে
FROM node:18-alpine

# পরে
FROM node:20-alpine
```

---

### সমস্যা ৩: Docker Cache এর কারণে Fix কাজ করেনি

**কী হয়েছিল:** Dockerfile এ `node:20-alpine` লেখার পরেও একই error।

**কারণ:** Docker আগের build cache করে রাখে।
`CACHED [forntend 4/5] RUN npm install` — এই line দেখলেই বোঝা যায় পুরানো cache use হচ্ছে।
নতুন Dockerfile পড়েনি, পুরানো cached layer use করেছে।

**Solution:** Cache clear করে fresh build।
```bash
sed -i 's/node:18-alpine/node:20-alpine/' ~/todo-app/frontend/Dockerfile
docker rmi todo-app-forntend
docker compose build --no-cache frontend
docker compose up
```

---

## 🚀 Project চালানোর Steps

```bash
# ১. Home directory তে project রাখো (IMPORTANT)
cd ~/todo-app

# ২. Build করে চালাও
docker compose up --build

# ৩. Browser এ যাও
# http://localhost:5173
```

---

## 🛠️ কাজে লাগার Commands

```bash
# চালু করো (background)
docker compose up -d --build

# বন্ধ করো
docker compose down

# বন্ধ করো + data মুছো
docker compose down -v

# Logs দেখো
docker compose logs -f

# শুধু backend এর logs
docker compose logs -f backend

# Container এ ঢোকো
docker compose exec backend sh
docker compose exec frontend sh

# MongoDB shell এ ঢোকো
docker compose exec mongodb mongosh
use tododb
db.todos.find()

# Running containers দেখো
docker compose ps

# Cache ছাড়া rebuild
docker compose build --no-cache
```

---

## 📌 গুরুত্বপূর্ণ Notes

| বিষয় | কারণ |
|-------|-------|
| Project অবশ্যই `~/` এ রাখতে হবে | Docker bind mount শুধু home directory support করে |
| Frontend Dockerfile এ `node:20-alpine` | Vite latest version Node 20+ চায় |
| `vite.config.js` এ proxy লাগে | Browser সরাসরি `backend` নাম চেনে না, Vite proxy হিসেবে কাজ করে |
| Backend এ retry logic আছে | `depends_on` container start নিশ্চিত করে, কিন্তু MongoDB ready হতে সময় লাগে |
| `/app/node_modules` volume লাগে | Bind mount `node_modules` overwrite করে ফেলে, এটা বাঁচায় |
