import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const THEME = {
  forest: "#1F4D3A",
  forestDark: "#16382B",
  forestSoft: "#E7F0EB",
  rust: "#A84A32",
  rustSoft: "#F7EAE6",
  gold: "#B9852F",
  goldSoft: "#F7F0DF",
  ink: "#17211C",
  muted: "#617068",
  page: "#F4F5F2",
  card: "#FFFFFF",
  border: "#DDE3DE",
  danger: "#A32B2B",
  warning: "#9B6515",
  success: "#2D6A4F",
  info: "#315D8C",
};

const ROLE_LABELS = {
  student: "Student",
  trainer: "Trainer",
  compliance: "Compliance",
};

const UNIT_DATA = [
  ["AHCWHS302", "Contribute to workplace health and safety processes", "core", 1, "Claire Donnelly", "Hazard identification, PPE, consultation, incident reporting and safe work procedures for horticulture workplaces."],
  ["AHCWRK320", "Apply environmentally sustainable work practices", "core", 1, "Claire Donnelly", "Water, energy and material efficiency, waste reduction and environmentally responsible horticultural practice."],
  ["AHCPCM308", "Identify and select plants", "core", 1, "Mark Ellison", "Botanical naming, plant identification, site requirements and selecting plants for workplace and client needs."],
  ["AHCSOL304", "Implement soil improvements for garden and turf areas", "core", 1, "Mark Ellison", "Soil testing, interpreting results, selecting amendments and implementing soil improvement programs."],
  ["AHCPCM305", "Implement a plant nutrition program", "elective", 1, "Mark Ellison", "Plant nutrition, deficiency symptoms, fertiliser selection, application rates and monitoring."],
  ["AHCPGD307", "Implement a plant establishment program", "elective", 2, "Nathan Briggs", "Site preparation, plant installation, staking, watering, mulching and establishment monitoring."],
  ["AHCNSY313", "Implement a propagation plan", "elective", 2, "Nathan Briggs", "Propagation planning, seed and cutting techniques, hygiene, environmental controls and production records."],
  ["AHCPMG301", "Control weeds", "core", 2, "Rebecca Sloan", "Weed identification, integrated control methods, workplace procedures and treatment records."],
  ["AHCBIO303", "Apply biosecurity measures", "elective", 2, "Rebecca Sloan", "Recognising biosecurity risks, hygiene controls, movement procedures and reporting suspected incursions."],
  ["AHCPMG302", "Control plant pests, diseases and disorders", "core", 3, "Rebecca Sloan", "Diagnosis, monitoring, integrated pest management and evaluating plant health treatments."],
  ["AHCCHM304", "Transport and store chemicals", "core", 3, "Rebecca Sloan", "Labels, safety data sheets, segregation, secure transport, storage inspections and emergency response."],
  ["AHCCHM307", "Prepare and apply chemicals to control pests, weeds and diseases", "core", 3, "Rebecca Sloan", "Application planning, calculations, calibration, safe mixing, application and record keeping."],
  ["AHCIRG346", "Operate pressurised irrigation systems", "core", 3, "Nathan Briggs", "System components, start-up, operation, monitoring, fault response and shutdown procedures."],
  ["AHCIRG337", "Measure irrigation delivery system performance", "elective", 3, "Nathan Briggs", "Pressure and flow measurement, catch-can testing, distribution uniformity and performance reporting."],
  ["AHCMOM304", "Operate machinery and equipment", "core", 4, "Luke Hammond", "Pre-start checks, safe operation, routine servicing and shutdown of horticultural machinery."],
  ["AHCPGD309", "Perform specialist amenity pruning", "core", 4, "Mark Ellison", "Pruning objectives, plant responses, safe techniques, specialist cuts and post-work inspection."],
  ["AHCPGD310", "Implement a landscape maintenance program", "elective", 4, "Claire Donnelly", "Maintenance planning, scheduling, resourcing, monitoring and seasonal program adjustment."],
];

const QUIZ_BANK = {
  AHCWHS302: [
    ["Who is responsible for reporting a near miss?", ["Only the supervisor", "Any worker who witnesses it", "Only the WHS officer"], 1],
    ["A risk control should be reviewed when:", ["The task never changes", "An incident occurs or conditions change", "Only at the end of the year"], 1],
  ],
  AHCPCM308: [
    ["In binomial nomenclature, the second word identifies the:", ["Family", "Genus", "Specific epithet"], 2],
    ["Plant selection should first consider:", ["Site conditions and intended function", "Flower colour only", "What is cheapest today"], 0],
  ],
  AHCCHM307: [
    ["Directions on a registered chemical label are:", ["Optional guidance", "Legally enforceable", "Only for commercial farms"], 1],
    ["Calibration is used to confirm:", ["The correct application output", "The colour of the mixture", "The age of the spray unit"], 0],
  ],
  AHCPGD309: [
    ["A branch-removal cut is normally made:", ["Just outside the branch collar", "Flush with the trunk", "Through the branch bark ridge"], 0],
    ["Pruning objectives should be confirmed:", ["After all cuts are completed", "Before selecting techniques", "Only if the tree is unhealthy"], 1],
  ],
};

const DUE_DATES = [
  "7 Aug 2026",
  "14 Aug 2026",
  "21 Aug 2026",
  "28 Aug 2026",
  "4 Sep 2026",
  "11 Sep 2026",
  "18 Sep 2026",
  "25 Sep 2026",
];

function makeModules(code, title, summary) {
  return [
    {
      id: `${code}-m1`,
      title: "Orientation and workplace context",
      type: "lesson",
      duration: "25 min",
      description: `How ${title.toLowerCase()} applies in horticulture workplaces, including responsibilities, terminology and expected workplace standards.`,
      resources: ["Learner guide — Module 1", "Trainer presentation", "Key terms glossary"],
    },
    {
      id: `${code}-m2`,
      title: "Technical knowledge and planning",
      type: "lesson",
      duration: "45 min",
      description: summary,
      resources: ["Interactive lesson", "Workplace case study", "Downloadable field reference"],
    },
    {
      id: `${code}-m3`,
      title: "Demonstration and guided practice",
      type: "practical",
      duration: "2 hr",
      description: "Trainer-led demonstration followed by supervised practice using campus facilities, tools and workplace documentation.",
      resources: ["Demonstration video", "Practical activity sheet", "Pre-start checklist"],
    },
    {
      id: `${code}-m4`,
      title: "Workplace application and review",
      type: "activity",
      duration: "60 min",
      description: "Apply the process to a workplace scenario, record decisions and review performance against the unit requirements.",
      resources: ["Scenario workbook", "Self-check activity", "Discussion prompt"],
    },
  ];
}

const UNITS = UNIT_DATA.map(([code, title, type, term, trainer, summary], index) => ({
  code,
  title,
  type,
  term,
  trainer,
  summary,
  dueDate: DUE_DATES[index % DUE_DATES.length],
  location: term === 3 ? "Chemical and irrigation training area" : term === 4 ? "Machinery yard and demonstration gardens" : "Dubbo Training Campus",
  modules: makeModules(code, title, summary),
  quiz: (QUIZ_BANK[code] || [
    ["Which action should occur before starting workplace activity?", ["Confirm requirements and hazards", "Begin immediately", "Complete records after leaving the site"], 0],
    ["Evidence of completed work should be:", ["Clear, current and connected to the task", "Anonymous and undated", "Based only on memory"], 0],
  ]).map(([q, options, answer]) => ({ q, options, answer })),
  assessment: {
    id: `${code}-AT1`,
    title: `Assessment task: ${title}`,
    dueDate: DUE_DATES[index % DUE_DATES.length],
    attemptsAllowed: 2,
    requirements: [
      "Complete the knowledge questions",
      "Submit workplace planning or activity documentation",
      "Provide practical evidence or complete a trainer observation",
      "Respond to assessor follow-up questions where required",
    ],
    mapping: ["Elements and performance criteria", "Performance evidence", "Knowledge evidence", "Assessment conditions"],
  },
}));

const ANNOUNCEMENTS = [
  { id: 1, title: "Wet-weather practical arrangements", author: "Matthew Hollis", date: "Today", body: "Thursday morning practicals will begin in Training Room 2. Bring wet-weather PPE for the afternoon field session." },
  { id: 2, title: "Chemical training PPE check", author: "Rebecca Sloan", date: "Yesterday", body: "Students commencing Term 3 activities must bring their issued respirator and chemical-resistant gloves for inspection." },
  { id: 3, title: "Student support drop-in", author: "Michelle Grant", date: "24 Jul", body: "Study and assessment support is available each Tuesday from 3:30 pm in the Learning Hub." },
];

const CALENDAR_EVENTS = [
  { id: 1, date: "27 Jul", time: "8:30 am", title: "Plant identification field walk", type: "class", location: "Native demonstration garden" },
  { id: 2, date: "28 Jul", time: "10:45 am", title: "Soil testing practical", type: "practical", location: "Soil laboratory" },
  { id: 3, date: "30 Jul", time: "9:00 am", title: "Trainer consultation", type: "support", location: "Learning Hub" },
  { id: 4, date: "7 Aug", time: "11:59 pm", title: "WHS knowledge assessment due", type: "assessment", location: "WPHI Learn" },
  { id: 5, date: "14 Aug", time: "11:59 pm", title: "Sustainable practices project due", type: "assessment", location: "WPHI Learn" },
];

const DEMO_STUDENTS = [
  { id: "S10021", name: "Jordan Riley", attendance: 94, progress: 61, alerts: 0, lastActive: "12 min ago" },
  { id: "S10022", name: "Amelia Grant", attendance: 88, progress: 55, alerts: 1, lastActive: "1 hr ago" },
  { id: "S10023", name: "Lachlan Moore", attendance: 76, progress: 42, alerts: 2, lastActive: "Yesterday" },
  { id: "S10024", name: "Ruby Chen", attendance: 97, progress: 68, alerts: 0, lastActive: "25 min ago" },
  { id: "S10025", name: "Noah Thompson", attendance: 82, progress: 49, alerts: 1, lastActive: "2 days ago" },
  { id: "S10026", name: "Grace Williams", attendance: 91, progress: 63, alerts: 0, lastActive: "3 hr ago" },
];

const DEFAULT_PROGRESS = Object.fromEntries(
  UNITS.map((unit, index) => [
    unit.code,
    {
      completedModules: index === 0 ? [unit.modules[0].id, unit.modules[1].id] : index === 1 ? [unit.modules[0].id] : [],
      quiz: index === 0 ? "passed" : "not_started",
      status: index === 0 ? "resubmission_required" : index === 1 ? "in_progress" : "not_started",
      evidence: index === 0 ? [{ id: "EV-1001", name: "WHS-site-inspection.pdf", type: "PDF", size: "1.8 MB", submitted: "24 Jul 2026, 2:16 pm", description: "Completed hazard inspection and control plan for the nursery work area." }] : [],
      feedback: index === 0 ? "Good hazard identification. Please add the consultation record and resubmit the final page." : "",
      outcome: "",
      attempt: index === 0 ? 1 : 0,
      dueDate: unit.dueDate,
    },
  ])
);

const DEFAULT_AUDIT = [
  { id: "AUD-1004", time: "27 Jul 2026, 9:18 am", user: "Claire Donnelly", action: "Viewed assessment submission", item: "AHCWHS302 — Jordan Riley" },
  { id: "AUD-1003", time: "26 Jul 2026, 4:42 pm", user: "Jordan Riley", action: "Uploaded evidence", item: "WHS-site-inspection.pdf" },
  { id: "AUD-1002", time: "26 Jul 2026, 2:09 pm", user: "Priya Nair", action: "Published assessment version", item: "AHCPCM308 AT1 v2.1" },
  { id: "AUD-1001", time: "25 Jul 2026, 11:31 am", user: "System", action: "SIS enrolment synchronised", item: "2026-T3-HORT-A" },
];

function storageGet(key) {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.storage?.get) return window.storage.get(key).catch(() => null);
  try {
    const value = window.localStorage.getItem(key);
    return Promise.resolve(value ? { value } : null);
  } catch {
    return Promise.resolve(null);
  }
}

function storageSet(key, value) {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.storage?.set) return window.storage.set(key, value).catch(() => {});
  try {
    window.localStorage.setItem(key, value);
  } catch {}
  return Promise.resolve();
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Icon({ name, size = 20 }) {
  const icons = {
    home: "M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
    book: "M4 4.5A2.5 2.5 0 0 1 6.5 2H12v18H6.5A2.5 2.5 0 0 0 4 22.5Zm16 0A2.5 2.5 0 0 0 17.5 2H12v18h5.5a2.5 2.5 0 0 1 2.5 2.5Z",
    calendar: "M6 2v4m12-4v4M3 9h18M5 4h14a2 2 0 0 1 2 2v15H3V6a2 2 0 0 1 2-2Z",
    clipboard: "M9 5h6m-7 4h8m-8 4h8m-8 4h5M9 2h6l1 3H8Zm-3 2H4v18h16V4h-2",
    chart: "M4 20V10m6 10V4m6 16v-7m5 7H2",
    message: "M4 4h16v13H8l-4 4Z",
    help: "M12 18h.01M9.2 9a3 3 0 1 1 4.5 2.6c-1.2.7-1.7 1.2-1.7 2.4M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
    bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4",
    search: "m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z",
    chevron: "m9 18 6-6-6-6",
    check: "m5 12 4 4L19 6",
    play: "m8 5 11 7-11 7Z",
    upload: "M12 16V4m0 0-5 5m5-5 5 5M5 15v6h14v-6",
    file: "M6 2h8l4 4v16H6Zm8 0v5h5",
    users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87m-1-10a4 4 0 0 1 0 7.75",
    shield: "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Zm-3-11 2 2 4-4",
    filter: "M4 5h16M7 12h10m-7 7h4",
    arrow: "m9 18 6-6-6-6",
    clock: "M12 7v5l3 2m7-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
    menu: "M4 6h16M4 12h16M4 18h16",
    close: "M6 6l12 12M18 6 6 18",
    settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-13v2m0 15v2M4.6 4.6 6 6m12 12 1.4 1.4M2.5 12h2m15 0h2M4.6 19.4 6 18m12-12 1.4-1.4",
  };
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[name] || icons.help} />
    </svg>
  );
}

function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function ProgressBar({ value, label, tone = "green" }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-wrap" aria-label={`${label}: ${safe}%`}>
      <div className="progress-meta"><span>{label}</span><strong>{safe}%</strong></div>
      <div className="progress-track"><div className={`progress-fill ${tone}`} style={{ width: `${safe}%` }} /></div>
    </div>
  );
}

function EmptyState({ icon = "file", title, body, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon name={icon} size={28} /></div>
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}

function StatusBadge({ status }) {
  const labels = {
    not_started: ["Not started", "neutral"],
    in_progress: ["In progress", "info"],
    submitted: ["Submitted", "gold"],
    awaiting_assessment: ["Awaiting assessment", "gold"],
    changes_requested: ["Changes requested", "warning"],
    resubmission_required: ["Resubmission required", "warning"],
    satisfactory: ["Satisfactory", "success"],
    not_yet_satisfactory: ["Not yet satisfactory", "danger"],
    competent: ["Competent", "success"],
    not_yet_competent: ["Not yet competent", "danger"],
  };
  const [label, tone] = labels[status] || [status, "neutral"];
  return <Badge tone={tone}>{label}</Badge>;
}

function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="section-actions">{actions}</div>}
    </div>
  );
}

function AppShell({ role, setRole, active, setActive, children, unread, mobileNav, setMobileNav }) {
  const studentNav = [
    ["dashboard", "home", "Dashboard"],
    ["course", "book", "My course"],
    ["calendar", "calendar", "Calendar"],
    ["assessments", "clipboard", "Assessments"],
    ["results", "chart", "Results"],
    ["messages", "message", "Messages"],
    ["support", "help", "Support"],
  ];
  const trainerNav = [
    ["trainer-dashboard", "home", "Trainer dashboard"],
    ["marking", "clipboard", "Marking queue"],
    ["cohort", "users", "Cohort progress"],
    ["calendar", "calendar", "Calendar"],
    ["messages", "message", "Messages"],
  ];
  const complianceNav = [
    ["compliance-dashboard", "shield", "Compliance overview"],
    ["mapping", "clipboard", "Assessment mapping"],
    ["audit", "file", "Audit history"],
    ["integrations", "settings", "Integrations"],
  ];
  const nav = role === "student" ? studentNav : role === "trainer" ? trainerNav : complianceNav;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="topbar">
        <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Icon name="menu" /></button>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><span>W</span></div>
          <div><strong>WPHI Learn</strong><small>Western Plains Horticulture Institute</small></div>
        </div>
        <div className="global-search">
          <Icon name="search" size={18} />
          <label className="sr-only" htmlFor="global-search">Search WPHI Learn</label>
          <input id="global-search" placeholder="Search units, resources and support" />
        </div>
        <div className="top-actions">
          <button className="icon-button notification-button" aria-label={`${unread} unread notifications`}><Icon name="bell" /><span>{unread}</span></button>
          <div className="role-control">
            <label htmlFor="role-select">Preview role</label>
            <select id="role-select" value={role} onChange={(e) => { setRole(e.target.value); setActive(e.target.value === "student" ? "dashboard" : e.target.value === "trainer" ? "trainer-dashboard" : "compliance-dashboard"); }}>
              <option value="student">Student</option>
              <option value="trainer">Trainer</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>
          <button className="profile-button"><span>JR</span><div><strong>Jordan Riley</strong><small>{ROLE_LABELS[role]} preview</small></div><Icon name="chevron" size={16} /></button>
        </div>
      </header>

      <aside className={cx("sidebar", mobileNav && "mobile-open")}>
        <div className="mobile-nav-head"><strong>Navigation</strong><button className="icon-button" aria-label="Close navigation" onClick={() => setMobileNav(false)}><Icon name="close" /></button></div>
        <nav aria-label="Primary navigation">
          {nav.map(([key, icon, label]) => (
            <button key={key} className={cx("nav-item", active === key && "active")} onClick={() => { setActive(key); setMobileNav(false); }}>
              <Icon name={icon} size={19} /><span>{label}</span>{key === "messages" && <span className="nav-count">2</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><strong>Need help?</strong><span>Student Services</span><button onClick={() => { setActive("support"); setMobileNav(false); }}>Contact support</button></div>
          <small>RTO 49271 · Version 2 prototype</small>
        </div>
      </aside>
      {mobileNav && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <main id="main-content" className="main-content">{children}</main>
    </div>
  );
}

function StudentDashboard({ progress, openUnit, setActive }) {
  const current = UNITS[0];
  const completed = Object.values(progress).filter((p) => p.outcome === "competent").length;
  const submitted = Object.values(progress).filter((p) => ["submitted", "awaiting_assessment", "resubmission_required"].includes(p.status)).length;
  const overall = Math.round(
    Object.entries(progress).reduce((sum, [code, item]) => {
      const unit = UNITS.find((u) => u.code === code);
      const modulePart = unit ? (item.completedModules.length / unit.modules.length) * 55 : 0;
      const quizPart = item.quiz === "passed" ? 15 : 0;
      const submissionPart = item.evidence.length ? 20 : 0;
      const outcomePart = item.outcome === "competent" ? 10 : 0;
      return sum + modulePart + quizPart + submissionPart + outcomePart;
    }, 0) / UNITS.length
  );
  return (
    <div>
      <SectionHeader eyebrow="Monday, 27 July 2026" title="Good morning, Jordan" description="Here is what needs your attention in Certificate III in Horticulture." />
      <div className="metric-grid">
        <div className="metric-card"><span>Course progress</span><strong>{overall}%</strong><small>Across 17 units</small></div>
        <div className="metric-card"><span>Units competent</span><strong>{completed}<em>/17</em></strong><small>Qualification outcomes</small></div>
        <div className="metric-card"><span>Assessments active</span><strong>{submitted + 2}</strong><small>Submitted or in progress</small></div>
        <div className="metric-card"><span>Attendance</span><strong>94%</strong><small>Current term</small></div>
      </div>

      <div className="dashboard-grid">
        <section className="card continue-card">
          <div className="card-head"><div><span className="eyebrow">Continue learning</span><h2>{current.code}</h2></div><Badge tone="warning">Action required</Badge></div>
          <h3>{current.title}</h3>
          <p>{progress[current.code].feedback}</p>
          <ProgressBar value={62} label="Unit completion" />
          <div className="button-row"><button className="button primary" onClick={() => openUnit(current, "assessment")}>Review assessment feedback</button><button className="button secondary" onClick={() => openUnit(current, "modules")}>Open unit</button></div>
        </section>

        <section className="card today-card">
          <div className="card-head"><div><span className="eyebrow">Today</span><h2>Your timetable</h2></div><button className="text-button" onClick={() => setActive("calendar")}>Full calendar</button></div>
          <div className="timeline-list">
            <div className="timeline-item"><time>8:30</time><div><strong>Plant identification field walk</strong><span>Native demonstration garden · Mark Ellison</span></div></div>
            <div className="timeline-item"><time>10:45</time><div><strong>Soil testing practical</strong><span>Soil laboratory · Mark Ellison</span></div></div>
            <div className="timeline-item"><time>1:30</time><div><strong>Study and assessment workshop</strong><span>Learning Hub · Michelle Grant</span></div></div>
          </div>
        </section>
      </div>

      <div className="dashboard-grid lower">
        <section className="card">
          <div className="card-head"><div><span className="eyebrow">Next actions</span><h2>Upcoming and overdue</h2></div><button className="text-button" onClick={() => setActive("assessments")}>All assessments</button></div>
          <div className="action-list">
            <button onClick={() => openUnit(UNITS[0], "assessment")}><span className="action-icon warning"><Icon name="clipboard" /></span><div><strong>Resubmit WHS workplace evidence</strong><span>AHCWHS302 · Due 7 Aug</span></div><StatusBadge status="resubmission_required" /></button>
            <button onClick={() => openUnit(UNITS[1], "assessment")}><span className="action-icon info"><Icon name="file" /></span><div><strong>Sustainable work practices project</strong><span>AHCWRK320 · Due 14 Aug</span></div><StatusBadge status="in_progress" /></button>
            <button onClick={() => openUnit(UNITS[2], "modules")}><span className="action-icon success"><Icon name="book" /></span><div><strong>Complete plant identification module</strong><span>AHCPCM308 · 45 minutes</span></div><Badge tone="neutral">Learning</Badge></button>
          </div>
        </section>

        <section className="card">
          <div className="card-head"><div><span className="eyebrow">Campus updates</span><h2>Announcements</h2></div><Badge tone="info">3 new</Badge></div>
          <div className="announcement-list">
            {ANNOUNCEMENTS.map((item) => <article key={item.id}><div><strong>{item.title}</strong><span>{item.author} · {item.date}</span></div><p>{item.body}</p></article>)}
          </div>
        </section>
      </div>
    </div>
  );
}

function CourseView({ progress, openUnit }) {
  const [term, setTerm] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = UNITS.filter((u) => (term === "all" || u.term === Number(term)) && `${u.code} ${u.title}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div>
      <SectionHeader eyebrow="AHC30722" title="Certificate III in Horticulture" description="17 units · 11 core · 6 elective · Dubbo Training Campus" actions={<button className="button secondary"><Icon name="calendar" size={17} /> Course timetable</button>} />
      <div className="course-hero card">
        <div><Badge tone="success">Currently enrolled</Badge><h2>2026 Term 3 Horticulture — Cohort A</h2><p>Trainer-led practical delivery supported by online learning and workplace evidence.</p></div>
        <div className="course-progress"><ProgressBar value={22} label="Qualification completion" /><span>Expected completion: 28 January 2028</span></div>
      </div>
      <div className="toolbar">
        <div className="search-field"><Icon name="search" size={18} /><label className="sr-only" htmlFor="unit-search">Search units</label><input id="unit-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search unit code or title" /></div>
        <div className="filter-group"><Icon name="filter" size={18} /><label htmlFor="term-filter">Term</label><select id="term-filter" value={term} onChange={(e) => setTerm(e.target.value)}><option value="all">All terms</option><option value="1">Term 1</option><option value="2">Term 2</option><option value="3">Term 3</option><option value="4">Term 4</option></select></div>
      </div>
      {[1, 2, 3, 4].map((t) => {
        const units = filtered.filter((u) => u.term === t);
        if (!units.length) return null;
        return <section key={t} className="term-section"><div className="term-heading"><div><span>Term {t}</span><small>{units.length} units</small></div><div className="term-line" /></div><div className="unit-grid">{units.map((unit) => <UnitCard key={unit.code} unit={unit} item={progress[unit.code]} onOpen={() => openUnit(unit, "overview")} />)}</div></section>;
      })}
    </div>
  );
}

function UnitCard({ unit, item, onOpen }) {
  const completed = item.completedModules.length;
  const learning = Math.round((completed / unit.modules.length) * 100);
  return (
    <button className="unit-card" onClick={onOpen}>
      <div className="unit-top"><span className="unit-code">{unit.code}</span><Badge tone={unit.type === "core" ? "rust" : "gold"}>{unit.type}</Badge></div>
      <h3>{unit.title}</h3>
      <p>{unit.summary}</p>
      <div className="unit-meta"><span><Icon name="users" size={15} />{unit.trainer}</span><span><Icon name="calendar" size={15} />Due {unit.dueDate}</span></div>
      <ProgressBar value={learning} label="Learning completed" />
      <div className="unit-footer"><StatusBadge status={item.status} /><span>Open unit <Icon name="arrow" size={15} /></span></div>
    </button>
  );
}

function UnitWorkspace({ unit, progress, updateProgress, initialTab = "overview", close }) {
  const [tab, setTab] = useState(initialTab);
  const [expanded, setExpanded] = useState(unit.modules[0].id);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [files, setFiles] = useState([]);
  const fileRef = useRef(null);
  const item = progress[unit.code];
  const learningProgress = Math.round((item.completedModules.length / unit.modules.length) * 100);

  const toggleModule = (moduleId) => setExpanded((prev) => prev === moduleId ? "" : moduleId);
  const markModule = (moduleId) => {
    const set = new Set(item.completedModules);
    set.add(moduleId);
    updateProgress(unit.code, { completedModules: [...set], status: item.status === "not_started" ? "in_progress" : item.status });
  };
  const submitQuiz = () => {
    const correct = unit.quiz.filter((q, i) => quizAnswers[i] === q.answer).length;
    const passed = correct === unit.quiz.length;
    setQuizResult({ correct, total: unit.quiz.length, passed });
    if (passed) updateProgress(unit.code, { quiz: "passed", status: item.status === "not_started" ? "in_progress" : item.status });
  };
  const addEvidence = () => {
    if (!files.length || !evidenceDescription.trim()) return;
    const now = "27 Jul 2026, 10:42 am";
    const evidence = files.map((file, index) => ({ id: `EV-${Date.now()}-${index}`, name: file.name, type: file.type || "File", size: `${Math.max(0.1, file.size / 1024 / 1024).toFixed(1)} MB`, submitted: now, description: evidenceDescription.trim() }));
    updateProgress(unit.code, { evidence: [...item.evidence, ...evidence], status: "submitted", attempt: Math.max(1, item.attempt + 1) });
    setFiles([]);
    setEvidenceDescription("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <button className="back-button" onClick={close}><Icon name="arrow" size={17} /> Back to course</button>
      <div className="unit-header card">
        <div><div className="unit-identity"><span className="unit-code large">{unit.code}</span><Badge tone={unit.type === "core" ? "rust" : "gold"}>{unit.type} unit</Badge><span>Term {unit.term}</span></div><h1>{unit.title}</h1><p>{unit.summary}</p><div className="unit-detail-meta"><span><Icon name="users" size={17} /> Trainer: {unit.trainer}</span><span><Icon name="calendar" size={17} /> Assessment due: {unit.assessment.dueDate}</span><span><Icon name="clock" size={17} /> 4 modules</span></div></div>
        <div className="unit-progress-panel"><ProgressBar value={learningProgress} label="Learning activities" /><ProgressBar value={item.quiz === "passed" ? 100 : 0} label="Knowledge assessment" tone="gold" /><ProgressBar value={item.evidence.length ? 100 : 0} label="Practical evidence" tone="rust" /><StatusBadge status={item.outcome || item.status} /></div>
      </div>
      <div className="tabs" role="tablist" aria-label="Unit sections">
        {["overview", "modules", "assessment", "results"].map((key) => <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{key[0].toUpperCase() + key.slice(1)}</button>)}
      </div>

      {tab === "overview" && <div className="two-column">
        <section className="card content-card"><h2>Unit overview</h2><p>This unit is delivered through trainer-led workshops, guided practical activities, self-paced learning and formal assessment. You must complete all required assessment components before a competency decision can be made.</p><h3>What you will learn</h3><ul className="check-list"><li>Plan work according to workplace requirements</li><li>Select and use appropriate tools, equipment and documentation</li><li>Complete practical work safely and effectively</li><li>Monitor outcomes and maintain workplace records</li></ul><h3>Delivery and location</h3><p>{unit.location}. Practical activities may be rescheduled during unsafe weather conditions.</p></section>
        <aside className="stack"><section className="card info-panel"><h3>Your trainer</h3><div className="person-row"><span className="avatar">{unit.trainer.split(" ").map((n) => n[0]).join("")}</span><div><strong>{unit.trainer}</strong><span>Horticulture Trainer and Assessor</span><button className="text-button">Send message</button></div></div></section><section className="card info-panel"><h3>Assessment summary</h3><StatusBadge status={item.status} /><dl><div><dt>Due date</dt><dd>{unit.assessment.dueDate}</dd></div><div><dt>Attempts used</dt><dd>{item.attempt} of {unit.assessment.attemptsAllowed}</dd></div><div><dt>Evidence files</dt><dd>{item.evidence.length}</dd></div></dl><button className="button primary full" onClick={() => setTab("assessment")}>Open assessment</button></section></aside>
      </div>}

      {tab === "modules" && <section className="card module-list"><div className="card-head"><div><h2>Learning modules</h2><p>Complete each module before beginning the formal assessment.</p></div><Badge tone="info">{item.completedModules.length}/{unit.modules.length} complete</Badge></div>{unit.modules.map((module, index) => { const complete = item.completedModules.includes(module.id); const isOpen = expanded === module.id; return <article key={module.id} className={cx("module-item", complete && "complete")}><button className="module-summary" onClick={() => toggleModule(module.id)} aria-expanded={isOpen}><span className="module-number">{complete ? <Icon name="check" size={18} /> : index + 1}</span><div><span className="module-kind">{module.type} · {module.duration}</span><strong>{module.title}</strong></div><Icon name="chevron" size={18} /></button>{isOpen && <div className="module-body"><p>{module.description}</p><div className="resource-grid">{module.resources.map((resource, i) => <button key={resource} className="resource-card"><span className="resource-icon"><Icon name={i === 1 ? "play" : "file"} size={19} /></span><span><strong>{resource}</strong><small>{i === 1 ? "Video · 12 min" : "Document · Accessible PDF"}</small></span></button>)}</div><div className="module-actions">{complete ? <Badge tone="success"><Icon name="check" size={14} /> Completed</Badge> : <button className="button primary" onClick={() => markModule(module.id)}>Mark module complete</button>}</div></div>}</article>; })}</section>}

      {tab === "assessment" && <div className="assessment-layout">
        <section className="card content-card">
          <div className="card-head"><div><span className="eyebrow">{unit.assessment.id}</span><h2>{unit.assessment.title}</h2></div><StatusBadge status={item.status} /></div>
          <div className="assessment-banner"><Icon name="clock" /><div><strong>Due {unit.assessment.dueDate}</strong><span>Two attempts are included. Ask your trainer before the due date if you need support or an extension.</span></div></div>
          <h3>Assessment requirements</h3><ol className="number-list">{unit.assessment.requirements.map((r) => <li key={r}>{r}</li>)}</ol>
          <details className="declaration"><summary>Student declaration and authenticity</summary><p>By submitting, you declare that the work is your own, that all contributors and sources are acknowledged, and that the practical evidence accurately represents work you completed.</p></details>

          <div className="assessment-section">
            <div className="assessment-section-head"><span>Part A</span><div><h3>Knowledge questions</h3><p>Answer all questions correctly. You can review your learning materials before resubmitting.</p></div>{item.quiz === "passed" && <Badge tone="success">Passed</Badge>}</div>
            {unit.quiz.map((q, i) => <fieldset key={i} className="quiz-question"><legend>{i + 1}. {q.q}</legend>{q.options.map((option, j) => <label key={option} className="radio-row"><input type="radio" name={`${unit.code}-q${i}`} checked={quizAnswers[i] === j} onChange={() => setQuizAnswers((prev) => ({ ...prev, [i]: j }))} /><span>{option}</span></label>)}</fieldset>)}
            <button className="button primary" onClick={submitQuiz}>Submit knowledge answers</button>
            {quizResult && <div className={cx("result-message", quizResult.passed ? "success" : "warning")} role="status"><strong>{quizResult.correct} of {quizResult.total} correct.</strong> {quizResult.passed ? "Knowledge component passed." : "Review your answers and try again."}</div>}
          </div>

          <div className="assessment-section">
            <div className="assessment-section-head"><span>Part B</span><div><h3>Practical evidence portfolio</h3><p>Upload clear, current evidence and explain what the evidence demonstrates.</p></div></div>
            {item.feedback && <div className="feedback-callout"><strong>Trainer feedback</strong><p>{item.feedback}</p></div>}
            <label className="field-label" htmlFor="evidence-description">Evidence description</label>
            <textarea id="evidence-description" rows="4" value={evidenceDescription} onChange={(e) => setEvidenceDescription(e.target.value)} placeholder="Describe the task, date, location, your role and what each file shows." />
            <label className="upload-zone" htmlFor="evidence-files"><Icon name="upload" size={28} /><strong>Choose evidence files</strong><span>Photos, video, PDF, Word or workplace records · maximum 500 MB per file</span><input ref={fileRef} id="evidence-files" type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} /></label>
            {!!files.length && <div className="selected-files">{files.map((file) => <div key={`${file.name}-${file.size}`}><Icon name="file" size={17} /><span>{file.name}</span><small>{Math.max(0.1, file.size / 1024 / 1024).toFixed(1)} MB</small></div>)}</div>}
            <div className="form-check"><input id="declaration" type="checkbox" /><label htmlFor="declaration">I confirm this evidence is my own work and accurately represents the activity completed.</label></div>
            <button className="button primary" disabled={!files.length || !evidenceDescription.trim()} onClick={addEvidence}>Submit evidence portfolio</button>
          </div>
        </section>
        <aside className="stack sticky-side"><section className="card info-panel"><h3>Submission history</h3>{item.evidence.length ? <div className="evidence-list">{item.evidence.map((file) => <div key={file.id}><span className="file-tile"><Icon name="file" /></span><div><strong>{file.name}</strong><span>{file.type} · {file.size}</span><small>{file.submitted}</small></div></div>)}</div> : <p className="muted">No evidence submitted yet.</p>}</section><section className="card info-panel"><h3>Need help?</h3><p>Contact your trainer before submitting if the assessment instructions or required evidence are unclear.</p><button className="button secondary full">Message {unit.trainer.split(" ")[0]}</button><button className="text-button full">Request reasonable adjustment</button></section></aside>
      </div>}

      {tab === "results" && <section className="card content-card"><div className="card-head"><div><h2>Results and feedback</h2><p>Assessment outcomes are shown separately from your learning activity completion.</p></div><StatusBadge status={item.outcome || item.status} /></div><div className="results-grid"><div><span>Knowledge assessment</span><strong>{item.quiz === "passed" ? "Satisfactory" : "Not completed"}</strong></div><div><span>Practical evidence</span><strong>{item.evidence.length ? "Submitted" : "Not submitted"}</strong></div><div><span>Final unit outcome</span><strong>{item.outcome ? item.outcome.replaceAll("_", " ") : "Not yet determined"}</strong></div></div>{item.feedback ? <div className="feedback-callout"><strong>Latest trainer feedback</strong><p>{item.feedback}</p><small>Claire Donnelly · 26 Jul 2026, 4:18 pm</small></div> : <EmptyState icon="message" title="No feedback yet" body="Trainer feedback will appear here after your assessment is reviewed." />}</section>}
    </div>
  );
}

function AssessmentsView({ progress, openUnit }) {
  const [filter, setFilter] = useState("all");
  const rows = UNITS.filter((unit) => filter === "all" || progress[unit.code].status === filter);
  return <div><SectionHeader eyebrow="Student assessment centre" title="Assessments" description="View due dates, submission status, attempts and trainer feedback." /><div className="card table-card"><div className="table-toolbar"><div className="filter-tabs">{[["all", "All"], ["in_progress", "In progress"], ["submitted", "Submitted"], ["resubmission_required", "Action required"]].map(([key, label]) => <button key={key} className={filter === key ? "active" : ""} onClick={() => setFilter(key)}>{label}</button>)}</div><button className="button secondary"><Icon name="calendar" size={16} /> Assessment calendar</button></div><div className="responsive-table"><table><thead><tr><th>Assessment</th><th>Due</th><th>Attempt</th><th>Status</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>{rows.map((unit) => { const item = progress[unit.code]; return <tr key={unit.code}><td><span className="table-code">{unit.code}</span><strong>{unit.assessment.title}</strong><small>{unit.trainer}</small></td><td>{unit.assessment.dueDate}</td><td>{Math.max(item.attempt, 0)} of 2</td><td><StatusBadge status={item.status} /></td><td><button className="text-button" onClick={() => openUnit(unit, "assessment")}>Open</button></td></tr>; })}</tbody></table></div></div></div>;
}

function CalendarView() {
  const [view, setView] = useState("agenda");
  return <div><SectionHeader eyebrow="Course schedule" title="Calendar" description="Classes, practical sessions, assessment dates and support appointments." actions={<button className="button secondary">Add calendar feed</button>} /><div className="calendar-layout"><section className="card calendar-card"><div className="calendar-head"><div><button className="icon-button"><Icon name="arrow" /></button><h2>July 2026</h2><button className="icon-button"><Icon name="arrow" /></button></div><div className="segmented"><button className={view === "month" ? "active" : ""} onClick={() => setView("month")}>Month</button><button className={view === "agenda" ? "active" : ""} onClick={() => setView("agenda")}>Agenda</button></div></div>{view === "agenda" ? <div className="agenda-list">{CALENDAR_EVENTS.map((event) => <article key={event.id}><div className="date-block"><strong>{event.date.split(" ")[0]}</strong><span>{event.date.split(" ")[1]}</span></div><div className={`event-dot ${event.type}`} /><div><span>{event.time}</span><strong>{event.title}</strong><small>{event.location}</small></div><Badge tone={event.type === "assessment" ? "rust" : event.type === "practical" ? "gold" : "info"}>{event.type}</Badge></article>)}</div> : <MonthGrid />}</section><aside className="stack"><section className="card info-panel"><h3>Calendar key</h3><ul className="legend"><li><span className="event-dot class" />Class</li><li><span className="event-dot practical" />Practical</li><li><span className="event-dot assessment" />Assessment</li><li><span className="event-dot support" />Support</li></ul></section><section className="card info-panel"><h3>Weather notice</h3><p>Outdoor sessions may change during unsafe heat, storms or high winds. Check announcements before travelling.</p></section></aside></div></div>;
}

function MonthGrid() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  return <div className="month-grid"><div className="week-label">Mon</div><div className="week-label">Tue</div><div className="week-label">Wed</div><div className="week-label">Thu</div><div className="week-label">Fri</div><div className="week-label">Sat</div><div className="week-label">Sun</div>{days.map((day, i) => <div key={i} className={cx("day-cell", (day < 1 || day > 31) && "outside", day === 27 && "today")}><span>{day < 1 ? 30 + day : day > 31 ? day - 31 : day}</span>{[7, 14, 21, 27, 28, 30].includes(day) && <div className="mini-event">{day === 27 ? "Plant ID" : day === 28 ? "Soil practical" : day === 30 ? "Support" : "Assessment due"}</div>}</div>)}</div>;
}

function ResultsView({ progress }) {
  return <div><SectionHeader eyebrow="Academic record" title="Results" description="Learning activity, assessment components and final competency outcomes are reported separately." /><div className="metric-grid"><div className="metric-card"><span>Competent units</span><strong>{Object.values(progress).filter((x) => x.outcome === "competent").length}<em>/17</em></strong><small>Final outcomes</small></div><div className="metric-card"><span>Satisfactory tasks</span><strong>{Object.values(progress).filter((x) => x.quiz === "passed").length}</strong><small>Assessment components</small></div><div className="metric-card"><span>Awaiting assessment</span><strong>{Object.values(progress).filter((x) => x.status === "submitted").length}</strong><small>Trainer review</small></div><div className="metric-card"><span>Current average</span><strong>—</strong><small>VET uses competency outcomes</small></div></div><div className="card table-card"><div className="responsive-table"><table><thead><tr><th>Unit</th><th>Learning</th><th>Knowledge</th><th>Evidence</th><th>Outcome</th></tr></thead><tbody>{UNITS.map((unit) => { const item = progress[unit.code]; return <tr key={unit.code}><td><span className="table-code">{unit.code}</span><strong>{unit.title}</strong></td><td>{item.completedModules.length}/{unit.modules.length}</td><td>{item.quiz === "passed" ? <Badge tone="success">Satisfactory</Badge> : <Badge>Not completed</Badge>}</td><td>{item.evidence.length ? <Badge tone="gold">Submitted</Badge> : <Badge>Not submitted</Badge>}</td><td><StatusBadge status={item.outcome || "not_started"} /></td></tr>; })}</tbody></table></div></div></div>;
}

function MessagesView() {
  const [selected, setSelected] = useState(0);
  const conversations = [
    { name: "Claire Donnelly", subject: "WHS assessment feedback", preview: "I have added notes to the final section…", time: "9:18 am", unread: true },
    { name: "Michelle Grant", subject: "Study support appointment", preview: "Tuesday at 3:30 pm is available…", time: "Yesterday", unread: true },
    { name: "Mark Ellison", subject: "Plant identification field walk", preview: "Please bring your field guide and hat…", time: "24 Jul", unread: false },
  ];
  const current = conversations[selected];
  return <div><SectionHeader eyebrow="Communication" title="Messages" description="Contact trainers and student support within your course." actions={<button className="button primary">New message</button>} /><div className="message-layout card"><aside className="conversation-list"><div className="search-field"><Icon name="search" size={17} /><input aria-label="Search messages" placeholder="Search messages" /></div>{conversations.map((c, i) => <button key={c.subject} className={selected === i ? "active" : ""} onClick={() => setSelected(i)}>{c.unread && <span className="unread-dot" />}<span className="avatar small">{c.name.split(" ").map((n) => n[0]).join("")}</span><div><strong>{c.name}</strong><span>{c.subject}</span><small>{c.preview}</small></div><time>{c.time}</time></button>)}</aside><section className="conversation"><div className="conversation-head"><span className="avatar">{current.name.split(" ").map((n) => n[0]).join("")}</span><div><strong>{current.name}</strong><span>Horticulture Trainer and Assessor</span></div></div><div className="message-thread"><div className="message received"><span>Yesterday, 4:18 pm</span><p>Your hazard identification was thorough. Please add the consultation record and resubmit the final page. I have highlighted the relevant assessment criterion.</p></div><div className="message sent"><span>Today, 8:52 am</span><p>Thanks Claire. Does the consultation record need both student signatures, or is the supervisor signature enough?</p></div><div className="message received"><span>Today, 9:18 am</span><p>Please include the supervisor signature and record who took part in the discussion. You can use the consultation template in the assessment resources.</p></div></div><div className="compose"><label className="sr-only" htmlFor="reply">Reply</label><textarea id="reply" rows="2" placeholder="Write a reply" /><button className="button primary">Send</button></div></section></div></div>;
}

function SupportView() {
  return <div><SectionHeader eyebrow="Student services" title="Support" description="Practical help with learning, accessibility, wellbeing, technology and course administration." /><div className="support-grid">{[
    ["Academic and LLN support", "Study planning, reading, writing, numeracy and assessment preparation.", "Michelle Grant", "Book appointment"],
    ["Reasonable adjustment", "Discuss disability, health or access needs and appropriate assessment adjustments.", "Student Support", "Request support"],
    ["Technical support", "Login, upload, browser and device assistance for WPHI systems.", "ICT Service Desk", "Create ticket"],
    ["Fees and enrolment", "Payment plans, enrolment records, withdrawals and course administration.", "Enrolments Office", "Contact office"],
    ["Wellbeing referral", "Confidential referral to local health, family and community support services.", "Student Services", "View services"],
    ["Complaints and appeals", "Submit feedback, a complaint or an assessment appeal and track its progress.", "RTO Manager", "Open form"],
  ].map(([title, body, contact, action]) => <section className="card support-card" key={title}><span className="support-icon"><Icon name={title.includes("Technical") ? "settings" : title.includes("Complaints") ? "shield" : "help"} /></span><h2>{title}</h2><p>{body}</p><span>{contact}</span><button className="button secondary full">{action}</button></section>)}</div><section className="card urgent-card"><div><Badge tone="danger">Urgent assistance</Badge><h2>Campus safety or immediate wellbeing concern</h2><p>Call campus reception on 02 5550 4720. In an emergency, call 000.</p></div><button className="button primary">View emergency contacts</button></section></div>;
}

function TrainerDashboard({ progress, setActive, openMarking }) {
  const queue = UNITS.filter((u) => ["submitted", "resubmission_required"].includes(progress[u.code].status));
  return <div><SectionHeader eyebrow="Trainer workspace" title="Good morning, Claire" description="Cohort 2026-T3-HORT-A · 18 active students" actions={<button className="button primary">Create announcement</button>} /><div className="metric-grid"><div className="metric-card"><span>Awaiting assessment</span><strong>12</strong><small>4 due within two days</small></div><div className="metric-card"><span>Resubmissions</span><strong>5</strong><small>Students require action</small></div><div className="metric-card"><span>At-risk students</span><strong>3</strong><small>Attendance or progress alert</small></div><div className="metric-card"><span>Average turnaround</span><strong>2.1<em> days</em></strong><small>Target: 10 business days</small></div></div><div className="dashboard-grid"><section className="card"><div className="card-head"><div><span className="eyebrow">Assessment workload</span><h2>Priority marking queue</h2></div><button className="text-button" onClick={() => setActive("marking")}>View all</button></div><div className="marking-list">{[
    ["Jordan Riley", "AHCWHS302", "Resubmitted workplace evidence", "38 min ago", "resubmission_required"],
    ["Amelia Grant", "AHCPCM308", "Plant identification portfolio", "2 hr ago", "submitted"],
    ["Lachlan Moore", "AHCSOL304", "Soil improvement project", "Yesterday", "submitted"],
    ["Ruby Chen", "AHCWRK320", "Sustainability workplace report", "Yesterday", "submitted"],
  ].map((row, i) => <button key={row[0]} onClick={() => openMarking(i)}><span className="avatar small">{row[0].split(" ").map((n) => n[0]).join("")}</span><div><strong>{row[0]}</strong><span>{row[1]} · {row[2]}</span><small>{row[3]}</small></div><StatusBadge status={row[4]} /></button>)}</div></section><section className="card"><div className="card-head"><div><span className="eyebrow">Today</span><h2>Teaching schedule</h2></div><button className="text-button" onClick={() => setActive("calendar")}>Calendar</button></div><div className="timeline-list"><div className="timeline-item"><time>8:30</time><div><strong>Plant identification field walk</strong><span>18 students · Native demonstration garden</span></div></div><div className="timeline-item"><time>10:45</time><div><strong>Soil testing practical</strong><span>18 students · Soil laboratory</span></div></div><div className="timeline-item"><time>2:30</time><div><strong>Assessment marking block</strong><span>Office 3 · 90 minutes</span></div></div></div></section></div><section className="card at-risk"><div className="card-head"><div><span className="eyebrow">Learner support</span><h2>Students requiring follow-up</h2></div><button className="text-button" onClick={() => setActive("cohort")}>Open cohort</button></div><div className="responsive-table"><table><thead><tr><th>Student</th><th>Attendance</th><th>Progress</th><th>Alert</th><th>Last active</th><th></th></tr></thead><tbody>{DEMO_STUDENTS.filter((s) => s.alerts).map((student) => <tr key={student.id}><td><strong>{student.name}</strong><small>{student.id}</small></td><td>{student.attendance}%</td><td>{student.progress}%</td><td><Badge tone={student.alerts > 1 ? "danger" : "warning"}>{student.alerts} alert{student.alerts > 1 ? "s" : ""}</Badge></td><td>{student.lastActive}</td><td><button className="text-button">Review</button></td></tr>)}</tbody></table></div></section></div>;
}

function MarkingQueue({ openMarking }) {
  const rows = [
    ["Jordan Riley", "AHCWHS302", "Workplace evidence resubmission", "27 Jul 2026", "resubmission_required"],
    ["Amelia Grant", "AHCPCM308", "Plant identification portfolio", "27 Jul 2026", "submitted"],
    ["Lachlan Moore", "AHCSOL304", "Soil improvement project", "26 Jul 2026", "submitted"],
    ["Ruby Chen", "AHCWRK320", "Sustainability workplace report", "26 Jul 2026", "submitted"],
    ["Noah Thompson", "AHCPGD307", "Plant establishment practical", "25 Jul 2026", "submitted"],
  ];
  return <div><SectionHeader eyebrow="Assessment" title="Marking queue" description="Review submissions, record assessor judgements and manage resubmissions." /><div className="card table-card"><div className="table-toolbar"><div className="search-field"><Icon name="search" size={17} /><input aria-label="Search marking queue" placeholder="Search student or unit" /></div><div className="filter-group"><Icon name="filter" size={17} /><select aria-label="Filter status"><option>All statuses</option><option>Submitted</option><option>Resubmission required</option></select></div></div><div className="responsive-table"><table><thead><tr><th>Student</th><th>Unit</th><th>Submission</th><th>Received</th><th>Status</th><th></th></tr></thead><tbody>{rows.map((row, i) => <tr key={row[0]}><td><strong>{row[0]}</strong><small>S1002{i + 1}</small></td><td><span className="table-code">{row[1]}</span></td><td>{row[2]}</td><td>{row[3]}</td><td><StatusBadge status={row[4]} /></td><td><button className="button secondary compact" onClick={() => openMarking(i)}>Assess</button></td></tr>)}</tbody></table></div></div></div>;
}

function MarkingWorkspace({ index = 0, close, progress, updateProgress }) {
  const records = [
    { student: "Jordan Riley", code: "AHCWHS302", task: "Workplace evidence resubmission" },
    { student: "Amelia Grant", code: "AHCPCM308", task: "Plant identification portfolio" },
    { student: "Lachlan Moore", code: "AHCSOL304", task: "Soil improvement project" },
    { student: "Ruby Chen", code: "AHCWRK320", task: "Sustainability workplace report" },
    { student: "Noah Thompson", code: "AHCPGD307", task: "Plant establishment practical" },
  ];
  const record = records[index] || records[0];
  const unit = UNITS.find((u) => u.code === record.code) || UNITS[0];
  const item = progress[unit.code];
  const [criteria, setCriteria] = useState(["satisfactory", "satisfactory", "not_yet_satisfactory", "not_assessed"]);
  const [feedback, setFeedback] = useState(item.feedback || "");
  const [internalNote, setInternalNote] = useState("");
  const [saved, setSaved] = useState(false);
  const finalise = (status) => {
    updateProgress(unit.code, { feedback, status: status === "satisfactory" ? "satisfactory" : "resubmission_required", outcome: status === "satisfactory" ? "competent" : "" });
    setSaved(true);
  };
  return <div><button className="back-button" onClick={close}><Icon name="arrow" size={17} /> Back to marking queue</button><SectionHeader eyebrow={`${record.student} · ${unit.code}`} title={record.task} description={`${unit.title} · Attempt ${Math.max(1, item.attempt)} of 2`} actions={<StatusBadge status={item.status} />} /><div className="marking-workspace"><section className="stack"><div className="card content-card"><div className="card-head"><div><h2>Student submission</h2><p>Submitted 27 Jul 2026, 9:02 am</p></div><button className="button secondary compact">View assessment instructions</button></div><div className="submission-summary"><dl><div><dt>Student declaration</dt><dd><Badge tone="success">Confirmed</Badge></dd></div><div><dt>Reasonable adjustment</dt><dd>None recorded</dd></div><div><dt>Late submission</dt><dd>No</dd></div></dl></div><h3>Evidence files</h3><div className="evidence-preview"><div className="document-preview"><Icon name="file" size={42} /><strong>WHS-site-inspection-resubmission.pdf</strong><span>PDF · 2.1 MB · 8 pages</span><button className="button secondary">Open evidence</button></div><div className="document-preview"><Icon name="play" size={42} /><strong>consultation-discussion.mp4</strong><span>Video · 46 MB · 2:14</span><button className="button secondary">Play video</button></div></div><h3>Student description</h3><p>I completed a hazard inspection with my workplace supervisor and then led a short consultation with two team members. The PDF includes the updated consultation record and signed final page.</p></div><div className="card content-card"><h2>Assessor feedback</h2><label className="field-label" htmlFor="student-feedback">Feedback visible to student</label><textarea id="student-feedback" rows="6" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Explain what was demonstrated and any further evidence required." /><label className="field-label" htmlFor="internal-note">Internal assessor note</label><textarea id="internal-note" rows="3" value={internalNote} onChange={(e) => setInternalNote(e.target.value)} placeholder="Not visible to the student" /></div></section><aside className="card rubric-panel"><div className="rubric-head"><div><span className="eyebrow">Marking rubric</span><h2>Assessment criteria</h2></div><Badge tone="info">Version 2.1</Badge></div>{[
    ["Identify workplace hazards", "Performance criteria 1.1–1.3"],
    ["Apply appropriate risk controls", "Performance criteria 2.1–2.4"],
    ["Consult and communicate", "Performance criteria 3.1–3.3"],
    ["Complete workplace records", "Performance evidence and conditions"],
  ].map(([title, map], i) => <div className="rubric-row" key={title}><div><strong>{title}</strong><span>{map}</span></div><select aria-label={`${title} judgement`} value={criteria[i]} onChange={(e) => setCriteria((prev) => prev.map((v, j) => j === i ? e.target.value : v))}><option value="not_assessed">Not assessed</option><option value="satisfactory">Satisfactory</option><option value="not_yet_satisfactory">Not yet satisfactory</option></select><textarea rows="2" aria-label={`${title} comment`} placeholder="Criterion comment" /></div>)}<div className="decision-panel"><h3>Assessment decision</h3><p>A final unit competency outcome should only be recorded when all assessment requirements have been satisfied.</p><button className="button primary full" disabled={criteria.some((c) => c !== "satisfactory")} onClick={() => finalise("satisfactory")}>Record satisfactory and competent</button><button className="button warning full" onClick={() => finalise("resubmission")}>Request further evidence</button><button className="button secondary full" onClick={() => setSaved(true)}>Save draft</button>{saved && <div className="result-message success" role="status"><strong>Assessment record saved.</strong> Audit history updated.</div>}</div></aside></div></div>;
}

function CohortView() {
  return <div><SectionHeader eyebrow="2026-T3-HORT-A" title="Cohort progress" description="Attendance, activity, unit progression and learner-support indicators." actions={<button className="button secondary">Export progress report</button>} /><div className="card table-card"><div className="table-toolbar"><div className="search-field"><Icon name="search" size={17} /><input aria-label="Search students" placeholder="Search students" /></div><div className="filter-group"><select aria-label="Filter support alert"><option>All students</option><option>Support alerts</option><option>Low attendance</option><option>Inactive 7+ days</option></select></div></div><div className="responsive-table"><table><thead><tr><th>Student</th><th>Attendance</th><th>Course progress</th><th>Units competent</th><th>Alerts</th><th>Last active</th><th></th></tr></thead><tbody>{DEMO_STUDENTS.map((student, i) => <tr key={student.id}><td><strong>{student.name}</strong><small>{student.id}</small></td><td><span className={student.attendance < 80 ? "danger-text" : ""}>{student.attendance}%</span></td><td><div className="mini-progress"><span style={{ width: `${student.progress}%` }} /></div><small>{student.progress}%</small></td><td>{Math.floor(student.progress / 10)} / 17</td><td>{student.alerts ? <Badge tone={student.alerts > 1 ? "danger" : "warning"}>{student.alerts}</Badge> : <Badge tone="success">None</Badge>}</td><td>{student.lastActive}</td><td><button className="text-button">Open profile</button></td></tr>)}</tbody></table></div></div></div>;
}

function ComplianceDashboard({ setActive }) {
  return <div><SectionHeader eyebrow="Quality and compliance" title="RTO compliance overview" description="Operational checks for training delivery, assessment, records and integrations." actions={<button className="button primary">Generate monthly report</button>} /><div className="metric-grid"><div className="metric-card"><span>Mapping coverage</span><strong>96%</strong><small>4 criteria require review</small></div><div className="metric-card"><span>Current assessments</span><strong>31<em>/34</em></strong><small>Three versions expiring</small></div><div className="metric-card"><span>Open quality actions</span><strong>7</strong><small>Two high priority</small></div><div className="metric-card"><span>System integrations</span><strong>4<em>/5</em></strong><small>One requires attention</small></div></div><div className="dashboard-grid"><section className="card"><div className="card-head"><div><span className="eyebrow">Quality actions</span><h2>Items requiring attention</h2></div><button className="text-button">View register</button></div><div className="action-list"><button onClick={() => setActive("mapping")}><span className="action-icon warning"><Icon name="clipboard" /></span><div><strong>Assessment mapping gap</strong><span>AHCIRG337 · Performance Evidence item 3</span></div><Badge tone="warning">High</Badge></button><button><span className="action-icon info"><Icon name="users" /></span><div><strong>Trainer currency review due</strong><span>Luke Hammond · due 14 Aug</span></div><Badge tone="info">Scheduled</Badge></button><button onClick={() => setActive("integrations")}><span className="action-icon warning"><Icon name="settings" /></span><div><strong>SMS sync warning</strong><span>Three unit outcomes rejected overnight</span></div><Badge tone="warning">Review</Badge></button></div></section><section className="card"><div className="card-head"><div><span className="eyebrow">Recent activity</span><h2>Audit events</h2></div><button className="text-button" onClick={() => setActive("audit")}>Full audit history</button></div><div className="audit-mini">{DEFAULT_AUDIT.slice(0, 4).map((event) => <div key={event.id}><span className="audit-icon"><Icon name="file" size={17} /></span><div><strong>{event.action}</strong><span>{event.item}</span><small>{event.user} · {event.time}</small></div></div>)}</div></section></div><section className="card"><div className="card-head"><div><span className="eyebrow">Assessment governance</span><h2>Validation and version status</h2></div><button className="button secondary compact">Open validation schedule</button></div><div className="responsive-table"><table><thead><tr><th>Unit</th><th>Current version</th><th>Mapping</th><th>Last validation</th><th>Next review</th><th>Status</th></tr></thead><tbody>{UNITS.slice(0, 6).map((unit, i) => <tr key={unit.code}><td><span className="table-code">{unit.code}</span><strong>{unit.title}</strong></td><td>v{2 + (i % 2)}.{i}</td><td>{i === 3 ? "92%" : "100%"}</td><td>{i % 2 ? "18 Mar 2026" : "12 Nov 2025"}</td><td>{i % 2 ? "Mar 2027" : "Nov 2026"}</td><td><Badge tone={i === 3 ? "warning" : "success"}>{i === 3 ? "Review" : "Current"}</Badge></td></tr>)}</tbody></table></div></section></div>;
}

function MappingView() {
  const unit = UNITS[12];
  return <div><SectionHeader eyebrow="Assessment governance" title="Assessment mapping" description="Trace every assessment activity to the requirements of the unit of competency." actions={<button className="button secondary">Export mapping matrix</button>} /><div className="mapping-header card"><div><span className="unit-code large">{unit.code}</span><h2>{unit.title}</h2><p>Assessment tool version 2.0 · Published 1 July 2026</p></div><div><ProgressBar value={96} label="Coverage" /><Badge tone="warning">4 items require review</Badge></div></div><div className="card table-card"><div className="responsive-table"><table className="mapping-table"><thead><tr><th>Requirement</th><th>Knowledge questions</th><th>Practical observation</th><th>Workplace evidence</th><th>Coverage</th></tr></thead><tbody>{[
    ["PC 1.1 Identify system components", true, true, false, "covered"],
    ["PC 1.2 Confirm operating requirements", true, true, true, "covered"],
    ["PC 2.1 Complete pre-start checks", false, true, true, "covered"],
    ["PC 2.4 Monitor pressure and flow", true, true, true, "covered"],
    ["PE 3 Respond to two system faults", false, true, false, "gap"],
    ["KE 6 Environmental impacts", true, false, false, "covered"],
    ["AC Workplace or realistic simulation", false, true, true, "covered"],
  ].map((row) => <tr key={row[0]}><td><strong>{row[0]}</strong></td>{row.slice(1, 4).map((v, i) => <td key={i}>{v ? <span className="mapping-check"><Icon name="check" size={16} /></span> : <span className="mapping-empty">—</span>}</td>)}<td><Badge tone={row[4] === "gap" ? "danger" : "success"}>{row[4] === "gap" ? "Gap" : "Covered"}</Badge></td></tr>)}</tbody></table></div></div></div>;
}

function AuditView() {
  return <div><SectionHeader eyebrow="Records integrity" title="Audit history" description="Append-only record of material access, changes, submissions and assessment decisions." actions={<button className="button secondary">Export filtered events</button>} /><div className="card table-card"><div className="table-toolbar"><div className="search-field"><Icon name="search" size={17} /><input aria-label="Search audit events" placeholder="Search user, action or record" /></div><div className="filter-group"><select aria-label="Filter audit category"><option>All categories</option><option>Assessment</option><option>Access</option><option>Content</option><option>Integration</option></select></div></div><div className="responsive-table"><table><thead><tr><th>Event ID</th><th>Date and time</th><th>User</th><th>Action</th><th>Record</th><th>IP / source</th></tr></thead><tbody>{[...DEFAULT_AUDIT, { id: "AUD-1000", time: "25 Jul 2026, 8:15 am", user: "Claire Donnelly", action: "Recorded assessment decision", item: "AHCPCM308 — Amelia Grant" }].map((event, i) => <tr key={event.id}><td><span className="table-code">{event.id}</span></td><td>{event.time}</td><td>{event.user}</td><td>{event.action}</td><td>{event.item}</td><td>{i === 3 ? "SIS API" : "10.24.16.42"}</td></tr>)}</tbody></table></div></div></div>;
}

function IntegrationsView() {
  const integrations = [
    ["Student Management System", "Enrolments, unit outcomes and completion data", "Connected", "Last sync 9:12 am", "success"],
    ["WPHI Identity", "Single sign-on and multi-factor authentication", "Connected", "Healthy", "success"],
    ["Evidence Storage", "Secure documents, images and video", "Connected", "2.8 TB available", "success"],
    ["Email and SMS", "Transactional notifications and reminders", "Connected", "14 messages queued", "success"],
    ["AVETMISS validation service", "Pre-submission data validation", "Attention", "Three rejected records", "warning"],
  ];
  return <div><SectionHeader eyebrow="Platform administration" title="Integrations" description="Status of identity, student management, storage, communication and reporting services." actions={<button className="button secondary">Run health check</button>} /><div className="integration-grid">{integrations.map(([name, body, status, detail, tone]) => <section className="card integration-card" key={name}><div className="integration-icon"><Icon name={name.includes("Identity") ? "shield" : name.includes("Storage") ? "file" : name.includes("Email") ? "message" : "settings"} /></div><div><h2>{name}</h2><p>{body}</p><div><Badge tone={tone}>{status}</Badge><span>{detail}</span></div></div><button className="button secondary compact">Manage</button></section>)}</div><section className="card sync-log"><div className="card-head"><div><h2>Recent synchronisation activity</h2><p>Outbound and inbound records processed during the past 24 hours.</p></div></div><div className="responsive-table"><table><thead><tr><th>Time</th><th>Service</th><th>Operation</th><th>Records</th><th>Result</th></tr></thead><tbody><tr><td>9:12 am</td><td>Student Management System</td><td>Enrolment sync</td><td>18</td><td><Badge tone="success">Successful</Badge></td></tr><tr><td>8:45 am</td><td>AVETMISS validator</td><td>Outcome validation</td><td>42</td><td><Badge tone="warning">39 accepted, 3 rejected</Badge></td></tr><tr><td>8:30 am</td><td>Email and SMS</td><td>Due-date reminders</td><td>27</td><td><Badge tone="success">Sent</Badge></td></tr></tbody></table></div></section></div>;
}

export default function WPHILearnV2() {
  const [role, setRole] = useState("student");
  const [active, setActive] = useState("dashboard");
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitTab, setSelectedUnitTab] = useState("overview");
  const [markingIndex, setMarkingIndex] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    storageGet("wphi-v2-progress").then((record) => {
      if (record?.value) {
        try { setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(record.value) }); } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((next) => {
    setProgress(next);
    storageSet("wphi-v2-progress", JSON.stringify(next));
  }, []);

  const updateProgress = useCallback((code, patch) => {
    setProgress((prev) => {
      const next = { ...prev, [code]: { ...prev[code], ...patch } };
      storageSet("wphi-v2-progress", JSON.stringify(next));
      return next;
    });
  }, []);

  const openUnit = (unit, tab = "overview") => {
    setSelectedUnit(unit);
    setSelectedUnitTab(tab);
    setMarkingIndex(null);
  };

  const openMarking = (index) => {
    setMarkingIndex(index);
    setSelectedUnit(null);
  };

  const unread = useMemo(() => role === "student" ? 3 : role === "trainer" ? 7 : 2, [role]);

  let content;
  if (!loaded) {
    content = <div className="loading-screen"><div className="loader" /><strong>Loading WPHI Learn</strong></div>;
  } else if (selectedUnit) {
    content = <UnitWorkspace unit={selectedUnit} progress={progress} updateProgress={updateProgress} initialTab={selectedUnitTab} close={() => setSelectedUnit(null)} />;
  } else if (markingIndex !== null) {
    content = <MarkingWorkspace index={markingIndex} close={() => setMarkingIndex(null)} progress={progress} updateProgress={updateProgress} />;
  } else {
    const views = {
      dashboard: <StudentDashboard progress={progress} openUnit={openUnit} setActive={setActive} />,
      course: <CourseView progress={progress} openUnit={openUnit} />,
      calendar: <CalendarView />,
      assessments: <AssessmentsView progress={progress} openUnit={openUnit} />,
      results: <ResultsView progress={progress} />,
      messages: <MessagesView />,
      support: <SupportView />,
      "trainer-dashboard": <TrainerDashboard progress={progress} setActive={setActive} openMarking={openMarking} />,
      marking: <MarkingQueue openMarking={openMarking} />,
      cohort: <CohortView />,
      "compliance-dashboard": <ComplianceDashboard setActive={setActive} />,
      mapping: <MappingView />,
      audit: <AuditView />,
      integrations: <IntegrationsView />,
    };
    content = views[active] || views.dashboard;
  }

  return (
    <>
      <style>{`
        :root { color-scheme: light; }
        * { box-sizing: border-box; }
        body { margin: 0; }
        button, input, select, textarea { font: inherit; }
        button { color: inherit; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        .skip-link { position: fixed; top: 8px; left: 8px; z-index: 100; background: #fff; padding: 10px 14px; border-radius: 8px; transform: translateY(-150%); }
        .skip-link:focus { transform: translateY(0); }
        .app-shell { min-height: 100vh; background: ${THEME.page}; color: ${THEME.ink}; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .topbar { position: sticky; top: 0; z-index: 30; height: 76px; display: flex; align-items: center; gap: 22px; padding: 0 24px; background: rgba(255,255,255,.96); border-bottom: 1px solid ${THEME.border}; backdrop-filter: blur(10px); }
        .brand-lockup { min-width: 270px; display: flex; align-items: center; gap: 12px; }
        .brand-lockup strong, .brand-lockup small { display: block; }
        .brand-lockup strong { font-size: 18px; letter-spacing: -.02em; }
        .brand-lockup small { color: ${THEME.muted}; margin-top: 2px; font-size: 11px; }
        .brand-mark { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: ${THEME.forest}; color: white; font-family: Georgia, serif; font-size: 22px; font-weight: 700; position: relative; overflow: hidden; }
        .brand-mark::after { content: ""; position: absolute; width: 24px; height: 11px; border-radius: 50% 0 50% 0; border: 1px solid rgba(255,255,255,.55); transform: rotate(-20deg); right: -5px; bottom: 2px; }
        .global-search { flex: 1; max-width: 580px; height: 42px; display: flex; align-items: center; gap: 9px; padding: 0 13px; border: 1px solid ${THEME.border}; border-radius: 11px; background: ${THEME.page}; color: ${THEME.muted}; }
        .global-search input, .search-field input { width: 100%; border: 0; outline: 0; background: transparent; color: ${THEME.ink}; }
        .top-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
        .icon-button { border: 0; background: transparent; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 9px; cursor: pointer; }
        .icon-button:hover { background: ${THEME.forestSoft}; }
        .notification-button { position: relative; }
        .notification-button > span { position: absolute; top: 3px; right: 2px; min-width: 17px; height: 17px; padding: 0 4px; display: grid; place-items: center; border-radius: 20px; background: ${THEME.rust}; color: white; font-size: 10px; font-weight: 700; }
        .role-control { display: grid; grid-template-columns: auto auto; align-items: center; gap: 6px; padding: 5px 8px; border: 1px solid ${THEME.border}; border-radius: 9px; }
        .role-control label { font-size: 11px; color: ${THEME.muted}; }
        .role-control select { border: 0; background: transparent; font-weight: 650; color: ${THEME.forest}; outline: 0; }
        .profile-button { display: flex; align-items: center; gap: 8px; border: 0; border-left: 1px solid ${THEME.border}; background: transparent; padding: 4px 0 4px 14px; cursor: pointer; }
        .profile-button > span, .avatar { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: ${THEME.forestSoft}; color: ${THEME.forestDark}; font-weight: 750; font-size: 13px; }
        .profile-button strong, .profile-button small { display: block; text-align: left; }
        .profile-button strong { font-size: 13px; }
        .profile-button small { color: ${THEME.muted}; font-size: 11px; }
        .sidebar { position: fixed; top: 76px; bottom: 0; left: 0; width: 244px; display: flex; flex-direction: column; padding: 18px 14px; background: ${THEME.forestDark}; color: white; z-index: 25; }
        .sidebar nav { display: grid; gap: 4px; }
        .nav-item { width: 100%; min-height: 44px; display: flex; align-items: center; gap: 12px; padding: 10px 12px; border: 0; border-radius: 10px; background: transparent; color: rgba(255,255,255,.78); cursor: pointer; text-align: left; }
        .nav-item:hover { background: rgba(255,255,255,.08); color: white; }
        .nav-item.active { background: white; color: ${THEME.forestDark}; font-weight: 700; }
        .nav-count { margin-left: auto; min-width: 20px; height: 20px; padding: 0 6px; display: grid; place-items: center; border-radius: 999px; background: ${THEME.rust}; color: white; font-size: 11px; font-weight: 750; }
        .sidebar-bottom { margin-top: auto; display: grid; gap: 16px; }
        .sidebar-bottom > small { text-align: center; color: rgba(255,255,255,.45); }
        .help-card { display: grid; gap: 5px; padding: 14px; border: 1px solid rgba(255,255,255,.14); border-radius: 12px; background: rgba(255,255,255,.06); }
        .help-card span { color: rgba(255,255,255,.65); font-size: 12px; }
        .help-card button { margin-top: 5px; border: 0; border-radius: 8px; padding: 8px; background: white; color: ${THEME.forestDark}; font-weight: 700; cursor: pointer; }
        .main-content { margin-left: 244px; padding: 32px; min-height: calc(100vh - 76px); }
        .section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
        .section-header h1 { margin: 3px 0 5px; font-size: clamp(27px, 3vw, 36px); line-height: 1.12; letter-spacing: -.035em; }
        .section-header p { margin: 0; color: ${THEME.muted}; max-width: 780px; line-height: 1.55; }
        .section-actions { display: flex; gap: 10px; }
        .eyebrow { color: ${THEME.forest}; font-size: 11px; font-weight: 800; letter-spacing: .095em; text-transform: uppercase; }
        .card { background: ${THEME.card}; border: 1px solid ${THEME.border}; border-radius: 15px; }
        .metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; margin-bottom: 20px; }
        .metric-card { padding: 18px; background: white; border: 1px solid ${THEME.border}; border-radius: 14px; }
        .metric-card > span, .metric-card > small { display: block; }
        .metric-card > span { color: ${THEME.muted}; font-size: 12px; font-weight: 650; }
        .metric-card > strong { display: block; margin: 7px 0 2px; font-size: 30px; letter-spacing: -.04em; }
        .metric-card > strong em { color: ${THEME.muted}; font-size: 14px; font-style: normal; font-weight: 600; }
        .metric-card > small { color: ${THEME.muted}; }
        .dashboard-grid { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(300px,.85fr); gap: 20px; margin-bottom: 20px; }
        .dashboard-grid.lower { grid-template-columns: minmax(0,1.15fr) minmax(300px,.85fr); }
        .dashboard-grid > .card { padding: 22px; }
        .card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 18px; }
        .card-head h2 { margin: 3px 0 0; font-size: 20px; letter-spacing: -.025em; }
        .card-head p { margin: 4px 0 0; color: ${THEME.muted}; }
        .continue-card h3 { margin: 3px 0 7px; font-size: 24px; }
        .continue-card > p { color: ${THEME.muted}; line-height: 1.55; }
        .button-row { display: flex; gap: 9px; flex-wrap: wrap; margin-top: 18px; }
        .button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 40px; padding: 9px 15px; border-radius: 9px; border: 1px solid transparent; cursor: pointer; font-weight: 700; font-size: 13px; }
        .button:disabled { opacity: .45; cursor: not-allowed; }
        .button.primary { background: ${THEME.forest}; color: white; }
        .button.primary:hover { background: ${THEME.forestDark}; }
        .button.secondary { border-color: ${THEME.border}; background: white; color: ${THEME.ink}; }
        .button.secondary:hover { border-color: ${THEME.forest}; color: ${THEME.forest}; }
        .button.warning { border-color: #E4C893; background: ${THEME.goldSoft}; color: ${THEME.warning}; }
        .button.compact { min-height: 34px; padding: 6px 11px; }
        .button.full, .text-button.full { width: 100%; }
        .text-button { display: inline-flex; align-items: center; gap: 4px; border: 0; background: transparent; color: ${THEME.forest}; font-weight: 750; cursor: pointer; padding: 4px; }
        .badge { display: inline-flex; align-items: center; gap: 4px; width: fit-content; padding: 4px 8px; border-radius: 999px; background: #EEF1EF; color: #536159; font-size: 10px; font-weight: 800; letter-spacing: .025em; text-transform: uppercase; white-space: nowrap; }
        .badge-success { background: ${THEME.forestSoft}; color: ${THEME.success}; }
        .badge-info { background: #E9F0F8; color: ${THEME.info}; }
        .badge-warning, .badge-gold { background: ${THEME.goldSoft}; color: ${THEME.warning}; }
        .badge-danger, .badge-rust { background: ${THEME.rustSoft}; color: ${THEME.danger}; }
        .progress-wrap { margin-top: 12px; }
        .progress-meta { display: flex; justify-content: space-between; color: ${THEME.muted}; font-size: 11px; margin-bottom: 6px; }
        .progress-meta strong { color: ${THEME.ink}; }
        .progress-track { height: 8px; overflow: hidden; border-radius: 999px; background: #E8ECE9; }
        .progress-fill { height: 100%; border-radius: inherit; background: ${THEME.forest}; }
        .progress-fill.gold { background: ${THEME.gold}; }
        .progress-fill.rust { background: ${THEME.rust}; }
        .timeline-list { display: grid; }
        .timeline-item { display: grid; grid-template-columns: 50px 1fr; gap: 12px; padding: 12px 0; border-top: 1px solid ${THEME.border}; }
        .timeline-item:first-child { border-top: 0; padding-top: 0; }
        .timeline-item time { color: ${THEME.forest}; font-size: 12px; font-weight: 800; }
        .timeline-item strong, .timeline-item span { display: block; }
        .timeline-item span { color: ${THEME.muted}; font-size: 12px; margin-top: 3px; }
        .action-list { display: grid; }
        .action-list > button { width: 100%; display: grid; grid-template-columns: 38px 1fr auto; align-items: center; gap: 11px; padding: 12px 0; border: 0; border-top: 1px solid ${THEME.border}; background: transparent; text-align: left; cursor: pointer; }
        .action-list > button:first-child { border-top: 0; padding-top: 0; }
        .action-list strong, .action-list span { display: block; }
        .action-list div > span { color: ${THEME.muted}; font-size: 12px; margin-top: 3px; }
        .action-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 9px; }
        .action-icon.warning { background: ${THEME.goldSoft}; color: ${THEME.warning}; }
        .action-icon.info { background: #E9F0F8; color: ${THEME.info}; }
        .action-icon.success { background: ${THEME.forestSoft}; color: ${THEME.success}; }
        .announcement-list article { padding: 13px 0; border-top: 1px solid ${THEME.border}; }
        .announcement-list article:first-child { border-top: 0; padding-top: 0; }
        .announcement-list strong, .announcement-list span { display: block; }
        .announcement-list span { color: ${THEME.muted}; font-size: 11px; margin-top: 2px; }
        .announcement-list p { margin: 7px 0 0; color: ${THEME.muted}; font-size: 13px; line-height: 1.45; }
        .course-hero { padding: 22px; display: grid; grid-template-columns: 1.2fr .8fr; gap: 30px; align-items: center; margin-bottom: 20px; border-left: 5px solid ${THEME.forest}; }
        .course-hero h2 { margin: 10px 0 5px; }
        .course-hero p, .course-progress > span { color: ${THEME.muted}; }
        .course-progress > span { display: block; margin-top: 8px; font-size: 12px; }
        .toolbar, .table-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; }
        .search-field { min-width: 260px; display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1px solid ${THEME.border}; border-radius: 10px; background: white; color: ${THEME.muted}; }
        .filter-group { display: flex; align-items: center; gap: 8px; color: ${THEME.muted}; }
        .filter-group label { font-size: 12px; font-weight: 650; }
        .filter-group select, .rubric-row select { border: 1px solid ${THEME.border}; border-radius: 9px; background: white; padding: 9px 10px; color: ${THEME.ink}; }
        .term-section { margin-top: 27px; }
        .term-heading { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .term-heading > div:first-child { min-width: 120px; }
        .term-heading span, .term-heading small { display: block; }
        .term-heading span { font-weight: 800; }
        .term-heading small { color: ${THEME.muted}; }
        .term-line { height: 1px; flex: 1; background: ${THEME.border}; }
        .unit-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; }
        .unit-card { display: flex; flex-direction: column; min-height: 310px; padding: 18px; border: 1px solid ${THEME.border}; border-radius: 14px; background: white; text-align: left; cursor: pointer; }
        .unit-card:hover { border-color: #AFC1B5; box-shadow: 0 8px 20px rgba(22,56,43,.07); transform: translateY(-1px); }
        .unit-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .unit-code { width: fit-content; color: ${THEME.forest}; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; font-weight: 850; letter-spacing: .035em; }
        .unit-code.large { padding: 6px 9px; border-radius: 7px; background: ${THEME.forestSoft}; font-size: 13px; }
        .unit-card h3 { margin: 15px 0 8px; font-size: 17px; line-height: 1.3; }
        .unit-card > p { margin: 0; color: ${THEME.muted}; line-height: 1.45; font-size: 13px; }
        .unit-meta { display: grid; gap: 6px; margin-top: 14px; color: ${THEME.muted}; font-size: 11px; }
        .unit-meta span { display: flex; gap: 6px; align-items: center; }
        .unit-footer { margin-top: auto; padding-top: 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .unit-footer > span:last-child { display: flex; align-items: center; gap: 4px; color: ${THEME.forest}; font-size: 12px; font-weight: 750; }
        .back-button { display: inline-flex; align-items: center; gap: 7px; border: 0; background: transparent; color: ${THEME.forest}; font-weight: 750; cursor: pointer; margin-bottom: 14px; }
        .back-button svg { transform: rotate(180deg); }
        .unit-header { padding: 24px; display: grid; grid-template-columns: 1fr 300px; gap: 30px; margin-bottom: 16px; }
        .unit-header h1 { margin: 14px 0 8px; font-size: 29px; letter-spacing: -.035em; }
        .unit-header p { color: ${THEME.muted}; line-height: 1.55; }
        .unit-identity, .unit-detail-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 9px; color: ${THEME.muted}; font-size: 12px; }
        .unit-detail-meta { margin-top: 17px; gap: 18px; }
        .unit-detail-meta span { display: flex; align-items: center; gap: 6px; }
        .unit-progress-panel { padding: 15px; border-radius: 12px; background: ${THEME.page}; }
        .tabs { display: flex; gap: 4px; border-bottom: 1px solid ${THEME.border}; margin-bottom: 18px; }
        .tabs button { padding: 11px 15px; border: 0; border-bottom: 3px solid transparent; background: transparent; color: ${THEME.muted}; cursor: pointer; font-weight: 700; }
        .tabs button.active { border-color: ${THEME.forest}; color: ${THEME.forest}; }
        .two-column, .assessment-layout, .calendar-layout { display: grid; grid-template-columns: minmax(0,1fr) 310px; gap: 18px; align-items: start; }
        .content-card { padding: 24px; }
        .content-card h2 { margin-top: 0; }
        .content-card h3 { margin-top: 24px; }
        .content-card > p, .content-card li { line-height: 1.6; color: #46534B; }
        .stack { display: grid; gap: 16px; }
        .info-panel { padding: 19px; }
        .info-panel h3 { margin: 0 0 13px; }
        .person-row { display: flex; gap: 11px; align-items: flex-start; }
        .person-row strong, .person-row span { display: block; }
        .person-row span { color: ${THEME.muted}; font-size: 11px; margin: 3px 0; }
        .info-panel dl { margin: 14px 0; }
        .info-panel dl div, .submission-summary dl div { display: flex; justify-content: space-between; gap: 15px; padding: 9px 0; border-top: 1px solid ${THEME.border}; }
        .info-panel dt, .submission-summary dt { color: ${THEME.muted}; }
        .info-panel dd, .submission-summary dd { margin: 0; font-weight: 650; text-align: right; }
        .check-list { padding: 0; list-style: none; }
        .check-list li { position: relative; padding-left: 27px; margin: 9px 0; }
        .check-list li::before { content: "✓"; position: absolute; left: 0; width: 19px; height: 19px; display: grid; place-items: center; border-radius: 50%; background: ${THEME.forestSoft}; color: ${THEME.success}; font-size: 12px; font-weight: 900; }
        .module-list { padding: 22px; }
        .module-item { border-top: 1px solid ${THEME.border}; }
        .module-item.complete .module-number { background: ${THEME.forest}; color: white; }
        .module-summary { width: 100%; display: grid; grid-template-columns: 38px 1fr auto; align-items: center; gap: 12px; padding: 17px 0; border: 0; background: transparent; text-align: left; cursor: pointer; }
        .module-summary > svg { transition: transform .2s; }
        .module-number { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 10px; background: ${THEME.page}; font-weight: 800; }
        .module-kind, .module-summary strong { display: block; }
        .module-kind { color: ${THEME.muted}; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; font-weight: 750; margin-bottom: 2px; }
        .module-body { margin: 0 0 17px 50px; padding: 18px; border-radius: 12px; background: ${THEME.page}; }
        .module-body > p { color: ${THEME.muted}; line-height: 1.55; }
        .resource-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
        .resource-card { display: flex; align-items: center; gap: 9px; min-height: 64px; padding: 10px; border: 1px solid ${THEME.border}; border-radius: 10px; background: white; text-align: left; cursor: pointer; }
        .resource-card strong, .resource-card small { display: block; }
        .resource-card strong { font-size: 11px; }
        .resource-card small { margin-top: 2px; color: ${THEME.muted}; font-size: 9px; }
        .resource-icon { width: 31px; height: 31px; display: grid; place-items: center; border-radius: 8px; background: ${THEME.forestSoft}; color: ${THEME.forest}; }
        .module-actions { margin-top: 14px; }
        .assessment-banner { display: flex; gap: 12px; padding: 14px; margin: 18px 0; border-radius: 11px; background: ${THEME.goldSoft}; color: ${THEME.warning}; }
        .assessment-banner strong, .assessment-banner span { display: block; }
        .assessment-banner span { color: #775B31; margin-top: 3px; font-size: 12px; }
        .number-list { counter-reset: req; padding: 0; list-style: none; }
        .number-list li { counter-increment: req; display: flex; gap: 10px; margin: 9px 0; }
        .number-list li::before { content: counter(req); flex: 0 0 23px; height: 23px; display: grid; place-items: center; border-radius: 50%; background: ${THEME.forestSoft}; color: ${THEME.forest}; font-weight: 800; font-size: 11px; }
        .declaration { padding: 12px 0; border-top: 1px solid ${THEME.border}; border-bottom: 1px solid ${THEME.border}; }
        .declaration summary { color: ${THEME.forest}; font-weight: 750; cursor: pointer; }
        .assessment-section { margin-top: 28px; padding-top: 24px; border-top: 1px solid ${THEME.border}; }
        .assessment-section-head { display: grid; grid-template-columns: 50px 1fr auto; gap: 12px; align-items: flex-start; margin-bottom: 18px; }
        .assessment-section-head > span { width: 48px; padding: 6px; border-radius: 7px; background: ${THEME.forestSoft}; color: ${THEME.forest}; font-size: 10px; font-weight: 850; text-align: center; text-transform: uppercase; }
        .assessment-section-head h3 { margin: 0; }
        .assessment-section-head p { margin: 4px 0 0; color: ${THEME.muted}; font-size: 12px; }
        .quiz-question { border: 0; border-top: 1px solid ${THEME.border}; padding: 16px 0; }
        .quiz-question legend { font-weight: 700; margin-bottom: 9px; }
        .radio-row { display: flex; align-items: flex-start; gap: 9px; padding: 8px 10px; margin: 5px 0; border: 1px solid ${THEME.border}; border-radius: 9px; cursor: pointer; }
        .radio-row:has(input:checked) { border-color: ${THEME.forest}; background: ${THEME.forestSoft}; }
        .radio-row input { margin-top: 2px; accent-color: ${THEME.forest}; }
        .result-message { margin-top: 12px; padding: 11px 13px; border-radius: 9px; font-size: 12px; }
        .result-message.success { background: ${THEME.forestSoft}; color: ${THEME.success}; }
        .result-message.warning { background: ${THEME.goldSoft}; color: ${THEME.warning}; }
        .feedback-callout { padding: 14px; margin: 12px 0; border-left: 4px solid ${THEME.gold}; border-radius: 8px; background: ${THEME.goldSoft}; }
        .feedback-callout p { margin: 5px 0; color: #6D5330; }
        .field-label { display: block; margin: 14px 0 6px; font-weight: 700; font-size: 12px; }
        textarea, input[type="text"] { width: 100%; border: 1px solid ${THEME.border}; border-radius: 9px; padding: 10px 11px; background: white; color: ${THEME.ink}; resize: vertical; }
        textarea:focus, input:focus, select:focus, button:focus-visible { outline: 3px solid rgba(49,93,140,.22); outline-offset: 2px; }
        .upload-zone { display: grid; place-items: center; text-align: center; gap: 5px; padding: 24px; margin: 12px 0; border: 2px dashed #B9C6BD; border-radius: 12px; background: ${THEME.page}; color: ${THEME.forest}; cursor: pointer; }
        .upload-zone span { color: ${THEME.muted}; font-size: 11px; }
        .upload-zone input { position: absolute; width: 1px; height: 1px; opacity: 0; }
        .selected-files { display: grid; gap: 6px; margin-bottom: 12px; }
        .selected-files > div { display: grid; grid-template-columns: 20px 1fr auto; gap: 8px; align-items: center; padding: 9px; border: 1px solid ${THEME.border}; border-radius: 9px; }
        .selected-files small { color: ${THEME.muted}; }
        .form-check { display: flex; align-items: flex-start; gap: 9px; margin: 14px 0; font-size: 12px; }
        .form-check input { margin-top: 2px; accent-color: ${THEME.forest}; }
        .sticky-side { position: sticky; top: 96px; }
        .evidence-list { display: grid; gap: 12px; }
        .evidence-list > div { display: flex; gap: 9px; align-items: flex-start; }
        .file-tile { flex: 0 0 34px; height: 38px; display: grid; place-items: center; border-radius: 8px; background: ${THEME.rustSoft}; color: ${THEME.rust}; }
        .evidence-list strong, .evidence-list span, .evidence-list small { display: block; overflow-wrap: anywhere; }
        .evidence-list strong { font-size: 11px; }
        .evidence-list span, .evidence-list small { color: ${THEME.muted}; font-size: 10px; margin-top: 2px; }
        .muted { color: ${THEME.muted}; }
        .results-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 18px 0; }
        .results-grid > div { padding: 14px; border-radius: 10px; background: ${THEME.page}; }
        .results-grid span, .results-grid strong { display: block; }
        .results-grid span { color: ${THEME.muted}; font-size: 11px; }
        .results-grid strong { margin-top: 5px; text-transform: capitalize; }
        .empty-state { text-align: center; padding: 34px 20px; }
        .empty-icon { margin: 0 auto 10px; width: 50px; height: 50px; display: grid; place-items: center; border-radius: 50%; background: ${THEME.page}; color: ${THEME.muted}; }
        .empty-state h3 { margin: 0 0 5px; }
        .empty-state p { color: ${THEME.muted}; }
        .table-card { padding: 18px; }
        .filter-tabs, .segmented { display: inline-flex; padding: 3px; border-radius: 9px; background: ${THEME.page}; }
        .filter-tabs button, .segmented button { border: 0; border-radius: 7px; padding: 8px 11px; background: transparent; color: ${THEME.muted}; cursor: pointer; font-weight: 650; font-size: 12px; }
        .filter-tabs button.active, .segmented button.active { background: white; color: ${THEME.forest}; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
        .responsive-table { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 760px; }
        th { padding: 10px 12px; color: ${THEME.muted}; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; text-align: left; background: ${THEME.page}; }
        td { padding: 13px 12px; border-top: 1px solid ${THEME.border}; vertical-align: middle; font-size: 12px; }
        td strong, td small { display: block; }
        td small { color: ${THEME.muted}; margin-top: 3px; }
        .table-code { display: block; color: ${THEME.forest}; font-family: ui-monospace, monospace; font-size: 10px; font-weight: 800; margin-bottom: 4px; }
        .calendar-card { padding: 20px; }
        .calendar-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .calendar-head > div:first-child { display: flex; align-items: center; gap: 8px; }
        .calendar-head h2 { margin: 0; }
        .calendar-head > div:first-child button:first-child svg { transform: rotate(180deg); }
        .agenda-list article { display: grid; grid-template-columns: 45px 10px 1fr auto; align-items: center; gap: 12px; padding: 15px 0; border-top: 1px solid ${THEME.border}; }
        .agenda-list article:first-child { border-top: 0; }
        .date-block { width: 42px; text-align: center; }
        .date-block strong, .date-block span { display: block; }
        .date-block strong { font-size: 17px; }
        .date-block span { color: ${THEME.muted}; font-size: 10px; text-transform: uppercase; }
        .event-dot { width: 9px; height: 9px; border-radius: 50%; background: ${THEME.info}; }
        .event-dot.practical { background: ${THEME.gold}; }
        .event-dot.assessment { background: ${THEME.rust}; }
        .event-dot.support { background: #7B5EB1; }
        .agenda-list strong, .agenda-list span, .agenda-list small { display: block; }
        .agenda-list span, .agenda-list small { color: ${THEME.muted}; font-size: 11px; }
        .legend { display: grid; gap: 10px; padding: 0; list-style: none; }
        .legend li { display: flex; align-items: center; gap: 9px; }
        .month-grid { display: grid; grid-template-columns: repeat(7,1fr); border-top: 1px solid ${THEME.border}; border-left: 1px solid ${THEME.border}; }
        .week-label { padding: 8px; color: ${THEME.muted}; font-size: 10px; text-align: center; border-right: 1px solid ${THEME.border}; border-bottom: 1px solid ${THEME.border}; }
        .day-cell { min-height: 94px; padding: 8px; border-right: 1px solid ${THEME.border}; border-bottom: 1px solid ${THEME.border}; }
        .day-cell.outside { color: #ADB6B0; background: #FAFBFA; }
        .day-cell.today > span { width: 25px; height: 25px; display: grid; place-items: center; border-radius: 50%; background: ${THEME.forest}; color: white; }
        .mini-event { margin-top: 9px; padding: 5px; border-radius: 5px; background: ${THEME.forestSoft}; color: ${THEME.forest}; font-size: 9px; }
        .message-layout { display: grid; grid-template-columns: 320px minmax(0,1fr); overflow: hidden; min-height: 620px; }
        .conversation-list { padding: 14px; border-right: 1px solid ${THEME.border}; }
        .conversation-list .search-field { min-width: 0; margin-bottom: 11px; }
        .conversation-list > button { width: 100%; display: grid; grid-template-columns: auto 1fr auto; gap: 9px; align-items: start; padding: 12px 8px; border: 0; border-top: 1px solid ${THEME.border}; background: transparent; text-align: left; cursor: pointer; position: relative; }
        .conversation-list > button.active { background: ${THEME.forestSoft}; border-radius: 9px; }
        .avatar.small { width: 32px; height: 32px; font-size: 10px; }
        .conversation-list strong, .conversation-list span, .conversation-list small { display: block; }
        .conversation-list span { font-size: 11px; margin: 2px 0; }
        .conversation-list small { color: ${THEME.muted}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px; }
        .conversation-list time { color: ${THEME.muted}; font-size: 9px; }
        .unread-dot { position: absolute; left: 0; top: 23px; width: 6px; height: 6px; border-radius: 50%; background: ${THEME.rust}; }
        .conversation { display: flex; flex-direction: column; min-width: 0; }
        .conversation-head { display: flex; gap: 10px; align-items: center; padding: 16px; border-bottom: 1px solid ${THEME.border}; }
        .conversation-head strong, .conversation-head span { display: block; }
        .conversation-head span { color: ${THEME.muted}; font-size: 11px; }
        .message-thread { flex: 1; padding: 22px; background: #FAFBF9; }
        .message { max-width: 70%; margin: 10px 0; padding: 12px 14px; border-radius: 12px; background: white; border: 1px solid ${THEME.border}; }
        .message.sent { margin-left: auto; background: ${THEME.forest}; color: white; border-color: ${THEME.forest}; }
        .message span { display: block; color: ${THEME.muted}; font-size: 9px; }
        .message.sent span { color: rgba(255,255,255,.65); }
        .message p { margin: 5px 0 0; line-height: 1.5; }
        .compose { display: grid; grid-template-columns: 1fr auto; gap: 9px; padding: 14px; border-top: 1px solid ${THEME.border}; }
        .support-grid, .integration-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 15px; }
        .support-card { padding: 20px; display: flex; flex-direction: column; }
        .support-icon, .integration-icon { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 11px; background: ${THEME.forestSoft}; color: ${THEME.forest}; }
        .support-card h2 { font-size: 18px; margin: 14px 0 7px; }
        .support-card p { color: ${THEME.muted}; line-height: 1.5; flex: 1; }
        .support-card > span:not(.support-icon) { color: ${THEME.forest}; font-size: 12px; font-weight: 750; margin-bottom: 12px; }
        .urgent-card { margin-top: 18px; padding: 22px; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .urgent-card h2 { margin: 8px 0 4px; }
        .urgent-card p { margin: 0; color: ${THEME.muted}; }
        .marking-list { display: grid; }
        .marking-list > button { display: grid; grid-template-columns: 34px 1fr auto; align-items: center; gap: 9px; padding: 12px 0; border: 0; border-top: 1px solid ${THEME.border}; background: transparent; text-align: left; cursor: pointer; }
        .marking-list > button:first-child { border-top: 0; }
        .marking-list strong, .marking-list span, .marking-list small { display: block; }
        .marking-list span, .marking-list small { color: ${THEME.muted}; font-size: 11px; margin-top: 2px; }
        .at-risk { padding: 22px; }
        .danger-text { color: ${THEME.danger}; font-weight: 800; }
        .mini-progress { width: 110px; height: 7px; border-radius: 99px; background: #E7ECE8; overflow: hidden; display: inline-block; margin-right: 7px; }
        .mini-progress span { display: block; height: 100%; background: ${THEME.forest}; }
        .marking-workspace { display: grid; grid-template-columns: minmax(0,1fr) 390px; gap: 18px; align-items: start; }
        .submission-summary { padding: 12px; margin: 14px 0; border-radius: 10px; background: ${THEME.page}; }
        .submission-summary dl { margin: 0; }
        .evidence-preview { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
        .document-preview { min-height: 170px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 16px; border: 1px solid ${THEME.border}; border-radius: 11px; text-align: center; }
        .document-preview > svg { color: ${THEME.rust}; }
        .document-preview span { color: ${THEME.muted}; font-size: 11px; }
        .rubric-panel { position: sticky; top: 96px; padding: 19px; }
        .rubric-head { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
        .rubric-head h2 { margin: 3px 0; }
        .rubric-row { padding: 15px 0; border-top: 1px solid ${THEME.border}; }
        .rubric-row > div { margin-bottom: 8px; }
        .rubric-row strong, .rubric-row span { display: block; }
        .rubric-row span { color: ${THEME.muted}; font-size: 10px; margin-top: 2px; }
        .rubric-row select { width: 100%; margin-bottom: 7px; }
        .decision-panel { margin: 16px -19px -19px; padding: 19px; background: ${THEME.page}; border-radius: 0 0 15px 15px; }
        .decision-panel h3 { margin-top: 0; }
        .decision-panel p { color: ${THEME.muted}; font-size: 12px; line-height: 1.5; }
        .decision-panel .button { margin-top: 8px; }
        .mapping-header { padding: 20px; display: grid; grid-template-columns: 1fr 300px; gap: 25px; align-items: center; margin-bottom: 18px; }
        .mapping-header h2 { margin: 12px 0 5px; }
        .mapping-header p { margin: 0; color: ${THEME.muted}; }
        .mapping-table td:not(:first-child), .mapping-table th:not(:first-child) { text-align: center; }
        .mapping-check { margin: auto; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; background: ${THEME.forestSoft}; color: ${THEME.success}; }
        .mapping-empty { color: #ABB5AE; }
        .audit-mini { display: grid; }
        .audit-mini > div { display: flex; gap: 9px; padding: 11px 0; border-top: 1px solid ${THEME.border}; }
        .audit-mini > div:first-child { border-top: 0; }
        .audit-icon { flex: 0 0 33px; height: 33px; display: grid; place-items: center; border-radius: 8px; background: ${THEME.page}; color: ${THEME.forest}; }
        .audit-mini strong, .audit-mini span, .audit-mini small { display: block; }
        .audit-mini span, .audit-mini small { color: ${THEME.muted}; font-size: 10px; margin-top: 2px; }
        .integration-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
        .integration-card { padding: 18px; display: grid; grid-template-columns: 44px 1fr auto; gap: 13px; align-items: start; }
        .integration-card h2 { margin: 0; font-size: 17px; }
        .integration-card p { color: ${THEME.muted}; margin: 6px 0 12px; }
        .integration-card div > div:last-child { display: flex; align-items: center; gap: 8px; }
        .integration-card div > div:last-child > span:last-child { color: ${THEME.muted}; font-size: 11px; }
        .sync-log { margin-top: 18px; padding: 20px; }
        .loading-screen { min-height: 60vh; display: grid; place-items: center; align-content: center; gap: 12px; }
        .loader { width: 34px; height: 34px; border: 3px solid ${THEME.border}; border-top-color: ${THEME.forest}; border-radius: 50%; animation: spin .8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .mobile-menu, .mobile-nav-head, .nav-scrim { display: none; }
        @media (max-width: 1180px) {
          .unit-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .metric-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .global-search { display: none; }
          .role-control label { display: none; }
          .support-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
        @media (max-width: 880px) {
          .mobile-menu { display: grid; }
          .brand-lockup { min-width: 0; }
          .brand-lockup small, .profile-button > div, .profile-button > svg { display: none; }
          .sidebar { transform: translateX(-102%); transition: transform .2s; top: 0; z-index: 60; width: min(300px, 88vw); }
          .sidebar.mobile-open { transform: translateX(0); }
          .mobile-nav-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
          .mobile-nav-head .icon-button { color: white; }
          .nav-scrim { display: block; position: fixed; inset: 0; z-index: 50; border: 0; background: rgba(5,18,12,.48); }
          .main-content { margin-left: 0; padding: 24px 18px; }
          .dashboard-grid, .dashboard-grid.lower, .two-column, .assessment-layout, .calendar-layout, .unit-header, .marking-workspace, .mapping-header { grid-template-columns: 1fr; }
          .sticky-side, .rubric-panel { position: static; }
          .message-layout { grid-template-columns: 260px 1fr; }
          .course-hero { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .topbar { height: 66px; padding: 0 12px; gap: 8px; }
          .brand-mark { width: 36px; height: 36px; }
          .brand-lockup strong { font-size: 15px; }
          .role-control { padding: 4px; }
          .role-control select { max-width: 92px; font-size: 11px; }
          .profile-button { padding-left: 8px; }
          .sidebar { top: 0; }
          .main-content { padding: 20px 12px; }
          .section-header { display: block; }
          .section-actions { margin-top: 13px; }
          .metric-grid, .unit-grid, .support-grid, .integration-grid, .results-grid, .resource-grid, .evidence-preview { grid-template-columns: 1fr; }
          .toolbar, .table-toolbar, .urgent-card { align-items: stretch; flex-direction: column; }
          .search-field { min-width: 0; width: 100%; }
          .filter-group { width: 100%; }
          .filter-group select { flex: 1; }
          .unit-card { min-height: 0; }
          .unit-header { padding: 18px; }
          .unit-progress-panel { margin-top: 4px; }
          .module-body { margin-left: 0; }
          .assessment-section-head { grid-template-columns: 45px 1fr; }
          .assessment-section-head > .badge { grid-column: 2; }
          .message-layout { display: block; }
          .conversation-list { border-right: 0; border-bottom: 1px solid ${THEME.border}; }
          .conversation { min-height: 550px; }
          .message { max-width: 90%; }
          .month-grid { font-size: 10px; }
          .day-cell { min-height: 70px; padding: 4px; }
          .mini-event { padding: 3px; font-size: 7px; }
          .integration-card { grid-template-columns: 40px 1fr; }
          .integration-card > button { grid-column: 2; justify-self: start; }
        }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }
      `}</style>
      <AppShell role={role} setRole={setRole} active={active} setActive={(key) => { setSelectedUnit(null); setMarkingIndex(null); setActive(key); }} unread={unread} mobileNav={mobileNav} setMobileNav={setMobileNav}>{content}</AppShell>
    </>
  );
}
