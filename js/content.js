/* ============================================================
   content.js — all editable content lives here.
   Update this file; main.js renders it. No HTML edits needed.
   ============================================================ */

const SITE_CONTENT = {
  projects: [
    {
      id: "eth0",
      title: "Enterprise Hybrid Homelab",
      stack: ["MikroTik", "pfSense", "Proxmox VE", "PRTG"],
      networkMap: true,
      problem: "Most student networking experience stops at a single flat LAN and a simulator. I wanted to understand how a real business network actually behaves — with genuine traffic, genuine failure modes, and genuine consequences for a misconfigured firewall rule — so I set out to build a physical, enterprise-inspired network at home rather than only simulating one.",
      role: "I designed, built, and continue to operate the entire environment solo — from the physical rack and cabling, through VLAN and IP addressing design, to the firewall rules, virtualization layer, and monitoring stack. Every decision, from segmentation strategy to backup policy, was mine to make and mine to fix when it broke.",
      features: [
        "Multi-VLAN segmentation (management, servers, storage, IoT/guest) enforced at the firewall",
        "pfSense handling routing, firewalling and inter-VLAN access control at the edge",
        "MikroTik Layer 3 core switch for core switching and VLAN trunking",
        "Virtualised Linux services on Proxmox VE, including a local DNS resolver",
        "Dedicated network-attached storage for backups and shared files",
        "Proactive, sensor-based monitoring and alerting with PRTG"
      ],
      challenges: "Getting inter-VLAN routing and firewall rules right without either leaving gaps or accidentally locking myself out of my own management plane was the steepest learning curve — it took several iterations of rule ordering and testing to get least-privilege access working cleanly between zones. Sizing the Proxmox host so that DNS, storage, and monitoring services all had guaranteed resources without starving each other under load was a second, more subtle balancing act.",
      lessons: "Segmentation is only as good as the rules enforcing it — the design on paper and the design as actually implemented in firewall ACLs are two different things, and only one of them matters. I also came away with a much deeper appreciation for observability: a network you can't monitor is a network you're only guessing about, and PRTG turned troubleshooting from reactive guesswork into evidence-based diagnosis."
    },
    {
      id: "eth1",
      title: "Enterprise Office Network Simulation",
      stack: ["Cisco Packet Tracer"],
      problem: "I wanted to move beyond small lab topologies and prove I could design a network the way a real office or branch site would need one: resilient to a single switch failure, cleanly segmented by department, and able to serve both wired and wireless clients through a proper hierarchical design rather than a flat, ad-hoc layout.",
      role: "I designed and built the full topology independently in Cisco Packet Tracer, covering the core, distribution, and access layers, and configured routing, switching, VLANs, and wireless from the ground up.",
      features: [
        "Hierarchical core / distribution / access design",
        "Redundant core switches protected by RSTP (Rapid Spanning Tree Protocol) failover",
        "VLAN segmentation by department/function across the campus",
        "Dedicated DNS infrastructure for internal name resolution",
        "Multiple routers handling inter-VLAN routing and ISP connectivity",
        "Wireless access points on segmented SSIDs/VLANs, plus edge switching"
      ],
      challenges: "Tuning RSTP so that the redundant core links converged quickly and predictably after a simulated failure — without accidentally creating a loop — required careful attention to root bridge election and port roles. Coordinating DHCP scopes, VLAN tagging, and inter-VLAN routing so every segment could reach the internet and internal DNS, but nothing else it shouldn't, was the second major challenge.",
      lessons: "Redundancy is not automatic just because you've added a second device — protocols like RSTP have to be deliberately configured and verified under failure conditions to actually deliver resilience. This project also sharpened my understanding of how hierarchical design keeps a network both scalable and troubleshoot-able as it grows, which now directly informs how I plan segmentation in my own homelab."
    },
    {
      id: "eth2",
      title: "Lerato Orphanage Management System",
      stack: ["C#", "WinForms", "SQL Server"],
      problem: "A local orphanage needed a reliable way to manage resident, staff, and administrative records digitally instead of relying on paper-based or ad-hoc processes, with proper controls over who could view or edit sensitive information.",
      role: "I designed and developed the full desktop application end to end — the relational database schema, the WinForms user interface, and the C# business logic connecting the two.",
      features: [
        "User authentication and role-based access control",
        "Full CRUD (create, read, update, delete) functionality across core data entities",
        "Normalised relational database backend built on SQL Server",
        "Built-in reporting so administrators can generate summaries without manual data compilation"
      ],
      challenges: "Designing a database schema and access model that could correctly enforce role-based permissions at both the application and data layer — while keeping the WinForms interface simple enough for non-technical staff to use confidently — was the central challenge of the build.",
      lessons: "This project gave me hands-on experience translating a real organisation's operational needs into a working data model and interface, and reinforced how much of an application's reliability comes down to getting the underlying database design right before a single form is built."
    },
    {
      id: "eth3",
      title: "Additional Academic Projects",
      stack: ["C++", "Python", "Java", "Oracle"],
      problem: "Across my coursework I worked through a range of smaller, focused projects designed to build foundational programming and data-handling skills across multiple languages and paradigms, rather than a single large build.",
      role: "I developed each application independently as part of university modules, applying object-oriented principles and database concepts to progressively more involved problem sets.",
      features: [
        "A weather data processing and analysis application",
        "Statistical analysis tooling over structured datasets",
        "Database management with an Oracle backend",
        "A series of exercises establishing foundational object-oriented programming concepts across C++, Python and Java"
      ],
      challenges: "Moving between languages with different syntax, memory models, and conventions within a single semester meant constantly re-adapting the same underlying logic to each language's idioms, which sharpened my ability to reason about problems independently of any one language.",
      lessons: "These projects built the programming fundamentals that now underpin my larger builds — from clean control flow and data structures to relational database design — and gave me early, repeated practice at debugging logic errors methodically rather than by trial and error."
    }
  ],

  github: "https://github.com/StefanHSnyman"
};
