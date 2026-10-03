// Everything the stations say. Facts only — keep this in sync with the CV.

export const LINKS = {
  email: "mailto:youssef.sghairi@insat.ucar.tn",
  linkedin: "https://linkedin.com/in/youssef-sghairi",
  github: "https://github.com/SghairiYoussef",
  cv: "/Youssef_Sghairi_CV.pdf",
  classic: "https://sghairiportfolio.vercel.app",
  tanilytics: "https://github.com/Tanilytics",
  grindai: "https://github.com/SghairiYoussef/GrindAI",
  caresync: "https://github.com/SghairiYoussef/CareSync",
};

// `quest: true` stations count toward the "discovered" counter.
export const STATIONS = {
  desk: {
    quest: true,
    label: "Desk",
    kicker: "Now · Mar 2026 — present",
    title: "SpecTraceAI — Full Stack Engineer",
    body: `
      <p>Remote, from Tunis, for a UAE team building AI tooling around requirements, tests and traceability.</p>
      <ul>
        <li>Designed a provider-agnostic ALM integration framework and shipped its first provider, Polarion — bidirectional sync of requirements, test cases and LiveDoc views.</li>
        <li>Built deterministic test doubles for LLM, embedding and vector-store calls, so tests stop depending on live Azure OpenAI and Pinecone.</li>
        <li>Designed and implemented multi-tenant projects with role-based access control.</li>
        <li>Contributed to an AI-assisted repository discovery workflow that maps requirements, test specs and code for human review.</li>
      </ul>
      <p class="tags">Next.js · React · TypeScript · Python · FastAPI · Azure OpenAI · Pinecone</p>`,
    links: [],
  },
  rack: {
    quest: true,
    label: "Server rack",
    kicker: "Case study · INSAT project · team of 3",
    title: "Tanilytics",
    body: `
      <p>A self-hosted, privacy-first web analytics platform. I co-designed the architecture and built parts of it.</p>
      <ul>
        <li>Seven services across Go, Java/Spring Boot and a Next.js dashboard.</li>
        <li>Ingestion designed for 50K events/s through Go and Redpanda.</li>
        <li>IP anonymisation in three steps: truncate → geolocate → SHA-256. Duplicates dropped with a Redis Bloom filter.</li>
        <li>ClickHouse materialized views and Redis caching, aiming for dashboard queries under 500 ms.</li>
        <li>Tenant isolation: per-tenant rate limits in Kong, ClickHouse partitioning, Redis hot reads.</li>
      </ul>
      <p class="tags">Go · Spring Boot · Redpanda · ClickHouse · Redis · PostgreSQL · Kubernetes · Helm</p>`,
    links: [{ label: "github.com/Tanilytics", href: LINKS.tanilytics }],
  },
  shelf: {
    quest: true,
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
      </dl>`,
    links: [
      { label: "GrindAI", href: LINKS.grindai },
      { label: "CareSync", href: LINKS.caresync },
      { label: "All repos", href: LINKS.github },
    ],
  },
  whiteboard: {
    quest: true,
    label: "Whiteboard",
    kicker: "Stack",
    title: "What I actually use",
    body: `
      <dl>
        <dt>At work</dt><dd>TypeScript, Python, Java · React, Next.js · FastAPI, Quarkus · PostgreSQL, MongoDB, Kafka · LLM integration, Azure OpenAI, Pinecone</dd>
        <dt>In projects</dt><dd>Go, Spring Boot · ClickHouse, Redis, Redpanda, RabbitMQ · Docker, Kubernetes, Helm, GitHub Actions</dd>
        <dt>Practice</dt><dd>Microservices, event-driven design, multi-tenancy, RBAC, data migrations, testing AI integrations</dd>
      </dl>`,
    links: [],
  },
  corkboard: {
    quest: true,
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
    links: [],
  },
  diploma: {
    quest: true,
    label: "Frame",
    kicker: "Education",
    title: "INSAT — Software Engineering",
    body: `
      <p>The frame is empty on purpose: the engineering degree lands in 2027.</p>
      <p>Before that comes the end-of-studies internship — <strong>6 months from February 2027</strong>, ideally in Germany, France or elsewhere in Europe.</p>
      <p class="tags">Software design · distributed systems · databases · operating systems · algorithms · applied ML</p>`,
    links: [],
  },
  door: {
    quest: true,
    label: "Door",
    kicker: "Contact",
    title: "Knock knock",
    body: `
      <p>Looking for a 6-month PFE intern from February 2027? Backend, full stack or applied AI — I'd like to hear about it.</p>
      <p>Arabic, English and French; some German.</p>`,
    links: [
      { label: "Email me", href: LINKS.email, primary: true },
      { label: "LinkedIn", href: LINKS.linkedin },
      { label: "GitHub", href: LINKS.github },
      { label: "CV (PDF)", href: LINKS.cv },
    ],
  },
  window: {
    quest: false,
    label: "Window",
    kicker: "View",
    title: "Blue and white",
    body: `<p>The room is painted like a house in Sidi Bou Said, just outside Tunis: white walls, blue doors, sea in the window.</p>`,
    links: [],
  },
  cat: {
    quest: false,
    label: "Cat",
    kicker: "Resident",
    title: "Kafka",
    body: `<p>Named after the message broker. Consumes everything, acknowledges nothing, never drops a nap.</p>`,
    links: [],
  },
};
