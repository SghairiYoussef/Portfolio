// Everything the game says. Facts only — keep in sync with the CV and the Tanilytics repos.

export const LINKS = {
  email: "mailto:youssef.sghairi@insat.ucar.tn",
  linkedin: "https://linkedin.com/in/youssef-sghairi",
  github: "https://github.com/SghairiYoussef",
  cv: "/Youssef_Sghairi_CV.pdf",
  classic: "https://sghairiportfolio.vercel.app",
  tanilytics: "https://github.com/Tanilytics",
  grindai: "https://github.com/SghairiYoussef/GrindAI",
  caresync: "https://github.com/SghairiYoussef/CareSync",
  sdk: "https://github.com/Tanilytics/sdk",
  ingestion: "https://github.com/Tanilytics/ingestion",
  processing: "https://github.com/Tanilytics/processing",
  infra: "https://github.com/Tanilytics/infra",
  scripts: "https://github.com/Tanilytics/scripts",
};

// group: "house" | "lab" | "kef" count toward Discovered; "secret" toward Secrets; "info" counts for nothing.
export const STATIONS = {
  /* ───────────── the house ───────────── */
  desk: {
    group: "house",
    label: "Desk",
    kicker: "Now · Mar 2026 — present",
    title: "SpecTraceAI — Full Stack Engineer",
    body: `
      <p>Remote, from Tunisia, for a UAE team building AI tooling around requirements, tests and traceability.</p>
      <ul>
        <li>Designed a provider-agnostic ALM integration framework and shipped its first provider, Polarion — bidirectional sync of requirements, test cases and LiveDoc views.</li>
        <li>Built deterministic test doubles for LLM, embedding and vector-store calls, so tests stop depending on live Azure OpenAI and Pinecone.</li>
        <li>Designed and implemented multi-tenant projects with role-based access control.</li>
        <li>Contributed to an AI-assisted repository discovery workflow that maps requirements, test specs and code for human review.</li>
      </ul>
      <p class="tags">Next.js · React · TypeScript · Python · FastAPI · Azure OpenAI · Pinecone</p>`,
  },
  shelf: {
    group: "house",
    label: "Bookshelf",
    kicker: "Side projects",
    title: "Things I build to learn",
    body: `
      <dl>
        <dt>GrindAI <span>prototype</span></dt><dd>Fitness tracking on Spring Boot microservices, with Eureka, RabbitMQ and Gemini.</dd>
        <dt>CareSync <span>prototype</span></dt><dd>Patient-management system as Spring Boot microservices.</dd>
        <dt>MeetQuest <span>prototype</span></dt><dd>A 2D shared space: tile maps, avatars and players synced over WebSockets.</dd>
        <dt>DungeonAI <span>experiment</span></dt><dd>A text RPG narrated by a local Mistral 7B model.</dd>
        <dt>Atlas <span>in progress</span></dt><dd>Real-time collaboration: avatars, live cursors, presence. AI agents later.</dd>
      </dl>
      <p>The biggest one has its own room — through the arch on the right.</p>`,
    links: [
      { label: "GrindAI", href: LINKS.grindai },
      { label: "CareSync", href: LINKS.caresync },
      { label: "All repos", href: LINKS.github },
    ],
  },
  whiteboard: {
    group: "house",
    label: "Whiteboard",
    kicker: "Stack",
    title: "What I actually use",
    body: `
      <dl>
        <dt>At work</dt><dd>TypeScript, Python, Java · React, Next.js · FastAPI, Quarkus · PostgreSQL, MongoDB, Kafka · LLM integration, Azure OpenAI, Pinecone</dd>
        <dt>In projects</dt><dd>Go, Spring Boot · ClickHouse, Redis, Redpanda, RabbitMQ · Docker, Kubernetes, Helm, GitHub Actions</dd>
        <dt>Practice</dt><dd>Microservices, event-driven design, multi-tenancy, RBAC, data migrations, testing AI integrations</dd>
      </dl>`,
  },
  corkboard: {
    group: "house",
    label: "Corkboard",
    kicker: "Before this",
    title: "Where I've been",
    body: `
      <dl>
        <dt>Uvey <span>Jun 2025 — Mar 2026</span></dt><dd>Software Developer. End-to-end features with React, Quarkus and Kafka; moved a service from MongoDB to PostgreSQL without losing production data.</dd>
        <dt>WeCraft <span>Jun — Jul 2025</span></dt><dd>Intern on a hospital web app: Quarkus microservices, patient records, regulatory audit trail.</dd>
        <dt>INSAT ACM Chapter <span>2024 — 2025</span></dt><dd>Event Manager — technical events with hundreds of participants.</dd>
        <dt>AIESEC <span>2024</span></dt><dd>Exchange in Eskişehir, Türkiye.</dd>
      </dl>`,
  },
  diploma: {
    group: "house",
    label: "Frame",
    kicker: "Education",
    title: "INSAT — Software Engineering",
    body: `
      <p>The frame is empty on purpose: the engineering degree lands in 2027.</p>
      <p>Before that comes the end-of-studies internship — <strong>6 months, starting February 2027</strong>.</p>
      <p class="tags">Software design · distributed systems · databases · operating systems · algorithms · applied ML</p>`,
  },
  letterbox: {
    group: "house",
    label: "Letterbox",
    kicker: "Contact",
    title: "Leave a note",
    body: `
      <p>Looking for a 6-month PFE intern from February 2027? Backend, distributed systems or full stack — I'd like to hear about it.</p>
      <p>Arabic, English and French; some German.</p>`,
    links: [
      { label: "Email me", href: LINKS.email, primary: true },
      { label: "LinkedIn", href: LINKS.linkedin },
      { label: "GitHub", href: LINKS.github },
      { label: "CV (PDF)", href: LINKS.cv },
    ],
  },
  window: {
    group: "info",
    label: "Window",
    kicker: "View",
    title: "Jebel Dyr",
    body: `<p>That flat-topped mountain is Jebel Dyr. El Kef is built into its cliff, with the Kasbah keeping watch from the top of town. The door at the back leads up to the terrace if you want a better look.</p>`,
  },

  /* ───────────── El Kef terrace ───────────── */
  telescope: {
    group: "kef",
    label: "Telescope",
    kicker: "Home",
    title: "El Kef",
    body: `
      <p>I'm from El Kef, in the north-west of Tunisia — about 175 km from Tunis, on the cliffs of Jebel Dyr.</p>
      <ul>
        <li>At around 780 m it's the highest city in the country, which explains the winters.</li>
        <li>The Kasbah up there was built for an Ottoman-era garrison in the 17th century; its ramparts were finished in 1740.</li>
      </ul>`,
  },
  column: {
    group: "kef",
    label: "Old column",
    kicker: "Before it was El Kef",
    title: "Sicca Veneria",
    body: `<p>Carthaginians called the town Sicca; under Rome it became Sicca Veneria. Bits of temples, baths and a basilica are still scattered around the old town — this column is a stand-in, but the real ones aren't far.</p>`,
  },
  tank: {
    group: "info",
    label: "Water tank",
    kicker: "Rooftop",
    title: "Every roof has one",
    body: `<p>A water tank on the roof: standard equipment. Highly available, eventually consistent with the city supply.</p>`,
  },

  /* ───────────── Tanilytics lab ───────────── */
  intro: {
    group: "lab",
    label: "Lab sign",
    kicker: "Case study · INSAT engineering project · 2025—2026",
    title: "Welcome to Tanilytics",
    body: `
      <p>A self-hosted, privacy-first web analytics platform, built by a team of three. I co-designed the architecture and built parts of it.</p>
      <p>This room is the system laid out end to end. Follow the belt from left to right: an event leaves a browser, gets through the gateway, is checked and queued, anonymised and enriched, stored, and finally read back by the dashboard.</p>
      <p class="tags">Go · Java / Spring Boot · TypeScript · Redpanda · ClickHouse · Redis · PostgreSQL · Kong · Kubernetes</p>`,
    links: [{ label: "github.com/Tanilytics", href: LINKS.tanilytics }],
  },
  sdk: {
    group: "lab",
    label: "Browser SDK",
    kicker: "Step 1 · TypeScript",
    title: "Where events are born",
    body: `
      <p>A small TypeScript SDK (published on npm as <code>tanilytics</code>) runs on the tracked site.</p>
      <ul>
        <li>Tracks page views, clicks, form submits, scroll depth and time on page automatically; media adapters cover players like YouTube.</li>
        <li>Batches events, retries, and falls back to <code>sendBeacon</code> when the page closes, so the last events aren't lost.</li>
        <li>Opt-out, consent and Do Not Track are built in, not bolted on.</li>
      </ul>`,
    links: [{ label: "Tanilytics/sdk", href: LINKS.sdk }],
  },
  gateway: {
    group: "lab",
    label: "Gateway",
    kicker: "Step 2 · Kong",
    title: "The front door",
    body: `
      <p>Everything comes in through Kong. The interesting decision is <strong>what</strong> to rate-limit on.</p>
      <ul>
        <li>Limits are keyed by the site's token, not by IP — a busy customer site shouldn't be throttled because of someone else's traffic.</li>
        <li>Bursts are allowed for the SDK's batched flushes; sustained rate is capped per site.</li>
        <li>Counters live in Redis, so the limit holds across all gateway pods instead of per pod.</li>
      </ul>`,
  },
  ingest: {
    group: "lab",
    label: "Ingestion",
    kicker: "Step 3 · Go + Fiber",
    title: "Accept fast, decide later",
    body: `
      <p>The ingestion service's only job is to take events in quickly and safely. Designed for around 50K events/s.</p>
      <ul>
        <li>Validates each batch and rejects oversized bodies early.</li>
        <li>Checks every <code>event_id</code> against a Redis Bloom filter to drop retries and duplicates. The filter key rotates daily and lives 48 h.</li>
        <li>If Redis is unavailable, dedup <strong>fails open</strong>: a rare duplicate is cheaper than a lost event.</li>
        <li>Produces to Redpanda asynchronously with <code>acks=all</code> and answers <code>202 Accepted</code> straight away.</li>
      </ul>`,
    links: [{ label: "Tanilytics/ingestion", href: LINKS.ingestion }],
  },
  stream: {
    group: "lab",
    label: "Redpanda",
    kicker: "Step 4 · Kafka-compatible log",
    title: "The buffer in the middle",
    body: `
      <p>Redpanda sits between "we received it" and "we processed it", so a slow database never slows down the SDK.</p>
      <ul>
        <li>Three brokers in the full stack, one in the dev profile.</li>
        <li>Records are keyed by site, so one site's events land on the same partition and stay in order.</li>
        <li>Kafka API, without running ZooKeeper or a JVM.</li>
      </ul>`,
  },
  processing: {
    group: "lab",
    label: "Processing",
    kicker: "Step 5 · Go consumer",
    title: "Where an IP stops being an IP",
    body: `
      <p>A Go consumer reads batches from Redpanda and runs each event through four steps:</p>
      <ul>
        <li><strong>Anonymise:</strong> resolve country and region, then truncate the IP (IPv4 last octet zeroed, IPv6 cut to /48) and hash it with SHA-256 and a salt. The raw IP never reaches storage.</li>
        <li><strong>Parse</strong> the user agent into browser, OS and device type.</li>
        <li><strong>Stitch sessions</strong> in Redis — 30 minutes of inactivity starts a new one.</li>
        <li><strong>Write</strong> the batch to ClickHouse, then update live counters in Redis.</li>
      </ul>
      <p>Offsets are committed manually after the write, so delivery is at-least-once; records that can't even be parsed ("poison" messages) go to a dead-letter topic instead of blocking the partition.</p>`,
    links: [{ label: "Tanilytics/processing", href: LINKS.processing }],
  },
  clickhouse: {
    group: "lab",
    label: "ClickHouse",
    kicker: "Step 6 · Columnar storage",
    title: "Answer before they ask",
    body: `
      <p>Raw events go into a MergeTree table partitioned by month and ordered by site, time and visitor — so a site's data is physically together.</p>
      <ul>
        <li>Materialized views roll events up as they arrive into hourly and daily AggregatingMergeTree tables: site metrics, page views, referrers, media engagement.</li>
        <li>Rollups are partitioned by month <em>and</em> site, which keeps one big tenant from slowing everyone else's queries.</li>
        <li>Dashboards read the rollups, not raw events — that's how queries aim to stay under 500 ms.</li>
      </ul>`,
  },
  redis: {
    group: "lab",
    label: "Redis",
    kicker: "The busy one",
    title: "Five jobs, one Redis",
    body: `
      <ul>
        <li>Bloom filter for deduplication at ingest.</li>
        <li>Session state with a 30-minute TTL.</li>
        <li>Hourly page-view counters.</li>
        <li>HyperLogLog for unique visitors — approximate, tiny, and good enough for a live counter.</li>
        <li>"Active right now" visitors, expiring after 10 minutes.</li>
      </ul>
      <p>Counter updates are deliberately non-fatal: if Redis hiccups, the event is still stored in ClickHouse.</p>`,
  },
  services: {
    group: "lab",
    label: "Services",
    kicker: "Step 7 · Spring Boot",
    title: "Auth and query",
    body: `
      <dl>
        <dt>auth-service</dt><dd>Accounts, sites, members and API keys, with JWTs. PostgreSQL holds the relational data.</dd>
        <dt>query-service</dt><dd>The analytics API over ClickHouse rollups and Redis. Realtime stats are pushed to the dashboard with Server-Sent Events, one stream per site.</dd>
      </dl>
      <p>Services talk to each other with internal service tokens, not user tokens.</p>`,
  },
  privacy: {
    group: "lab",
    label: "Privacy vault",
    kicker: "GDPR, in code",
    title: "privacy-service",
    body: `
      <ul>
        <li>Consent records and data export.</li>
        <li>Deletion requests remove a visitor's events from ClickHouse.</li>
        <li>Scheduled jobs every night: deletions at 02:00, retention cleanup at 03:30, and a fresh hashing salt at midnight.</li>
      </ul>`,
  },
  dashboard: {
    group: "lab",
    label: "Dashboard",
    kicker: "Step 8 · React",
    title: "The part people see",
    body: `<p>A React dashboard (TanStack Start) with time series, breakdowns, referrers and a live view fed by the query service's event stream.</p>`,
  },
  ops: {
    group: "lab",
    label: "Ops console",
    kicker: "Running it",
    title: "Infra",
    body: `
      <ul>
        <li>Docker Compose locally, with separate <em>pipeline</em> and <em>app</em> profiles so you can run half the system.</li>
        <li>Kubernetes with Helm (helmfile, plus an umbrella chart) and network policies.</li>
        <li>Terraform modules for AWS: VPC and EKS.</li>
        <li>Observability: Prometheus metrics and Jaeger traces. ClickHouse migrations with golang-migrate.</li>
      </ul>`,
    links: [{ label: "Tanilytics/infra", href: LINKS.infra }],
  },
  bench: {
    group: "lab",
    label: "Benchmark",
    kicker: "Measured, not guessed",
    title: "gzip: 94% less bandwidth",
    body: `
      <p>Analytics payloads are the same JSON keys over and over, so compression should pay off. We measured it: 1,000 requests of 100 events each, plain vs gzip.</p>
      <ul>
        <li>Plain: 29.5 MB sent. Gzip: 1.76 MB. <strong>94% less bandwidth.</strong></li>
        <li>Latency unchanged — about 21 ms average either way.</li>
        <li>Real batches vary in size, so expect a bit less than 94% in production — still a big win.</li>
      </ul>`,
    links: [{ label: "Tanilytics/scripts", href: LINKS.scripts }],
  },

  /* ───────────── secrets ───────────── */
  cat: {
    group: "secret",
    label: "Cat",
    kicker: "Secret · Resident",
    title: "Kafka",
    body: `<p>Named after the message broker. Consumes everything, acknowledges nothing, never drops a nap.</p>`,
  },
  coin: {
    group: "secret",
    label: "Loose tile",
    kicker: "Secret · Under the floor",
    title: "A Roman coin",
    body: `<p>Someone in Sicca Veneria dropped this a long time ago. In El Kef, the past is never very far under the floor.</p>`,
  },
  duck: {
    group: "secret",
    label: "Rubber duck",
    kicker: "Secret · Senior engineer",
    title: "The duck",
    body: `<p>Has reviewed every bug in this lab. Has never said a word. Has solved most of them.</p>`,
  },
  panda: {
    group: "secret",
    label: "Plush",
    kicker: "Secret · Mascot",
    title: "A red panda",
    body: `<p>Kafka the cat has opinions about this one.</p>`,
  },
  pigeon: {
    group: "secret",
    label: "Pigeon",
    kicker: "Secret · Fire and forget",
    title: "Message delivered",
    body: `<p>The original at-most-once delivery protocol.</p>`,
  },
  borzgane: {
    group: "secret",
    label: "Bowl",
    kicker: "Secret · Kef cooking",
    title: "Borzgane",
    body: `<p>Sweet couscous with dates, dried fruit and lamb — a Kef speciality. Someone left it out here. Probably for you.</p>`,
  },
  snow: {
    group: "secret",
    label: "Snow",
    kicker: "Secret · ↑ ↑ ↓ ↓ ← → ← → B A",
    title: "Snow in El Kef",
    body: `<p>Not a glitch: El Kef really does get snow some winters. Enter the code again to stop it.</p>`,
  },
};

export const GROUPS = [
  { id: "house", label: "House" },
  { id: "lab", label: "Tanilytics lab" },
  { id: "kef", label: "Terrace" },
];
