/* ============================================================
   content.js — all editable content lives here.
   Update this file; main.js renders it. No HTML edits needed.
   Placeholders are marked with ph: true — replace before launch.
   ============================================================ */

const SITE_CONTENT = {
  skills: [
    {
      title: "networking & infrastructure",
      items: ["Network Design", "VLANs", "Routing & Switching", "Subnetting", "OSPF", "BGP", "RSTP", "DHCP", "DNS", "Wireless Networking"]
    },
    {
      title: "network tools & monitoring",
      items: ["Cisco Packet Tracer", "MikroTik / Winbox", "pfSense", "PRTG Network Monitor", "Kentik", "Splynx"]
    },
    {
      title: "virtualization & systems",
      items: ["Proxmox VE", "VirtualBox", "VMware", "Linux", "Docker"]
    },
    {
      title: "programming & web",
      items: ["C#", "C++", "Python", "Java", "SQL", "JavaScript", "React", "Node.js / Express"]
    },
    {
      title: "databases & dev tools",
      items: ["Oracle", "Microsoft SQL Server", "SQLite", "MongoDB", "GitHub", "VS Code"]
    }
  ],

  projects: [
    {
      id: "eth0",
      title: "Enterprise Hybrid Homelab",
      stack: ["MikroTik", "pfSense", "Proxmox VE", "PRTG"],
      summary: "An enterprise-inspired, always-on lab: segmented VLANs, firewalling, virtualised Linux services, local DNS, network storage and proactive monitoring.",
      problem: "Enterprise networking can't be learned from slides alone. I wanted a real environment where design decisions have consequences — where a bad firewall rule or a flat network actually bites.",
      role: "Architect and operator — I designed the topology, built every layer, and keep it running.",
      features: [
        "Multi-VLAN segmentation with inter-VLAN firewalling",
        "pfSense at the edge with local DNS",
        "Virtualised Linux services on Proxmox VE",
        "Network-attached storage",
        "Proactive infrastructure monitoring with PRTG"
      ],
      highlights: { text: "[Add 1–2 specific challenges you solved — e.g. a VLAN routing issue, a monitoring alert you chased down]", ph: true },
      learned: { text: "[Add what this project taught you — segmentation trade-offs, DNS design, capacity planning…]", ph: true },
      repo: null,
      demo: null
    },
    {
      id: "eth1",
      title: "Enterprise Office Network Simulation",
      stack: ["Cisco Packet Tracer"],
      summary: "A hierarchical enterprise network design: redundant core, RSTP failover, dedicated DNS, multi-router routing, ISP connectivity, wireless and edge switching.",
      problem: "Design a complete office network the way an enterprise would — hierarchical, redundant, and segmented — rather than a flat single-switch topology.",
      role: "Sole designer — topology, addressing, VLAN plan and redundancy strategy.",
      features: [
        "Hierarchical core / distribution / access design",
        "Redundant core switches with RSTP failover",
        "VLAN segmentation across the campus",
        "Dedicated DNS infrastructure",
        "Multiple routers with ISP connectivity",
        "Wireless access points and edge switching"
      ],
      highlights: { text: "[Add a design challenge — e.g. how you verified failover, or an addressing decision]", ph: true },
      learned: { text: "[Add the key takeaway — redundancy design, spanning tree behaviour, hierarchy]", ph: true },
      repo: null,
      demo: null
    },
    {
      id: "eth2",
      title: "Lerato Orphanage Management System",
      stack: ["C#", "WinForms", "SQL Server"],
      summary: "A desktop management system with authentication, role-based access, a relational database, full CRUD and reporting.",
      problem: "An orphanage's records need structure, security and accountability — not spreadsheets. The system centralises management with controlled access per role.",
      role: "Developer — application logic, database schema and UI.",
      features: [
        "User authentication and role-based access control",
        "Relational database integration (SQL Server)",
        "Full CRUD functionality",
        "Reporting"
      ],
      highlights: { text: "[Add a technical highlight — e.g. how roles were enforced, or a schema decision]", ph: true },
      learned: { text: "[Add what you learned — relational design, auth patterns, WinForms architecture]", ph: true },
      repo: null,
      demo: null
    },
    {
      id: "eth3",
      title: "Academic Project Portfolio",
      stack: ["C++", "Python", "Java", "Oracle"],
      summary: "A set of university applications spanning weather data, statistical analysis, database management and object-oriented foundations.",
      problem: "Coursework across four languages and paradigms — each project a different problem domain, from data processing to OO design.",
      role: "Developer on each project.",
      features: [
        "Weather data application",
        "Statistical analysis tooling",
        "Database management with Oracle",
        "Foundational object-oriented programming"
      ],
      highlights: { text: "[Pick one project and add its most interesting technical detail]", ph: true },
      learned: { text: "[Add the cross-cutting lesson — e.g. how paradigms differ across C++, Java and Python]", ph: true },
      repo: null,
      demo: null
    }
  ],

  github: "https://github.com/StefanHSnyman"
};
