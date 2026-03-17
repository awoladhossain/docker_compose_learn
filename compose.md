# 🐳 docker-compose.yml — সম্পূর্ণ গাইড

---

## 📌 Blueprint vs. Reality

> `docker-compose.yml` হলো একটা **blueprint** বা **নকশা**।
>
> এই file পড়ে Docker বোঝে:
> - কতগুলো container চালাতে হবে
> - কোন image বা Dockerfile থেকে বানাতে হবে
> - কোন port এ চলবে
> - কীভাবে একে অপরের সাথে কথা বলবে
> - Data কোথায় রাখবে

---

## 🔢 Version — `version: '3.8'`

```yaml
version: '3.8'
```

> এটা বলছে: "এই file টা Docker Compose এর 3.8 format এ লেখা।"

> **কেন দরকার?**
> - Docker Compose বিভিন্ন সময়ে বিভিন্ন features add করেছে।
> - Version দেখে Docker বোঝে কোন features available।
> - `3.8` এখন পর্যন্ত সবচেয়ে stable এবং common।

> ⚠️ **নতুন Docker এ নোট:** এটা এখন technically optional হয়ে গেছে, তাই warning দেখায়:
> ```
> the attribute `version` is obsolete
> ```
> তবে clarity এর জন্য লেখা ভালো।

---

## 📦 Services — Containers define করা

```yaml
services:
```

> এই keyword এর নিচে সব containers define করা হয়। প্রতিটা entry = একটা container।

```yaml
services:
  mongodb:      ← Container 1 (Database)
  backend:      ← Container 2 (API Server)
  frontend:     ← Container 3 (React App)
```

> **কেন services দিতে হয়?**
> - একটা আধুনিক app একটি single দিয়ে চলে না
> - Database, Backend, Frontend — তিনটা আলাদা পার্ট লাগে
> - একটা keyword `services` দিয়ে সব একসাথে manage করা যায়

---

## 🍃 Tier 3: MongoDB Service

```yaml
mongodb:
  image: mongo:6
  container_name: todo-mongodb
  volumes:
    - mongodata:/data/db
  networks:
    - todo-net
  restart: always
```

---

### 🏷️ `mongodb:` — Service এর নাম

> এটা service এর **নাম**। এই নামটা দুটো কাজ করে:

> **१. অন্য containers এই নামে তাকে চিনবে:**
> backend এ লেখা আছে `mongodb://mongodb:27017` — এখানে `mongodb` মানে এই service এর নাম।

> **२. Docker একটা internal DNS তৈরি করে:**
> `mongodb` লিখলে Docker নিজেই বুঝে নেয় কোন container এর IP।

---

### 📥 `image: mongo:6` — Blueprint নির্বাচন

```yaml
image: mongo:6
         │    │
         │    └── Version tag (6 = MongoDB 6.0)
         └── Image এর নাম (Docker Hub এ আছে)
```

> এই line বলছে: "Docker Hub থেকে MongoDB এর version 6 এর official image নামাও।"

> **`image` vs `build` পার্থক্য:**
>
> | Key | মানে | কখন |
> |-----|------|------|
> | `image: mongo:6` | Docker Hub থেকে নামাও (ready-made) | Official images এ |
> | `build: ./backend` | নিজে Dockerfile দিয়ে বানাও (custom) | নিজস্ব কোড এ |

> এখানে `build` নেই কারণ আমরা নিজেরা MongoDB বানাচ্ছি না — MongoDB এর ready-made official image use করছি।

---

### 🏷️ `container_name: todo-mongodb` — Custom নাম

> Docker automatically container এর নাম দেয় এরকম: `todo-app_mongodb_1`

> `container_name` দিয়ে নিজে নাম দিলে সেটা use হয়। এতে সুবিধা:

> **নাম না দিলে:**
> ```bash
> docker logs todo-app_mongodb_1
> ```

> **নাম দিলে:**
> ```bash
> docker logs todo-mongodb   ← সহজ!
> ```

---

### 💾 `volumes:` — Data Persistence

```yaml
volumes:
  - mongodata:/data/db
```

এটা দুটো জিনিসকে connect করছে:

```
mongodata          :/data/db
    │                   │
    │                   └── Container এর ভেতরে MongoDB যেখানে data রাখে
    └── নিচে declare করা Named Volume
```

> **MongoDB data management:**
> - MongoDB সব data `/data/db` তে রাখে
> - এটা volume এর সাথে connect করা মানে:
>   - Container delete হলো → MongoDB এর data গেল না ✅
>   - আবার container চালালো → আগের সব data ফিরে পাবে ✅

> **Volume ছাড়া কী হতো:**
> ```
> Container delete = সব data গেল 💀
> ```

---

### 🌐 `networks:` — কন্টেইনার সংযোগ

```yaml
networks:
  - todo-net
```

> এই container টাকে `todo-net` নামের network এ রাখা হলো।

```
todo-net network:
┌──────────────────────────┐
│  mongodb  backend        │
│  (একে অপরকে চেনে)       │
└──────────────────────────┘
```

> **Same network এ না থাকলে:**
> - Containers একে অপরকে চিনতে পারত না
> - Backend `mongodb` নামে connect করতে পারত না

---

### 🔄 `restart: always` — Self-Healing

```yaml
restart: always
```

> MongoDB crash করলে বা Docker restart হলে কী করবে তা বলছে।

> **Restart policies:**

| Policy | মানে | ব্যবহার |
|--------|------|---------|
| `always` | যেকোনো কারণে বন্ধ হলে আবার চালু করো | Database, critical services |
| `on-failure` | শুধু error এ বন্ধ হলে চালু করো | App errors |
| `unless-stopped` | manually বন্ধ না করলে সবসময় চালু রাখো | Long-running services |
| `"no"` | কখনো restart করো না | Testing, temporary |

> MongoDB কে `always` দেওয়া হয়েছে কারণ **database সবসময় available থাকা দরকার।**

---

## ⚙️ Tier 2: Backend Service

```yaml
backend:
  build: ./backend
  container_name: todo-backend
  ports:
    - "5000:5000"
  environment:
    - MONGO_URL=mongodb://mongodb:27017/tododb
    - PORT=5000
  volumes:
    - ./backend:/app
    - /app/node_modules
  depends_on:
    - mongodb
  networks:
    - todo-net
  restart: on-failure
```

---

### 🏗️ `build: ./backend` — নিজস্ব image তৈরি

```yaml
build: ./backend
          │
          └── এই folder এ Dockerfile খুঁজবে
              ~/todo-app/backend/Dockerfile
```

> `./backend` folder এর Dockerfile দিয়ে image build করবে।

> **Process:**
> 1. Dockerfile পড়ে
> 2. Instructions অনুযায়ী image তৈরি করে
> 3. Container চালু করে

---

### 🔌 `ports:` — Port mapping

```yaml
ports:
  - "5000:5000"
```

এটা port mapping:

```
"5000:5000"
  │     │
  │     └── Container এর port (Express এই port এ চলে)
  └── তোমার PC এর port (browser থেকে এই port এ access)
```

> **এর কাজ:**
> ```
> তুমি → localhost:5000 → Docker → container:5000 → Express
> ```

> **এটা ছাড়া:**
> - তুমি `localhost:5000` দিয়ে access করতে পারতে না
> - Container isolated, port map না করলে বাইরে থেকে ঢোকা যায় না

> **Custom port example:**
> ```yaml
> ports:
>   - "8080:5000"   # Host এ 8080, container এর 5000
> ```

---

### 🌍 `environment:` — Environment Variables

```yaml
environment:
  - MONGO_URL=mongodb://mongodb:27017/tododb
  - PORT=5000
```

> Container এর ভেতরে environment variables set করা। `index.js` এ এগুলো `process.env.MONGO_URL` দিয়ে পড়া হয়।

> **MONGO_URL এ `mongodb` হলো MongoDB service এর নাম:**
> ```
> mongodb://mongodb:27017/tododb
>            │       │      │
>            │       │      └── Database এর নাম
>            │       └── Port
>            └── Service এর নাম (Docker DNS resolve করবে)
> ```

> **Docker automatically করে দেয়:**
> ```
> mongodb → সেই container এর IP তে translate
> ```

---

### 💾 `volumes:` — File synchronization

```yaml
volumes:
  - ./backend:/app
  - /app/node_modules
```

**Line 1: `./backend:/app` — Bind Mount**

```
./backend (তোমার PC)  ←→  /app (container এর ভেতরে)
```

> তুমি `backend/index.js` edit করলে container এর `/app/index.js` সাথে সাথে বদলে যাবে। Development এ live reload এর জন্য।

**Line २: `/app/node_modules` — Anonymous Volume**

এটা একটু tricky। উপরের line এর কারণে একটা সমস্যা হয়:

```
./backend:/app করলে:
Host এর backend folder → Container এর /app
                         সব কিছু যায়...

কিন্তু host এ node_modules এ NAMI!
তাহলে container এর /app/node_modules override হয়ে মুছে যাবে 💀
```

> `/app/node_modules` লেখার মানে হলো:
> - এই folder টাকে bind mount থেকে বাদ রাখো
> - Container নিজে এখানে যা install করেছে সেটা থাকবে

---

### 🔗 `depends_on:` — Order of startup

```yaml
depends_on:
  - mongodb
```

> Backend start হওয়ার আগে MongoDB container start হবে।

> **depends_on ছাড়া:**
> ```
> MongoDB, Backend একসাথে start
> → Backend connect করতে গিয়ে MongoDB পায় না
> → Error 💥
> ```

> **depends_on দিলে:**
> ```
> MongoDB আগে start
> → তারপর Backend start
> → Connect হয় ✅
> ```

> ⚠️ **একটা সীমাবদ্ধতা:**
> - `depends_on` শুধু container start হওয়া নিশ্চিত করে
> - MongoDB সম্পূর্ণ ready হতে ૩-५ সেকেন্ড লাগতে পারে
> - তাই `index.js` এ retry logic লেখা আছে

---

### 🌐 `networks:` — Network membership

```yaml
networks:
  - todo-net
```

> Backend কেও `todo-net` এ রাখা হলো। MongoDB আর Backend একই network এ, তাই কথা বলতে পারবে।

---

### 🔄 `restart: on-failure` — Error handling

```yaml
restart: on-failure
```

> শুধু error এ crash হলে restart। Backend manually বন্ধ করলে restart করবে না।

---

## ⚛️ Tier 1: Frontend Service

```yaml
frontend:
  build: ./frontend
  container_name: todo-frontend
  ports:
    - "5173:5173"
  volumes:
    - ./frontend:/app
    - /app/node_modules
  depends_on:
    - backend
  networks:
    - todo-net
  restart: on-failure
```

---

### 🔌 `ports: "5173:5173"` — Vite port

```yaml
ports:
  - "5173:5173"
```

> তুমি → localhost:5173 → Docker → container:5173 → Vite dev server

> Vite এর default port হলো 5173।

---

### 💾 `volumes:` — Backend এর মতোই

> - `./frontend:/app` = Live reload এর জন্য bind mount
> - `/app/node_modules` = Host এর packages override না করার জন্য

---

### 🔗 `depends_on: - backend`

> Frontend চালু হওয়ার আগে Backend চালু হবে।

> **Startup order:**
> ```
> mongodb → backend → frontend
> ```

---

## 💾 Volumes — পুরো ব্যাখ্যা

```yaml
volumes:
  mongodata:
```

> **Named Volume declare করা হচ্ছে।** Service এ `mongodata:/data/db` use করার আগে এখানে declare করতে হয়।

> **JavaScript analogy:**
> ```javascript
> // আগে declare করতে হয়
> const myVariable;
>
> // তারপর use করতে পারো
> myVariable = "hello";
> ```

> **Docker ও একই:**
> - আগে বলতে হবে "এই নামে একটা volume আছে"
> - তারপর service এ use করতে পারবে

### Volume এর structure

```yaml
volumes:
  mongodata:
    driver: local        # এটা default
    driver_opts: {}      # এটাও default
```

> শুধু নাম লিখলেই হয়, Docker বাকিটা করে। তাই শুধু `mongodata:` লিখলেই চলে।

### Host এ physically কোথায় থাকে?

```
/var/lib/docker/volumes/todo-app_mongodata/_data/
```

> Docker নিজে manage করে, তোমাকে কিছু করতে হয় না।

---

## 🌐 Networks — পুরো ব্যাখ্যা

```yaml
networks:
  todo-net:
    driver: bridge
```

### Bridge driver — কেন এটা?

> Docker এ ४ ধরনের network drivers আছে, কিন্তু bridge ই সবসময় use করো।

| Driver | কাজ | ব্যবহার |
|--------|-----|---------|
| `bridge` | একই machine এর containers connect | ✅ 99% কাজ |
| `host` | Host network directly use | Special cases |
| `overlay` | ভিন্ন machines এর containers | Kubernetes |
| `none` | কোনো network নেই | Testing |

### Custom bridge — কেন নিজে তৈরি করি?

Default bridge:
```
❌ DNS নেই → IP দিয়ে connect করতে হয়
❌ IP change হলে সব ভাঙে
❌ সব containers একসাথে, isolation নেই
```

Custom bridge (todo-net):
```
✅ DNS আছে → "mongodb" লিখলেই হয়
✅ IP change হলে কিছু হয় না, নাম কাজ করে
✅ শুধু same network এর containers কথা বলতে পারে
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
    (5000:5000, 5173:5173)
```

### Bridge এর ३ কাজ

> **१. Isolation:**
> todo-net এর বাইরের containers এদের দেখতে পাবে না

> **२. DNS (নাম দিয়ে চেনা):**
> backend থেকে "mongodb" লিখলেই connect হয়, IP মনে রাখতে হয় না

> **३. Internal Communication:**
> mongodb port 27017 বাইরে expose না করেও backend সেটা access করতে পারে

---

## 📊 সব Components এর সম্পর্ক

```
┌─────────────────────────────────────────┐
│  docker-compose.yml                     │
├─────────────────────────────────────────┤
│ version: '3.8'                          │
│                                         │
│ services:                               │
│  ├─ mongodb (image)                     │
│  ├─ backend (build)                     │
│  └─ frontend (build)                    │
│                                         │
│ volumes:                                │
│  └─ mongodata (Named Volume)            │
│                                         │
│ networks:                               │
│  └─ todo-net (Custom Bridge)            │
└─────────────────────────────────────────┘
```

---

## 🚀 সবকিছু একসাথে কাজ করে

```bash
docker compose up --build
```

যা ঘটে:

> **१. Docker file পড়ে** — version, services, volumes, networks

> **२. Images build/download করে:**
> - backend/Dockerfile → custom image
> - frontend/Dockerfile → custom image
> - mongo:6 → Docker Hub থেকে

> **३. Network তৈরি করে:**
> - todo-net (bridge driver)

> **④. Volume তৈরি করে:**
> - mongodata (Host এ store হয়)

> **५. Containers চালু করে (depends_on অনুযায়ী):**
> - mongodb ১ম
> - backend ২য়
> - frontend ३য়

> **६. Port expose করে:**
> - localhost:5000 → backend
> - localhost:5173 → frontend

> **७. DNS setup করে:**
> - "mongodb", "backend", "frontend" নাম resolve হয়
