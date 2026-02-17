/**
 * System Design 12-Week Curriculum — structure for the todo checklist.
 * Used by the blog post system-design-learning-path-12-week-curriculum.
 */
export interface CurriculumItem {
  label: string
  href?: string
}

export interface CurriculumWeek {
  id: string
  title: string
  items: CurriculumItem[]
  description: string
}

export const CURRICULUM_STORAGE_KEY = "curriculum-system-design-12week"

export const SYSTEM_DESIGN_12WEEK: CurriculumWeek[] = [
  {
    id: "week-1",
    title: "Week 1: Scale from Zero to Millions & Reliable/Maintainable/Scalable Apps",
    items: [
      { label: "Chapter 1: Scale from Zero to Millions of Users (Alex Xu)" },
      { label: "Chapter 1: Reliable, Scalable, and Maintainable Applications (DDIA)" },
      { label: "Video: How Discord Stores TRILLIONS of Messages", href: "https://www.youtube.com/watch?v=xDC71DKtDUE" },
      { label: "Project: Build a simple Node.js + Redis app with horizontal scaling" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers scaling from single server to millions of users, reliability (faults, durability), scalability (load, growth), and maintainability. Introduces how systems like Discord store and serve massive message volumes and how to scale a simple app with Redis.",
  },
  {
    id: "week-2",
    title: "Week 2: Back-of-the-Envelope Estimation & Data Models (SQL/NoSQL)",
    items: [
      { label: "Chapter 2: Back-of-the-envelope Estimation (Alex Xu)" },
      { label: "Chapter 2: Data Models and Query Languages (DDIA)" },
      { label: "Video: Big-O Notation in 100 Seconds (Fireship)", href: "https://www.youtube.com/watch?v=g2o22C3CRfU" },
      { label: "Project: Run capacity planning for your own app; try SQL and Postgres" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers quick capacity estimates (QPS, storage, bandwidth), Big-O thinking, and data modeling: relational vs document vs graph models, query languages, and when to use SQL vs NoSQL. You’ll apply this with real capacity planning and Postgres.",
  },
  {
    id: "week-3",
    title: "Week 3: System Design Framework & Storage/Retrieval",
    items: [
      { label: "Chapter 3: A Framework for System Design Interviews (Alex Xu)" },
      { label: "Chapter 3: Storage and Retrieval (DDIA)" },
      { label: "Video: System Design Interview Basics (ByteByteGo)", href: "https://www.youtube.com/watch?v=FSR1s2b-l_I" },
      { label: "Project: Answer a mock interview question (e.g. Design a URL shortener)" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers a step-by-step framework for system design interviews (requirements, scale, APIs, data model, bottlenecks) and how databases store and retrieve data: indexes, B-trees, LSM-trees, and trade-offs. You’ll practice with a classic URL shortener-style question.",
  },
  {
    id: "week-4",
    title: "Week 4: Design a Rate Limiter & Encoding/Evolution",
    items: [
      { label: "Chapter 4: Design a Rate Limiter (Alex Xu)" },
      { label: "Chapter 4: Encoding and Evolution (DDIA)" },
      { label: "Video: Rate Limiting (Fireship)", href: "https://www.youtube.com/watch?v=cIperSdIEpI" },
      { label: "Project: Implement a token-bucket rate limiter in Node.js or Python" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers designing rate limiters (token bucket, sliding window, distributed limits) and data encoding/evolution: JSON, Protobuf, Avro, schema evolution, and backward compatibility. You’ll build a working rate limiter and see how APIs protect against abuse.",
  },
  {
    id: "week-5",
    title: "Week 5: Consistent Hashing & Replication",
    items: [
      { label: "Chapter 5: Design Consistent Hashing (Alex Xu)" },
      { label: "Chapter 5: Replication (DDIA)" },
      { label: "Video: Consistent Hashing (Gaurav Sen)", href: "https://www.youtube.com/watch?v=zaRkONvyGr8" },
      { label: "Project: Simulate consistent hashing with a simple ring" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers consistent hashing for distributed caches and databases (minimizing rebalancing when nodes join/leave) and replication: leader-follower, sync vs async, replication lag, and failover. You’ll implement a ring and see how systems like Dynamo/Cassandra use it.",
  },
  {
    id: "week-6",
    title: "Week 6: Key-Value Store & Partitioning",
    items: [
      { label: "Chapter 6: Design a Key-Value Store (Alex Xu)" },
      { label: "Chapter 6: Partitioning (DDIA)" },
      { label: "Video: Database Sharding Explained (Fireship)", href: "https://www.youtube.com/watch?v=5faMjKuB9bc" },
      { label: "Project: Build a tiny key-value store with partitioning logic (Python or Go)" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers designing a distributed key-value store (CAP, consistency, storage layout) and partitioning/sharding: key-range vs hash-based partitioning, rebalancing, and handling hot keys. You’ll build a minimal KV store with partition logic.",
  },
  {
    id: "week-7",
    title: "Week 7: Unique ID Generator & Transactions",
    items: [
      { label: "Chapter 7: Design a Unique ID Generator (Alex Xu)" },
      { label: "Chapter 7: Transactions (DDIA)" },
      { label: "Video: UUID vs. Snowflake IDs", href: "https://www.youtube.com/watch?v=gpxnbly9bz4" },
      { label: "Project: Implement Twitter Snowflake IDs in Node.js or Python" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers generating unique IDs at scale (UUID, Snowflake, segment-based) and transactions: ACID, isolation levels, and distributed transactions. You’ll implement Snowflake-style IDs and understand when to use them vs UUIDs.",
  },
  {
    id: "week-8",
    title: "Week 8: URL Shortener & Distributed Systems Trouble",
    items: [
      { label: "Chapter 8: Design a URL Shortener (Alex Xu)" },
      { label: "Chapter 8: The Trouble with Distributed Systems (DDIA)" },
      { label: "Video: How Bitly Works (Systems Design)", href: "https://www.youtube.com/watch?v=fMZMm_0ZhK4" },
      { label: "Project: Build a working URL shortener with database and base62 encoding" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers designing a URL shortener (hash, encoding, redirects, scaling) and the pitfalls of distributed systems: faults, unreliable networks, clock skew, and Byzantine failures. You’ll build a shortener and understand why distributed systems are hard.",
  },
  {
    id: "week-9",
    title: "Week 9: Web Crawler & Consistency/Consensus",
    items: [
      { label: "Chapter 9: Design a Web Crawler (Alex Xu)" },
      { label: "Chapter 9: Consistency and Consensus (DDIA)" },
      { label: "Video: How Search Engines Crawl the Web", href: "https://www.youtube.com/watch?v=BKorP55Aqvg" },
      { label: "Project: Write a basic web crawler (Python + Scrapy or Beautiful Soup)" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers designing a web crawler (politeness, dedup, frontier, scale) and consistency/consensus: linearizability, Raft, Paxos, and when strong consistency is worth the cost. You’ll build a crawler and see how consensus keeps replicas in sync.",
  },
  {
    id: "week-10",
    title: "Week 10: Notification System & Batch/Stream Processing",
    items: [
      { label: "Chapter 10: Design a Notification System (Alex Xu)" },
      { label: "Chapter 10: Batch Processing (DDIA)" },
      { label: "Video: Push Notifications at Scale (Netflix)", href: "https://www.youtube.com/watch?v=6w6E_B55p0E" },
      { label: "Project: Set up a simple push-notification service with FCM or RabbitMQ" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers designing a notification system (push vs pull, channels, fan-out) and batch processing: MapReduce, data pipelines, and how systems like Hadoop process large datasets. You’ll build a small notification service and see how Netflix scales push.",
  },
  {
    id: "week-11",
    title: "Week 11: News Feed & Stream Processing",
    items: [
      { label: "Chapter 11: Design a News Feed System (Alex Xu)" },
      { label: "Chapter 11: Stream Processing (DDIA)" },
      { label: "Video: How Instagram's Feed Works", href: "https://www.youtube.com/watch?v=QmX2NPkJTKg" },
      { label: "Project: Build a mini feed aggregator (fanout-on-write or fanout-on-read)" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers designing a news/feed system (fanout on write vs read, ranking, pagination) and stream processing: event streams, Kafka, and processing data in real time. You’ll build a feed and see how Instagram-style systems work.",
  },
  {
    id: "week-12",
    title: "Week 12: Chat System & Future of Data Systems (AI Use Cases)",
    items: [
      { label: "Chapter 12: Design a Chat System (Alex Xu)" },
      { label: "Chapter 12: The Future of Data Systems (DDIA)" },
      { label: "Video: WhatsApp System Design", href: "https://www.youtube.com/watch?v=vvhC64hQZMk" },
      { label: "Project: Build a real-time chat app with WebSockets (Node.js + Socket.io)" },
      { label: "Blog: Primary or alternative topic" },
    ],
    description: "Covers designing a chat/messaging system (1:1, groups, presence, delivery, scale) and the future of data systems: unbundled databases, ML/AI workloads, and ethical use. You’ll build a real-time chat app and tie the curriculum to modern AI engineering.",
  },
]
