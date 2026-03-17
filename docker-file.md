# Dockerfile গুলোর ব্যাখ্যা

## backend/Dockerfile

`FROM node:18-alpine`
```

Base image। এই image এর উপরে বাকি সব তৈরি হবে।
```
`node:18-alpine`
  │    │    │
  │    │    └── alpine = Linux এর সবচেয়ে ছোট version (~5MB)
  │    │        Regular Ubuntu ~200MB, Alpine ~5MB
  │    └── Node.js version 18
  └── Official Node.js image

alpine use করার কারণ: image size ছোট রাখা। Production এ ছোট image = fast deploy।

`WORKDIR /app`
```

Container এর ভেতরে working directory set করা।
```
এটা না দিলে সব files root (/) এ যাবে — messy
এটা দিলে সব কিছু /app এ থাকবে — clean

এরপর থেকে সব command /app এর ভেতরে run হবে।


`COPY package*.json ./`
```

**শুধু** `package.json` আর `package-lock.json` আগে copy করা হচ্ছে। পুরো folder নয়।

কেন আলাদা করে? Docker cache এর জন্য:
```
package.json না বদলালে → npm install আবার চালাবে না → Fast build ✅
package.json বদলালে → npm install আবার চালাবে → Correct ✅

`RUN npm install`

Dependencies install করা। এই layer টা cache হয়ে যায়। পরেরবার package.json না বদলালে এটা skip হবে।

`COPY . .`

বাকি সব files copy করা। প্রথম . মানে host এর current folder, দ্বিতীয় . মানে container এর current folder (WORKDIR = /app)।

package.json আগে copy করার কারণেই এটা আলাদা। Code change করলে শুধু এই layer rebuild হবে, npm install আবার চালাতে হবে না।

`EXPOSE 5000`

Documentation এর জন্য — বলছে এই container 5000 port use করে। কিন্তু এটা শুধু informational, actual port mapping docker-compose.yml এর ports এ হয়।

`CMD ["node", "index.js"]`
```

Container চালু হলে এই command run হবে।
```
["node", "index.js"]
   │        │
   │        └── যে file চালাবে
   └── command

Array format use করা হয় কারণ এটা direct OS command হিসেবে চলে, shell এর মধ্যে দিয়ে না।


## frontend/Dockerfile

`FROM node:20-alpine`
Frontend এ Node 20 দরকার কারণ নতুন Vite Node 18 support করে না।

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

Backend এর মতোই, পার্থক্য শুধু:
- Port 5173 (Vite এর default)
- `CMD ["npm", "run", "dev"]` — `package.json` এর `dev` script চালায় যেটা `vite --host` run করে

`--host` flag না থাকলে Vite শুধু container এর ভেতরে accessible হত। `--host` দিলে বাইরে থেকেও access করা যায়।

---

## সব একসাথে Flow
```
docker compose up --build

১. Docker docker-compose.yml পড়ে

২. Images তৈরি করে:
   - backend/Dockerfile → todo-app-backend image
   - frontend/Dockerfile → todo-app-forntend image
   - mongo:6 → Docker Hub থেকে নামায়

৩. Network তৈরি করে:
   - todo-net (custom bridge)

৪. Volume তৈরি করে:
   - mongodata

৫. Containers চালু করে (depends_on অনুযায়ী):
   mongodb → backend → frontend

৬. তুমি localhost:5173 খুললে:
   Browser → Vite (frontend) → proxy → Express (backend) → MongoDB
