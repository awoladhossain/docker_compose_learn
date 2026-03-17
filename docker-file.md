# 🐳 Dockerfile গুলোর ব্যাখ্যা

---

## 🔧 backend/Dockerfile

```dockerfile
FROM node:18-alpine
```
> Base image। এই image এর উপরে বাকি সব তৈরি হবে।

```
node:18-alpine
  │    │    │
  │    │    └── alpine = Linux এর সবচেয়ে ছোট version (~5MB)
  │    │        Regular Ubuntu ~200MB, Alpine ~5MB
  │    └── Node.js version 18
  └── Official Node.js image
```

> **alpine use করার কারণ:** image size ছোট রাখা। Production এ ছোট image = fast deploy।

---

```dockerfile
WORKDIR /app
```
> Container এর ভেতরে working directory set করা।

> **এর মানে:**
> - এটা না দিলে সব files root (/) এ যাবে — ❌ messy
> - এটা দিলে সব কিছু /app এ থাকবে — ✅ clean

> এরপর থেকে সব command `/app` এর ভেতরে run হবে।

---

```dockerfile
COPY package*.json ./
```
> **শুধু** `package.json` আর `package-lock.json` আগে copy করা হচ্ছে। পুরো folder নয়।

> **কেন আলাদা করে?** Docker cache এর জন্য:
> - package.json না বদলালে → npm install আবার চালাবে না → ⚡ Fast build
> - package.json বদলালে → npm install আবার চালাবে → ✅ Correct

---

```dockerfile
RUN npm install
```
> Dependencies install করা। এই layer টা cache হয়ে যায়।
>
> পরেরবার package.json না বদলালে এটা skip হবে।

---

```dockerfile
COPY . .
```
> বাকি সব files copy করা।
> - প্রথম `.` = host এর current folder
> - দ্বিতীয় `.` = container এর current folder (WORKDIR = /app)

> **গুরুত্বপূর্ণ:** package.json আগে copy করার কারণেই এটা আলাদা। Code change করলে শুধু এই layer rebuild হবে, npm install আবার চালাতে হবে না।

---

```dockerfile
EXPOSE 5000
```
> Documentation এর জন্য — বলছে এই container 5000 port use করে।

> ⚠️ এটা শুধু informational, actual port mapping `docker-compose.yml` এর `ports` এ হয়।

---

```dockerfile
CMD ["node", "index.js"]
```
> Container চালু হলে এই command run হবে।

```
["node", "index.js"]
   │        │
   │        └── যে file চালাবে
   └── command
```

> **Array format ব্যবহার করা হয়** কারণ এটা direct OS command হিসেবে চলে, shell এর মধ্যে দিয়ে না।

---

## 🎨 frontend/Dockerfile

```dockerfile
FROM node:20-alpine
```
> Frontend এ Node 20 দরকার কারণ নতুন Vite Node 18 support করে না।

```dockerfile
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

> Backend এর মতোই, পার্থক্য শুধু:
> - ✅ Port **5173** (Vite এর default)
> - ✅ `CMD ["npm", "run", "dev"]` — `package.json` এর `dev` script চালায় যেটা `vite --host` run করে

> **`--host` flag এর গুরুত্ব:**
> - flag না থাকলে → Vite শুধু container এর ভেতরে accessible
> - flag থাকলে → বাইরে থেকেও access করা যায়

---

## 🔄 সব একসাথে Flow

```bash
docker compose up --build
```

> এই command চালালে যা হয়:

> **१. Docker docker-compose.yml পড়ে**

> **२. Images তৈরি করে:**
> - `backend/Dockerfile` → `todo-app-backend` image
> - `frontend/Dockerfile` → `todo-app-frontend` image
> - `mongo:6` → Docker Hub থেকে নামায়

> **३. Network তৈরি করে:**
> - `todo-net` (custom bridge network)

> **४. Volume তৈরি করে:**
> - `mongodata`

> **५. Containers চালু করে (depends_on অনুযায়ী):**
> - mongodb → backend → frontend

> **६. তুমি localhost:5173 খুললে:**
> - Browser → Vite (frontend) → proxy → Express (backend) → MongoDB
