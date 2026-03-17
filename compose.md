# Docker Compose Learn

```bash
version: '3.8'
```

ডকার কম্পোজ ফাইলের একদম শুরুতে যে `version: '3.8'` লেখা থাকে, এটি মূলত ডকার ইঞ্জিনকে বলে দেয় যে আপনি Docker Compose Specification-এর কোন সংস্করণ বা "ভার্সন" ব্যবহার করছেন।

সহজভাবে বলতে গেলে, এটি একটি নিয়মাবলী (Rulebook)। নিচে এর মূল কারণগুলো বুঝিয়ে বলছি:

1. ফিচারের প্রাপ্যতা (Feature Availability)

ডকারের প্রতিটি নতুন ভার্সনে নতুন নতুন ফিচার যোগ হয়। যেমন, ভলিউম ম্যানেজমেন্ট বা নেটওয়ার্কিংয়ের কিছু অ্যাডভান্সড ফিচার ভার্সন ৩.০-তে একরকম ছিল, আবার ৩.৮-এ আরও উন্নত হয়েছে। আপনি যখন 3.8 লিখছেন, তখন ডকার ইঞ্জিন জানে যে আপনি এই ভার্সনের সব লেটেস্ট ফিচার (যেমন: depends_on এর উন্নত লজিক বা secrets) ব্যবহার করতে পারবেন।

2. ডকার ইঞ্জিনের সাথে সামঞ্জস্য (Compatibility)

আপনার পিসিতে ইনস্টল করা ডকার ইঞ্জিনের সাথে কম্পোজ ফাইলের ভার্সন মিল থাকতে হয়। 3.8 ভার্সনটি ব্যবহার করতে হলে আপনার পিসিতে সাধারণত Docker Engine 19.03.0+ থাকা প্রয়োজন। আপনি যদি খুব পুরনো ডকার ইঞ্জিন ব্যবহার করেন এবং ভার্সন ৩.৮ লিখে ফেলেন, তবে ডকার এরর দিবে।

3. কনফিগারেশন ফরম্যাট (Syntax Format)

ডকার কম্পোজ ফাইলগুলো .yml ফরম্যাটে লেখা হয়। ভার্সন ২ এবং ভার্সন ৩ এর লেখার স্টাইলে কিছু পার্থক্য আছে। যেমন, ভার্সন ৩ মূলত Docker Swarm (স্কেলিং করার জন্য) মাথায় রেখে ডিজাইন করা হয়েছে। 3.8 হলো সেই সিরিজের একটি অত্যন্ত স্ট্যাবল এবং বহুল ব্যবহৃত ভার্সন।

### বর্তমান সময়ের আপডেট (Pro-Tip):

একটি মজার বিষয় হলো, ডকার কম্পোজের একদম লেটেস্ট আপডেট অনুযায়ী, এই version লাইনটি এখন ঐচ্ছিক (Optional) হয়ে গেছে। আপনি যদি এখনকার আধুনিক ডকার ডেক্সটপ বা ডকার ইঞ্জিন ব্যবহার করেন, তবে এই লাইনটি না লিখলেও ডকার নিজে থেকে লেটেস্ট স্পেসিফিকেশন ধরে নেয়।

তবে প্রফেশনাল প্রজেক্টে এখনও এটি লেখা হয় যাতে অন্য কোনো ডেভেলপার আপনার কোড রান করার সময় বুঝতে পারে যে এটি কোন স্ট্যান্ডার্ডে লেখা।

## Docker Service

```bash
service
```

ডকার কম্পোজ ফাইলের মূলে থাকে Hierarchy (স্তরবিন্যাস)। services: হলো সেই মূল স্তর যা ডকারকে বলে— "এখন আমি আমার অ্যাপ্লিকেশনের একেকটি অংশ বা কম্পোনেন্টকে ডিফাইন করতে যাচ্ছি।"

## কেন আমরা services: লিখি? (The Concept)

1. অংশগুলোকে আলাদা করা (Logical Grouping):

একটি আধুনিক অ্যাপ শুধু একটি কোড দিয়ে চলে না। এর ডাটাবেস লাগে, ব্যাকএন্ড লাগে, ফ্রন্টএন্ড লাগে। ডকারের ভাষায় এই একেকটি অংশকে বলা হয় Service। আপনি যখন services: লিখছেন, তখন আপনি ডকারকে বলছেন যে— "এই প্রজেক্টটি চালানোর জন্য আমার এই এই সার্ভিসগুলো লাগবে।"

2. এক কমান্ডে অনেক কিছু চালানো:

যদি services: না থাকতো, তবে আপনাকে ডাটাবেসের জন্য একটা বিশাল কমান্ড দিতে হতো, ব্যাকএন্ডের জন্য একটা, ফ্রন্টএন্ডের জন্য আরেকটা। services:-এর নিচে এগুলো সব লিখে দিলে ডকার জাস্ট একটা ফাইল পড়ে বুঝতে পারে তাকে ৩টি কন্টেইনার একসাথে হ্যান্ডেল করতে হবে।


3. Blueprint vs. Instance:

- Image হলো একটি ব্লু-প্রিন্ট।
- Service হলো ওই ব্লু-প্রিন্টের ওপর ভিত্তি করে ডকার কম্পোজ যে কনফিগারেশনটা রান করবে।
আপনি হয়তো একই ডাটাবেস ইমেজের দুটি সার্ভিস চালাতে চান (যেমন: একটি মেইন ডাটাবেস, একটি টেস্টিং ডাটাবেস)। তখন আপনি services: এর নিচে আলাদা আলাদা নাম দিয়ে তাদের ডিফাইন করতে পারবেন।

## Tier 3: Database

```bash
mongodb:
    image: mongo:6
    container_name: todo-mongodb
    volumes:
      - mongodata:/data/db
    networks:
      - todo-net
    restart: always
```

1. mongodb: (Service Identifier)

এটি হলো আপনার সার্ভিসের নাম। ডকার নেটওয়ার্কের ভেতরে এই নামটি একটি Hostname হিসেবে কাজ করে।

- Deep Insight: যখন ব্যাকএন্ড ডাটাবেসের সাথে কানেক্ট হতে চাইবে, তখন সে কোনো IP অ্যাড্রেস খুঁজবে না; সে জাস্ট mongodb নামটিকে কল করবে। ডকারের ইন্টারনাল DNS সার্ভার এই নামটিকে সঠিক কন্টেইনার আইপিতে ম্যাপ করে দেয়।

2. image: mongo:6 (The Blueprint)

এটি ডকারকে বলছে যে ডাটাবেসটি চালানোর জন্য কোন সফটওয়্যার ইমেজ ব্যবহার করতে হবে।

- `mongo`: এটি অফিশিয়াল ইমেজ যা Docker Hub থেকে ডাউনলোড হয়।
- `:6`: একে বলা হয় Tag। এটি নির্দিষ্ট করে দিচ্ছে যে আপনি মঙ্গোডিবি-র ৬ নম্বর ভার্সন ব্যবহার করবেন।

3. container_name: todo-mongodb (Custom Identity)

ডকার ডিফল্টভাবে কন্টেইনারের নাম দেয় প্রজেক্টনাম_সার্ভিসনাম_১ (যেমন: todo-app_mongodb_1)। এই লাইনটি দিয়ে আপনি সেই নামটিকে ফিক্সড করে দিচ্ছেন।

- `Deep Insight`: এটি মূলত কন্টেইনার ম্যানেজমেন্ট সহজ করার জন্য। যখন আপনি `docker ps` বা `docker logs todo-mongodb` দিবেন, তখন নামটা চেনা আপনার জন্য সহজ হবে।

4. volumes: (Data Persistence)

ডকার কন্টেইনারের ভেতরের ফাইল সিস্টেম অস্থায়ী (Ephemeral)। কন্টেইনার ডিলিট হলে ডাটাও মুছে যায়। এটি ঠেকাতেই ভলিউম ব্যবহার করা হয়।

- mongodata:/data/db: এখানে দুটি অংশ আছে।
- mongodata (Source): এটি ডকারের একটি Named Volume যা আপনার হোসট মেশিনে (উবুন্টু) সংরক্ষিত থাকে।
- /data/db (Destination): এটি মঙ্গোডিবি কন্টেইনারের ভেতরের সেই নির্দিষ্ট ফোল্ডার যেখানে মঙ্গোডিবি সব ডাটা রাইট করে।
- Deep Insight: মঙ্গোডিবি তার সব ডাটা ফাইল /data/db ডিরেক্টরিতে রাখে। আপনি যখন এই পাথটিকে আপনার ভলিউমের সাথে লিঙ্ক করে দেন, তখন কন্টেইনার মারা গেলেও আপনার ডাটা ওই ভলিউমে সুরক্ষিত থাকে। নতুন কন্টেইনার তৈরি করলে সে আবার ওই ভলিউম থেকে ডাটা লোড করে নেয়।

5. networks: (Isolation & Communication)
এটি আপনার কন্টেইনারটিকে একটি ভার্চুয়াল প্রাইভেট নেটওয়ার্কের আওতায় নিয়ে আসে।

- todo-net: এটি ডকারকে বলছে যে এই কন্টেইনারটি todo-net নামক নেটওয়ার্কের সদস্য।
- Deep Insight: ডিফল্টভাবে ডকার একটি নেটওয়ার্ক তৈরি করে, কিন্তু নিজের নেটওয়ার্ক ডিফাইন করা সিকিউরিটির জন্য ভালো। এতে শুধু সেইসব কন্টেইনার একে অপরের সাথে কথা বলতে পারবে যারা এই todo-net এর সদস্য। এটি আপনার ডাটাবেসকে বাইরের জগত থেকে আলাদা করে রাখে।

6. restart: always (Self-Healing)

এটি কন্টেইনারের জীবনকাল বা লাইফসাইকেল কন্ট্রোল করে।

- Deep Insight: যদি আপনার পিসি রিবুট হয়, বা কোনো কারণে মঙ্গোডিবি ক্র্যাশ করে, তবে ডকার ইঞ্জিন নিজে থেকেই এই কন্টেইনারটিকে আবার চালু করবে। always পলিসি মানে হলো—যতক্ষণ না আপনি নিজে ম্যানুয়ালি docker stop করছেন, ততক্ষণ ডকার এটাকে যেকোনো অবস্থায় রানিং রাখার চেষ্টা করবে।

## Backend

```bash
 # ── Tier 2: Backend ───────────────────────────
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

1. build: ./backend (The Factory)

আগে আমরা ডাটাবেসের জন্য তৈরি করা image ব্যবহার করেছিলাম, কিন্তু ব্যাকএন্ডের জন্য আমরা আমাদের নিজেদের কোড ব্যবহার করছি।

- `./backend`: এটি ডকারকে বলে আপনার পিসির কোন ফোল্ডারে Dockerfile আছে। ডকার সেই ফোল্ডারে গিয়ে আপনার ইনস্ট্রাকশন অনুযায়ী একটি কাস্টম ইমেজ তৈরি করে নেবে।
- `Deep Insight`: এটি রান-টাইমের কাজ নয়, এটি বিল্ড-টাইমের কাজ। ডকার আপনার কোড, package.json এবং ডিপেন্ডেন্সিগুলো নিয়ে একটি "প্যাকেট" তৈরি করে ফেলে।


2. `ports: - "5000:5000"` (The Gateway)

এটি আপনার কন্টেইনারের ভেতরের পোর্টকে আপনার পিসির (Host) পোর্টের সাথে কানেক্ট করে।

- বাম পাশের "5000": আপনার পিসির পোর্ট। ব্রাউজার বা পোস্টম্যান দিয়ে আপনি এই পোর্টে রিকোয়েস্ট পাঠাবেন।
- ডান পাশের "5000": কন্টেইনারের ভেতরের পোর্ট যেখানে এক্সপ্রেস সার্ভারটি চলছে।
- Deep Insight: আপনি যদি পিসিতে অন্য কোনো অ্যাপ ৫০০০ পোর্টে চালান, তবে বাম পাশের সংখ্যাটি চেঞ্জ করে (যেমন "8080:5000") কনফ্লিক্ট এড়াতে পারেন।

3. environment: (The Configuration)

অ্যাপের ভেতরে হার্ডকোডেড ভ্যালু না লিখে ডকার থেকে ভেরিয়েবল পাঠানোর জন্য এটি ব্যবহৃত হয়।
- `MONGO_URL`: মনে আছে ব্যাকএন্ডে আমরা process.env.MONGO_URL লিখেছিলাম? ডকার এখান থেকে সেই ভ্যালুটা সাপ্লাই দেয়।
- `mongodb://mongodb:27017`: এখানে প্রথম mongodb হলো প্রোটোকল, আর দ্বিতীয় mongodb হলো আপনার ডাটাবেস সার্ভিসের নাম। ডকার নেটওয়ার্কিংয়ের কারণে এটি অটোমেটিক কানেক্ট হয়ে যায়।

4. volumes: (The Real-Time Sync & Protection)

এখানে আপনি দুটি ভলিউম ব্যবহার করেছেন, যা ডেভেলপারদের জন্য একটি ম্যাজিক ট্রিক:

- ./backend:/app (Bind Mount): এটি আপনার পিসির backend ফোল্ডারকে কন্টেইনারের /app ফোল্ডারের সাথে লাইভ সিঙ্ক করে। আপনি VS Code-এ কোড সেভ করবেন, আর কন্টেইনারের ভেতর তা সাথে সাথে আপডেট হয়ে যাবে (যদি nodemon ব্যবহার করেন)।

- /app/node_modules (Anonymous Volume): এটি খুবই ট্রিকি! এটি ডকারকে বলে— "পিসির ফোল্ডার সিঙ্ক করলেও কন্টেইনারের ভেতরের node_modules যেন ডিস্টার্ব না হয়।"

- Deep Insight: আপনার পিসিতে হয়তো উইন্ডোজ বা উবুন্টুর জন্য প্যাকেজ আছে, কিন্তু ডকারে চলছে লিনাক্স। এই লাইনটি না থাকলে পিসির প্যাকেজ ডকারের প্যাকেজকে ওভাররাইট করে ফেলতো এবং অ্যাপ ক্র্যাশ করতো।

5. depends_on: - mongodb (The Order of Command)

এটি ডকারকে বলে সার্ভিসের গুরুত্ব বা সিরিয়াল।

- Deep Insight: ডাটাবেস ছাড়া ব্যাকএন্ড অচল। তাই এটি নিশ্চিত করে যে আগে mongodb কন্টেইনারটি স্টার্ট হবে, তারপর ব্যাকএন্ড। তবে মনে রাখবেন, এটি শুধু কন্টেইনার স্টার্ট হওয়া নিশ্চিত করে, ডাটাবেস পুরোপুরি "রেডি" হওয়া নয়।

6. networks: - todo-net (The Private Corridor)

ব্যাকএন্ড এই প্রাইভেট নেটওয়ার্কের মেম্বার।

- Deep Insight: এই নেটওয়ার্কে থাকার কারণেই সে mongodb:27017 লিখে ডাটাবেসকে খুঁজে পায়। এই নেটওয়ার্কের বাইরের কেউ (ফ্রন্টএন্ড ছাড়া) সরাসরি ডাটাবেস দেখতে পাবে না।

7. restart: on-failure (The Safety Net)

- Deep Insight: যদি আপনার কোডে কোনো সিনট্যাক্স এরর থাকে বা ডাটাবেস কানেকশন না পেয়ে ব্যাকএন্ড ক্র্যাশ করে, তবে ডকার তাকে আবার অটো-রিস্টার্ট দেবে। on-failure মানে হলো—যদি অ্যাপটি কোনো এরর (Non-zero exit code) খেয়ে বন্ধ হয়, তবেই সে রিস্টার্ট হবে।

## Same goes for frontend

## volumes

1. volumes: সেকশন

ফাইলের শেষে যখন আপনি আবার volumes: লিখে তার নিচে mongodata: লিখছেন, এটাকে বলা হয় Top-Level Volumes Key।

___

## docker-compose.yml হলো একটা "blueprint" বা "নকশা"
এই file পড়ে Docker বোঝে:
  - কতগুলো container চালাতে হবে
  - কোন image বা Dockerfile থেকে বানাতে হবে
  - কোন port এ চলবে
  - কীভাবে একে অপরের সাথে কথা বলবে
  - Data কোথায় রাখবে

```bash
version: '3.8'
```

এটা বলছে: "এই file টা Docker Compose এর 3.8 format এ লেখা।"

Docker Compose বিভিন্ন সময়ে বিভিন্ন features add করেছে। Version দেখে Docker বোঝে কোন features available। `3.8` এখন পর্যন্ত সবচেয়ে stable এবং common।

নতুন Docker এ এটা আর দরকার নেই, তাই warning দেয়:
the attribute `version` is obsolete

`services:`
```bash
এই keyword এর নিচে সব containers define করা হয়। প্রতিটা entry = একটা container।
```

```bash
services:
  mongodb:    ← Container 1
  backend:    ← Container 2
  forntend:   ← Container 3
```

## 🍃 MongoDB Service — পুরো ব্যাখ্যা

mongodb:
```bash
এটা service এর **নাম**। এই নামটা দুটো কাজ করে:

**১.** অন্য containers এই নামে তাকে চিনবে। যেমন backend এ লেখা আছে `mongodb://mongodb:27017` — এখানে `mongodb` মানে এই service এর নাম।

**২.** Docker একটা internal DNS তৈরি করে। মানে `mongodb` লিখলে Docker নিজেই বুঝে নেয় কোন container এর IP।
```
তুমি যদি এই নাম "db" দিতে তাহলে:
backend এ লিখতে হতো: mongodb://db:27017


image: mongo:6
```

এই line বলছে: "Docker Hub থেকে MongoDB এর version 6 এর official image নামাও।"
```
image: mongo:6
         │    │
         │    └── version tag (6 = MongoDB 6.0)
         └── image এর নাম (Docker Hub এ আছে)
```

এখানে `build` নেই কারণ আমরা নিজেরা MongoDB বানাচ্ছি না — MongoDB এর ready-made official image use করছি।

`image` vs `build` পার্থক্য:
```
image: mongo:6     → Docker Hub থেকে নামাও (ready-made)
build: ./backend   → নিজে Dockerfile দিয়ে বানাও (custom)

container_name: todo-monodb
Docker automatically container এর নাম দেয় এরকম: todo-app_mongodb_1
container_name দিয়ে নিজে নাম দিলে সেটা use হয়। এতে সুবিধা:

### নাম না দিলে
docker logs todo-app_mongodb_1

### নাম দিলে
docker logs todo-monodb   ← সহজ!

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

MongoDB সব data `/data/db` তে রাখে। এটা volume এর সাথে connect করা মানে:
```
Container delete হলো → MongoDB এর data গেল না
আবার container চালালো → আগের সব data ফিরে পাবে ✅
```

Volume ছাড়া:
```
Container delete = সব data গেল 💀

networks:
      - todo-net
```

এই container টাকে `todo-net` নামের network এ রাখা হলো।
```
todo-net network:
┌─────────────────────────────┐
│  mongodb  backend  frontend │
│  (সবাই একে অপরকে চেনে)    │
└─────────────────────────────┘

Same network এ না থাকলে containers একে অপরকে চিনতে পারত না। Backend mongodb নামে connect করতে পারত না।

restart: always
```

MongoDB crash করলে বা Docker restart হলে কী করবে তা বলছে।
```
restart: always        → যেকোনো কারণে বন্ধ হলে আবার চালু করো
restart: on-failure    → শুধু error এ বন্ধ হলে চালু করো
restart: unless-stopped → manually বন্ধ না করলে সবসময় চালু রাখো
restart: "no"          → কখনো restart করো না

MongoDB কে always দেওয়া হয়েছে কারণ database সবসময় available থাকা দরকার।

# ⚙️ Backend Service — পুরো ব্যাখ্যা

backend:
Service এর নাম backend। Frontend container এই নামে তাকে চিনবে।

build: ./backend
```

`./backend` folder এর Dockerfile দিয়ে image build করবে।
```
build: ./backend
          │
          └── এই folder এ Dockerfile খুঁজবে
              ~/todo-app/backend/Dockerfile

image দিলে Docker Hub থেকে নামাত। build দিলে নিজে বানায়।

```bash
container_name: todo-backend
```
Container এর custom নাম। `docker logs todo-backend` দিয়ে সহজে access।

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

এটা ছাড়া তুমি `localhost:5000` দিয়ে access করতে পারতে না। Container isolated, port map না করলে বাইরে থেকে ঢোকা যায় না।
```
তুমি → localhost:5000 → Docker → container:5000 → Express


environment:
      - MONGO_URL=mongodb://mongodb:27017/tododb
      - PORT=5000
```

Container এর ভেতরে environment variables set করা। `index.js` এ এগুলো `process.env.MONGO_URL` দিয়ে পড়া হয়।

`MONGO_URL` এ `mongodb` হলো MongoDB service এর নাম:
```
mongodb://mongodb:27017/tododb
           │       │      │
           │       │      └── Database এর নাম
           │       └── Port
           └── Service এর নাম (Docker DNS resolve করবে)

Docker automatically mongodb → সেই container এর IP তে translate করে।


volumes:
      - ./backend:/app
      - /app/node_modules
```

**Line 1: `./backend:/app`** — Bind Mount
```
./backend (তোমার PC)  ←→  /app (container এর ভেতরে)
```

তুমি `backend/index.js` edit করলে container এর `/app/index.js` সাথে সাথে বদলে যাবে। Development এ live reload এর জন্য।

**Line 2: `/app/node_modules`** — Anonymous Volume

এটা একটু tricky। উপরের line এর কারণে একটা সমস্যা হয়:
```
./backend:/app করলে:
Host এর backend folder → Container এর /app

কিন্তু host এ node_modules নেই!
তাহলে container এর /app/node_modules ও override হয়ে মুছে যাবে 💀
```

`/app/node_modules` লেখার মানে হলো:
```
এই folder টাকে bind mount থেকে বাদ রাখো।
Container নিজে এখানে যা install করেছে সেটা থাকবে।

depends_on:
      - mongodb
```

Backend start হওয়ার আগে MongoDB container start হবে।
```
depends_on ছাড়া:
MongoDB, Backend একসাথে start → Backend connect করতে গিয়ে MongoDB পায় না → Error

depends_on দিলে:
MongoDB আগে start → তারপর Backend start → Connect হয়

⚠️ একটা সীমাবদ্ধতা: depends_on শুধু container start হওয়া নিশ্চিত করে। MongoDB সম্পূর্ণ ready হতে ৩-৫ সেকেন্ড লাগতে পারে। তাই index.js এ retry logic লেখা আছে।

networks:
      - todo-net

Backend কেও todo-net এ রাখা হলো। MongoDB আর Backend একই network এ, তাই কথা বলতে পারবে।

restart: on-failure
শুধু error এ crash হলে restart। Backend manually বন্ধ করলে restart করবে না।


## ⚛️ Frontend Service — পুরো ব্যাখ্যা

forntend:
 ⚠️ Typo আছে এখানে! frontend হওয়ার কথা ছিল, forntend লেখা হয়েছে। কাজ করবে কারণ Docker এটাকে শুধু একটা নাম হিসেবে দেখে, কিন্তু confusing।

build: ./frontend
./frontend folder এর Dockerfile দিয়ে build।

ports:
      - "5173:5173"
```
```
তুমি → localhost:5173 → Docker → container:5173 → Vite dev server

Vite default port হলো 5173।

volumes:
      - ./frontend:/app
      - /app/node_modules
Backend এর মতোই। ./frontend folder bind mount করা, node_modules আলাদা রাখা।

depends_on:
      - backend
```

Frontend চালু হওয়ার আগে Backend চালু হবে।

চালু হওয়ার order:
```
mongodb → backend → frontend

💾 Volumes — পুরো ব্যাখ্যা

volumes:
    mongodata:
```

Named Volume declare করা হচ্ছে। Service এ `mongodata:/data/db` use করার আগে এখানে declare করতে হয়।

শুধু নাম লিখলেই হয়, Docker বাকিটা করে:
```
Host এ physically থাকে:
/var/lib/docker/volumes/todo-app_mongodata/_data/
```

এটা না লিখলে error আসত:
```
service "mongodb" refers to undefined volume mongodata

🌐 Networks — পুরো ব্যাখ্যা

networks:
  todo-net:
```

Custom bridge network declare করা।

এটা কেন দরকার? Default network এ containers IP দিয়ে কথা বলে, নাম দিয়ে না। Custom network এ Docker automatic DNS তৈরি করে:
```
Default network:
backend → 172.17.0.2 (IP মনে রাখতে হয়, IP change হতে পারে)

Custom network (todo-net):
backend → "mongodb" লিখলেই হয় (Docker DNS করে দেয়)
