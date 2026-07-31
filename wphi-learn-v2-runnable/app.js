const { useCallback, useEffect, useMemo, useRef, useState } = React;
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
const DEFAULT_PROGRESS = Object.fromEntries(UNITS.map((unit, index) => [
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
]));
const DEFAULT_AUDIT = [
    { id: "AUD-1004", time: "27 Jul 2026, 9:18 am", user: "Claire Donnelly", action: "Viewed assessment submission", item: "AHCWHS302 — Jordan Riley" },
    { id: "AUD-1003", time: "26 Jul 2026, 4:42 pm", user: "Jordan Riley", action: "Uploaded evidence", item: "WHS-site-inspection.pdf" },
    { id: "AUD-1002", time: "26 Jul 2026, 2:09 pm", user: "Priya Nair", action: "Published assessment version", item: "AHCPCM308 AT1 v2.1" },
    { id: "AUD-1001", time: "25 Jul 2026, 11:31 am", user: "System", action: "SIS enrolment synchronised", item: "2026-T3-HORT-A" },
];
function storageGet(key) {
    var _a;
    if (typeof window === "undefined")
        return Promise.resolve(null);
    if ((_a = window.storage) === null || _a === void 0 ? void 0 : _a.get)
        return window.storage.get(key).catch(() => null);
    try {
        const value = window.localStorage.getItem(key);
        return Promise.resolve(value ? { value } : null);
    }
    catch {
        return Promise.resolve(null);
    }
}
function storageSet(key, value) {
    var _a;
    if (typeof window === "undefined")
        return Promise.resolve();
    if ((_a = window.storage) === null || _a === void 0 ? void 0 : _a.set)
        return window.storage.set(key, value).catch(() => { });
    try {
        window.localStorage.setItem(key, value);
    }
    catch { }
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
    return (React.createElement("svg", { "aria-hidden": "true", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement("path", { d: icons[name] || icons.help })));
}
function Badge({ children, tone = "neutral" }) {
    return React.createElement("span", { className: `badge badge-${tone}` }, children);
}
function ProgressBar({ value, label, tone = "green" }) {
    const safe = Math.max(0, Math.min(100, value));
    return (React.createElement("div", { className: "progress-wrap", "aria-label": `${label}: ${safe}%` },
        React.createElement("div", { className: "progress-meta" },
            React.createElement("span", null, label),
            React.createElement("strong", null,
                safe,
                "%")),
        React.createElement("div", { className: "progress-track" },
            React.createElement("div", { className: `progress-fill ${tone}`, style: { width: `${safe}%` } }))));
}
function EmptyState({ icon = "file", title, body, action }) {
    return (React.createElement("div", { className: "empty-state" },
        React.createElement("div", { className: "empty-icon" },
            React.createElement(Icon, { name: icon, size: 28 })),
        React.createElement("h3", null, title),
        React.createElement("p", null, body),
        action));
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
    return React.createElement(Badge, { tone: tone }, label);
}
function SectionHeader({ eyebrow, title, description, actions }) {
    return (React.createElement("div", { className: "section-header" },
        React.createElement("div", null,
            eyebrow && React.createElement("div", { className: "eyebrow" }, eyebrow),
            React.createElement("h1", null, title),
            description && React.createElement("p", null, description)),
        actions && React.createElement("div", { className: "section-actions" }, actions)));
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
    return (React.createElement("div", { className: "app-shell" },
        React.createElement("a", { className: "skip-link", href: "#main-content" }, "Skip to main content"),
        React.createElement("header", { className: "topbar" },
            React.createElement("button", { className: "icon-button mobile-menu", "aria-label": "Open navigation", onClick: () => setMobileNav(true) },
                React.createElement(Icon, { name: "menu" })),
            React.createElement("div", { className: "brand-lockup" },
                React.createElement("div", { className: "brand-mark", "aria-hidden": "true" },
                    React.createElement("span", null, "W")),
                React.createElement("div", null,
                    React.createElement("strong", null, "WPHI Learn"),
                    React.createElement("small", null, "Western Plains Horticulture Institute"))),
            React.createElement("div", { className: "global-search" },
                React.createElement(Icon, { name: "search", size: 18 }),
                React.createElement("label", { className: "sr-only", htmlFor: "global-search" }, "Search WPHI Learn"),
                React.createElement("input", { id: "global-search", placeholder: "Search units, resources and support" })),
            React.createElement("div", { className: "top-actions" },
                React.createElement("button", { className: "icon-button notification-button", "aria-label": `${unread} unread notifications` },
                    React.createElement(Icon, { name: "bell" }),
                    React.createElement("span", null, unread)),
                React.createElement("div", { className: "role-control" },
                    React.createElement("label", { htmlFor: "role-select" }, "Preview role"),
                    React.createElement("select", { id: "role-select", value: role, onChange: (e) => { setRole(e.target.value); setActive(e.target.value === "student" ? "dashboard" : e.target.value === "trainer" ? "trainer-dashboard" : "compliance-dashboard"); } },
                        React.createElement("option", { value: "student" }, "Student"),
                        React.createElement("option", { value: "trainer" }, "Trainer"),
                        React.createElement("option", { value: "compliance" }, "Compliance"))),
                React.createElement("button", { className: "profile-button" },
                    React.createElement("span", null, "JR"),
                    React.createElement("div", null,
                        React.createElement("strong", null, "Jordan Riley"),
                        React.createElement("small", null,
                            ROLE_LABELS[role],
                            " preview")),
                    React.createElement(Icon, { name: "chevron", size: 16 })))),
        React.createElement("aside", { className: cx("sidebar", mobileNav && "mobile-open") },
            React.createElement("div", { className: "mobile-nav-head" },
                React.createElement("strong", null, "Navigation"),
                React.createElement("button", { className: "icon-button", "aria-label": "Close navigation", onClick: () => setMobileNav(false) },
                    React.createElement(Icon, { name: "close" }))),
            React.createElement("nav", { "aria-label": "Primary navigation" }, nav.map(([key, icon, label]) => (React.createElement("button", { key: key, className: cx("nav-item", active === key && "active"), onClick: () => { setActive(key); setMobileNav(false); } },
                React.createElement(Icon, { name: icon, size: 19 }),
                React.createElement("span", null, label),
                key === "messages" && React.createElement("span", { className: "nav-count" }, "2"))))),
            React.createElement("div", { className: "sidebar-bottom" },
                React.createElement("div", { className: "help-card" },
                    React.createElement("strong", null, "Need help?"),
                    React.createElement("span", null, "Student Services"),
                    React.createElement("button", { onClick: () => { setActive("support"); setMobileNav(false); } }, "Contact support")),
                React.createElement("small", null, "RTO 49271 \u00B7 Version 2 prototype"))),
        mobileNav && React.createElement("button", { className: "nav-scrim", "aria-label": "Close navigation", onClick: () => setMobileNav(false) }),
        React.createElement("main", { id: "main-content", className: "main-content" }, children)));
}
function StudentDashboard({ progress, openUnit, setActive }) {
    const current = UNITS[0];
    const completed = Object.values(progress).filter((p) => p.outcome === "competent").length;
    const submitted = Object.values(progress).filter((p) => ["submitted", "awaiting_assessment", "resubmission_required"].includes(p.status)).length;
    const overall = Math.round(Object.entries(progress).reduce((sum, [code, item]) => {
        const unit = UNITS.find((u) => u.code === code);
        const modulePart = unit ? (item.completedModules.length / unit.modules.length) * 55 : 0;
        const quizPart = item.quiz === "passed" ? 15 : 0;
        const submissionPart = item.evidence.length ? 20 : 0;
        const outcomePart = item.outcome === "competent" ? 10 : 0;
        return sum + modulePart + quizPart + submissionPart + outcomePart;
    }, 0) / UNITS.length);
    return (React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Monday, 27 July 2026", title: "Good morning, Jordan", description: "Here is what needs your attention in Certificate III in Horticulture." }),
        React.createElement("div", { className: "metric-grid" },
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Course progress"),
                React.createElement("strong", null,
                    overall,
                    "%"),
                React.createElement("small", null, "Across 17 units")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Units competent"),
                React.createElement("strong", null,
                    completed,
                    React.createElement("em", null, "/17")),
                React.createElement("small", null, "Qualification outcomes")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Assessments active"),
                React.createElement("strong", null, submitted + 2),
                React.createElement("small", null, "Submitted or in progress")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Attendance"),
                React.createElement("strong", null, "94%"),
                React.createElement("small", null, "Current term"))),
        React.createElement("div", { className: "dashboard-grid" },
            React.createElement("section", { className: "card continue-card" },
                React.createElement("div", { className: "card-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "Continue learning"),
                        React.createElement("h2", null, current.code)),
                    React.createElement(Badge, { tone: "warning" }, "Action required")),
                React.createElement("h3", null, current.title),
                React.createElement("p", null, progress[current.code].feedback),
                React.createElement(ProgressBar, { value: 62, label: "Unit completion" }),
                React.createElement("div", { className: "button-row" },
                    React.createElement("button", { className: "button primary", onClick: () => openUnit(current, "assessment") }, "Review assessment feedback"),
                    React.createElement("button", { className: "button secondary", onClick: () => openUnit(current, "modules") }, "Open unit"))),
            React.createElement("section", { className: "card today-card" },
                React.createElement("div", { className: "card-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "Today"),
                        React.createElement("h2", null, "Your timetable")),
                    React.createElement("button", { className: "text-button", onClick: () => setActive("calendar") }, "Full calendar")),
                React.createElement("div", { className: "timeline-list" },
                    React.createElement("div", { className: "timeline-item" },
                        React.createElement("time", null, "8:30"),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Plant identification field walk"),
                            React.createElement("span", null, "Native demonstration garden \u00B7 Mark Ellison"))),
                    React.createElement("div", { className: "timeline-item" },
                        React.createElement("time", null, "10:45"),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Soil testing practical"),
                            React.createElement("span", null, "Soil laboratory \u00B7 Mark Ellison"))),
                    React.createElement("div", { className: "timeline-item" },
                        React.createElement("time", null, "1:30"),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Study and assessment workshop"),
                            React.createElement("span", null, "Learning Hub \u00B7 Michelle Grant")))))),
        React.createElement("div", { className: "dashboard-grid lower" },
            React.createElement("section", { className: "card" },
                React.createElement("div", { className: "card-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "Next actions"),
                        React.createElement("h2", null, "Upcoming and overdue")),
                    React.createElement("button", { className: "text-button", onClick: () => setActive("assessments") }, "All assessments")),
                React.createElement("div", { className: "action-list" },
                    React.createElement("button", { onClick: () => openUnit(UNITS[0], "assessment") },
                        React.createElement("span", { className: "action-icon warning" },
                            React.createElement(Icon, { name: "clipboard" })),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Resubmit WHS workplace evidence"),
                            React.createElement("span", null, "AHCWHS302 \u00B7 Due 7 Aug")),
                        React.createElement(StatusBadge, { status: "resubmission_required" })),
                    React.createElement("button", { onClick: () => openUnit(UNITS[1], "assessment") },
                        React.createElement("span", { className: "action-icon info" },
                            React.createElement(Icon, { name: "file" })),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Sustainable work practices project"),
                            React.createElement("span", null, "AHCWRK320 \u00B7 Due 14 Aug")),
                        React.createElement(StatusBadge, { status: "in_progress" })),
                    React.createElement("button", { onClick: () => openUnit(UNITS[2], "modules") },
                        React.createElement("span", { className: "action-icon success" },
                            React.createElement(Icon, { name: "book" })),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Complete plant identification module"),
                            React.createElement("span", null, "AHCPCM308 \u00B7 45 minutes")),
                        React.createElement(Badge, { tone: "neutral" }, "Learning")))),
            React.createElement("section", { className: "card" },
                React.createElement("div", { className: "card-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "Campus updates"),
                        React.createElement("h2", null, "Announcements")),
                    React.createElement(Badge, { tone: "info" }, "3 new")),
                React.createElement("div", { className: "announcement-list" }, ANNOUNCEMENTS.map((item) => React.createElement("article", { key: item.id },
                    React.createElement("div", null,
                        React.createElement("strong", null, item.title),
                        React.createElement("span", null,
                            item.author,
                            " \u00B7 ",
                            item.date)),
                    React.createElement("p", null, item.body))))))));
}
function CourseView({ progress, openUnit }) {
    const [term, setTerm] = useState("all");
    const [query, setQuery] = useState("");
    const filtered = UNITS.filter((u) => (term === "all" || u.term === Number(term)) && `${u.code} ${u.title}`.toLowerCase().includes(query.toLowerCase()));
    return (React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "AHC30722", title: "Certificate III in Horticulture", description: "17 units \u00B7 11 core \u00B7 6 elective \u00B7 Dubbo Training Campus", actions: React.createElement("button", { className: "button secondary" },
                React.createElement(Icon, { name: "calendar", size: 17 }),
                " Course timetable") }),
        React.createElement("div", { className: "course-hero card" },
            React.createElement("div", null,
                React.createElement(Badge, { tone: "success" }, "Currently enrolled"),
                React.createElement("h2", null, "2026 Term 3 Horticulture \u2014 Cohort A"),
                React.createElement("p", null, "Trainer-led practical delivery supported by online learning and workplace evidence.")),
            React.createElement("div", { className: "course-progress" },
                React.createElement(ProgressBar, { value: 22, label: "Qualification completion" }),
                React.createElement("span", null, "Expected completion: 28 January 2028"))),
        React.createElement("div", { className: "toolbar" },
            React.createElement("div", { className: "search-field" },
                React.createElement(Icon, { name: "search", size: 18 }),
                React.createElement("label", { className: "sr-only", htmlFor: "unit-search" }, "Search units"),
                React.createElement("input", { id: "unit-search", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search unit code or title" })),
            React.createElement("div", { className: "filter-group" },
                React.createElement(Icon, { name: "filter", size: 18 }),
                React.createElement("label", { htmlFor: "term-filter" }, "Term"),
                React.createElement("select", { id: "term-filter", value: term, onChange: (e) => setTerm(e.target.value) },
                    React.createElement("option", { value: "all" }, "All terms"),
                    React.createElement("option", { value: "1" }, "Term 1"),
                    React.createElement("option", { value: "2" }, "Term 2"),
                    React.createElement("option", { value: "3" }, "Term 3"),
                    React.createElement("option", { value: "4" }, "Term 4")))),
        [1, 2, 3, 4].map((t) => {
            const units = filtered.filter((u) => u.term === t);
            if (!units.length)
                return null;
            return React.createElement("section", { key: t, className: "term-section" },
                React.createElement("div", { className: "term-heading" },
                    React.createElement("div", null,
                        React.createElement("span", null,
                            "Term ",
                            t),
                        React.createElement("small", null,
                            units.length,
                            " units")),
                    React.createElement("div", { className: "term-line" })),
                React.createElement("div", { className: "unit-grid" }, units.map((unit) => React.createElement(UnitCard, { key: unit.code, unit: unit, item: progress[unit.code], onOpen: () => openUnit(unit, "overview") }))));
        })));
}
function UnitCard({ unit, item, onOpen }) {
    const completed = item.completedModules.length;
    const learning = Math.round((completed / unit.modules.length) * 100);
    return (React.createElement("button", { className: "unit-card", onClick: onOpen },
        React.createElement("div", { className: "unit-top" },
            React.createElement("span", { className: "unit-code" }, unit.code),
            React.createElement(Badge, { tone: unit.type === "core" ? "rust" : "gold" }, unit.type)),
        React.createElement("h3", null, unit.title),
        React.createElement("p", null, unit.summary),
        React.createElement("div", { className: "unit-meta" },
            React.createElement("span", null,
                React.createElement(Icon, { name: "users", size: 15 }),
                unit.trainer),
            React.createElement("span", null,
                React.createElement(Icon, { name: "calendar", size: 15 }),
                "Due ",
                unit.dueDate)),
        React.createElement(ProgressBar, { value: learning, label: "Learning completed" }),
        React.createElement("div", { className: "unit-footer" },
            React.createElement(StatusBadge, { status: item.status }),
            React.createElement("span", null,
                "Open unit ",
                React.createElement(Icon, { name: "arrow", size: 15 })))));
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
        if (passed)
            updateProgress(unit.code, { quiz: "passed", status: item.status === "not_started" ? "in_progress" : item.status });
    };
    const addEvidence = () => {
        if (!files.length || !evidenceDescription.trim())
            return;
        const now = "27 Jul 2026, 10:42 am";
        const evidence = files.map((file, index) => ({ id: `EV-${Date.now()}-${index}`, name: file.name, type: file.type || "File", size: `${Math.max(0.1, file.size / 1024 / 1024).toFixed(1)} MB`, submitted: now, description: evidenceDescription.trim() }));
        updateProgress(unit.code, { evidence: [...item.evidence, ...evidence], status: "submitted", attempt: Math.max(1, item.attempt + 1) });
        setFiles([]);
        setEvidenceDescription("");
        if (fileRef.current)
            fileRef.current.value = "";
    };
    return (React.createElement("div", null,
        React.createElement("button", { className: "back-button", onClick: close },
            React.createElement(Icon, { name: "arrow", size: 17 }),
            " Back to course"),
        React.createElement("div", { className: "unit-header card" },
            React.createElement("div", null,
                React.createElement("div", { className: "unit-identity" },
                    React.createElement("span", { className: "unit-code large" }, unit.code),
                    React.createElement(Badge, { tone: unit.type === "core" ? "rust" : "gold" },
                        unit.type,
                        " unit"),
                    React.createElement("span", null,
                        "Term ",
                        unit.term)),
                React.createElement("h1", null, unit.title),
                React.createElement("p", null, unit.summary),
                React.createElement("div", { className: "unit-detail-meta" },
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "users", size: 17 }),
                        " Trainer: ",
                        unit.trainer),
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "calendar", size: 17 }),
                        " Assessment due: ",
                        unit.assessment.dueDate),
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "clock", size: 17 }),
                        " 4 modules"))),
            React.createElement("div", { className: "unit-progress-panel" },
                React.createElement(ProgressBar, { value: learningProgress, label: "Learning activities" }),
                React.createElement(ProgressBar, { value: item.quiz === "passed" ? 100 : 0, label: "Knowledge assessment", tone: "gold" }),
                React.createElement(ProgressBar, { value: item.evidence.length ? 100 : 0, label: "Practical evidence", tone: "rust" }),
                React.createElement(StatusBadge, { status: item.outcome || item.status }))),
        React.createElement("div", { className: "tabs", role: "tablist", "aria-label": "Unit sections" }, ["overview", "modules", "assessment", "results"].map((key) => React.createElement("button", { key: key, role: "tab", "aria-selected": tab === key, className: tab === key ? "active" : "", onClick: () => setTab(key) }, key[0].toUpperCase() + key.slice(1)))),
        tab === "overview" && React.createElement("div", { className: "two-column" },
            React.createElement("section", { className: "card content-card" },
                React.createElement("h2", null, "Unit overview"),
                React.createElement("p", null, "This unit is delivered through trainer-led workshops, guided practical activities, self-paced learning and formal assessment. You must complete all required assessment components before a competency decision can be made."),
                React.createElement("h3", null, "What you will learn"),
                React.createElement("ul", { className: "check-list" },
                    React.createElement("li", null, "Plan work according to workplace requirements"),
                    React.createElement("li", null, "Select and use appropriate tools, equipment and documentation"),
                    React.createElement("li", null, "Complete practical work safely and effectively"),
                    React.createElement("li", null, "Monitor outcomes and maintain workplace records")),
                React.createElement("h3", null, "Delivery and location"),
                React.createElement("p", null,
                    unit.location,
                    ". Practical activities may be rescheduled during unsafe weather conditions.")),
            React.createElement("aside", { className: "stack" },
                React.createElement("section", { className: "card info-panel" },
                    React.createElement("h3", null, "Your trainer"),
                    React.createElement("div", { className: "person-row" },
                        React.createElement("span", { className: "avatar" }, unit.trainer.split(" ").map((n) => n[0]).join("")),
                        React.createElement("div", null,
                            React.createElement("strong", null, unit.trainer),
                            React.createElement("span", null, "Horticulture Trainer and Assessor"),
                            React.createElement("button", { className: "text-button" }, "Send message")))),
                React.createElement("section", { className: "card info-panel" },
                    React.createElement("h3", null, "Assessment summary"),
                    React.createElement(StatusBadge, { status: item.status }),
                    React.createElement("dl", null,
                        React.createElement("div", null,
                            React.createElement("dt", null, "Due date"),
                            React.createElement("dd", null, unit.assessment.dueDate)),
                        React.createElement("div", null,
                            React.createElement("dt", null, "Attempts used"),
                            React.createElement("dd", null,
                                item.attempt,
                                " of ",
                                unit.assessment.attemptsAllowed)),
                        React.createElement("div", null,
                            React.createElement("dt", null, "Evidence files"),
                            React.createElement("dd", null, item.evidence.length))),
                    React.createElement("button", { className: "button primary full", onClick: () => setTab("assessment") }, "Open assessment")))),
        tab === "modules" && React.createElement("section", { className: "card module-list" },
            React.createElement("div", { className: "card-head" },
                React.createElement("div", null,
                    React.createElement("h2", null, "Learning modules"),
                    React.createElement("p", null, "Complete each module before beginning the formal assessment.")),
                React.createElement(Badge, { tone: "info" },
                    item.completedModules.length,
                    "/",
                    unit.modules.length,
                    " complete")),
            unit.modules.map((module, index) => { const complete = item.completedModules.includes(module.id); const isOpen = expanded === module.id; return React.createElement("article", { key: module.id, className: cx("module-item", complete && "complete") },
                React.createElement("button", { className: "module-summary", onClick: () => toggleModule(module.id), "aria-expanded": isOpen },
                    React.createElement("span", { className: "module-number" }, complete ? React.createElement(Icon, { name: "check", size: 18 }) : index + 1),
                    React.createElement("div", null,
                        React.createElement("span", { className: "module-kind" },
                            module.type,
                            " \u00B7 ",
                            module.duration),
                        React.createElement("strong", null, module.title)),
                    React.createElement(Icon, { name: "chevron", size: 18 })),
                isOpen && React.createElement("div", { className: "module-body" },
                    React.createElement("p", null, module.description),
                    React.createElement("div", { className: "resource-grid" }, module.resources.map((resource, i) => React.createElement("button", { key: resource, className: "resource-card" },
                        React.createElement("span", { className: "resource-icon" },
                            React.createElement(Icon, { name: i === 1 ? "play" : "file", size: 19 })),
                        React.createElement("span", null,
                            React.createElement("strong", null, resource),
                            React.createElement("small", null, i === 1 ? "Video · 12 min" : "Document · Accessible PDF"))))),
                    React.createElement("div", { className: "module-actions" }, complete ? React.createElement(Badge, { tone: "success" },
                        React.createElement(Icon, { name: "check", size: 14 }),
                        " Completed") : React.createElement("button", { className: "button primary", onClick: () => markModule(module.id) }, "Mark module complete")))); })),
        tab === "assessment" && React.createElement("div", { className: "assessment-layout" },
            React.createElement("section", { className: "card content-card" },
                React.createElement("div", { className: "card-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, unit.assessment.id),
                        React.createElement("h2", null, unit.assessment.title)),
                    React.createElement(StatusBadge, { status: item.status })),
                React.createElement("div", { className: "assessment-banner" },
                    React.createElement(Icon, { name: "clock" }),
                    React.createElement("div", null,
                        React.createElement("strong", null,
                            "Due ",
                            unit.assessment.dueDate),
                        React.createElement("span", null, "Two attempts are included. Ask your trainer before the due date if you need support or an extension."))),
                React.createElement("h3", null, "Assessment requirements"),
                React.createElement("ol", { className: "number-list" }, unit.assessment.requirements.map((r) => React.createElement("li", { key: r }, r))),
                React.createElement("details", { className: "declaration" },
                    React.createElement("summary", null, "Student declaration and authenticity"),
                    React.createElement("p", null, "By submitting, you declare that the work is your own, that all contributors and sources are acknowledged, and that the practical evidence accurately represents work you completed.")),
                React.createElement("div", { className: "assessment-section" },
                    React.createElement("div", { className: "assessment-section-head" },
                        React.createElement("span", null, "Part A"),
                        React.createElement("div", null,
                            React.createElement("h3", null, "Knowledge questions"),
                            React.createElement("p", null, "Answer all questions correctly. You can review your learning materials before resubmitting.")),
                        item.quiz === "passed" && React.createElement(Badge, { tone: "success" }, "Passed")),
                    unit.quiz.map((q, i) => React.createElement("fieldset", { key: i, className: "quiz-question" },
                        React.createElement("legend", null,
                            i + 1,
                            ". ",
                            q.q),
                        q.options.map((option, j) => React.createElement("label", { key: option, className: "radio-row" },
                            React.createElement("input", { type: "radio", name: `${unit.code}-q${i}`, checked: quizAnswers[i] === j, onChange: () => setQuizAnswers((prev) => ({ ...prev, [i]: j })) }),
                            React.createElement("span", null, option))))),
                    React.createElement("button", { className: "button primary", onClick: submitQuiz }, "Submit knowledge answers"),
                    quizResult && React.createElement("div", { className: cx("result-message", quizResult.passed ? "success" : "warning"), role: "status" },
                        React.createElement("strong", null,
                            quizResult.correct,
                            " of ",
                            quizResult.total,
                            " correct."),
                        " ",
                        quizResult.passed ? "Knowledge component passed." : "Review your answers and try again.")),
                React.createElement("div", { className: "assessment-section" },
                    React.createElement("div", { className: "assessment-section-head" },
                        React.createElement("span", null, "Part B"),
                        React.createElement("div", null,
                            React.createElement("h3", null, "Practical evidence portfolio"),
                            React.createElement("p", null, "Upload clear, current evidence and explain what the evidence demonstrates."))),
                    item.feedback && React.createElement("div", { className: "feedback-callout" },
                        React.createElement("strong", null, "Trainer feedback"),
                        React.createElement("p", null, item.feedback)),
                    React.createElement("label", { className: "field-label", htmlFor: "evidence-description" }, "Evidence description"),
                    React.createElement("textarea", { id: "evidence-description", rows: "4", value: evidenceDescription, onChange: (e) => setEvidenceDescription(e.target.value), placeholder: "Describe the task, date, location, your role and what each file shows." }),
                    React.createElement("label", { className: "upload-zone", htmlFor: "evidence-files" },
                        React.createElement(Icon, { name: "upload", size: 28 }),
                        React.createElement("strong", null, "Choose evidence files"),
                        React.createElement("span", null, "Photos, video, PDF, Word or workplace records \u00B7 maximum 500 MB per file"),
                        React.createElement("input", { ref: fileRef, id: "evidence-files", type: "file", multiple: true, onChange: (e) => setFiles(Array.from(e.target.files || [])) })),
                    !!files.length && React.createElement("div", { className: "selected-files" }, files.map((file) => React.createElement("div", { key: `${file.name}-${file.size}` },
                        React.createElement(Icon, { name: "file", size: 17 }),
                        React.createElement("span", null, file.name),
                        React.createElement("small", null,
                            Math.max(0.1, file.size / 1024 / 1024).toFixed(1),
                            " MB")))),
                    React.createElement("div", { className: "form-check" },
                        React.createElement("input", { id: "declaration", type: "checkbox" }),
                        React.createElement("label", { htmlFor: "declaration" }, "I confirm this evidence is my own work and accurately represents the activity completed.")),
                    React.createElement("button", { className: "button primary", disabled: !files.length || !evidenceDescription.trim(), onClick: addEvidence }, "Submit evidence portfolio"))),
            React.createElement("aside", { className: "stack sticky-side" },
                React.createElement("section", { className: "card info-panel" },
                    React.createElement("h3", null, "Submission history"),
                    item.evidence.length ? React.createElement("div", { className: "evidence-list" }, item.evidence.map((file) => React.createElement("div", { key: file.id },
                        React.createElement("span", { className: "file-tile" },
                            React.createElement(Icon, { name: "file" })),
                        React.createElement("div", null,
                            React.createElement("strong", null, file.name),
                            React.createElement("span", null,
                                file.type,
                                " \u00B7 ",
                                file.size),
                            React.createElement("small", null, file.submitted))))) : React.createElement("p", { className: "muted" }, "No evidence submitted yet.")),
                React.createElement("section", { className: "card info-panel" },
                    React.createElement("h3", null, "Need help?"),
                    React.createElement("p", null, "Contact your trainer before submitting if the assessment instructions or required evidence are unclear."),
                    React.createElement("button", { className: "button secondary full" },
                        "Message ",
                        unit.trainer.split(" ")[0]),
                    React.createElement("button", { className: "text-button full" }, "Request reasonable adjustment")))),
        tab === "results" && React.createElement("section", { className: "card content-card" },
            React.createElement("div", { className: "card-head" },
                React.createElement("div", null,
                    React.createElement("h2", null, "Results and feedback"),
                    React.createElement("p", null, "Assessment outcomes are shown separately from your learning activity completion.")),
                React.createElement(StatusBadge, { status: item.outcome || item.status })),
            React.createElement("div", { className: "results-grid" },
                React.createElement("div", null,
                    React.createElement("span", null, "Knowledge assessment"),
                    React.createElement("strong", null, item.quiz === "passed" ? "Satisfactory" : "Not completed")),
                React.createElement("div", null,
                    React.createElement("span", null, "Practical evidence"),
                    React.createElement("strong", null, item.evidence.length ? "Submitted" : "Not submitted")),
                React.createElement("div", null,
                    React.createElement("span", null, "Final unit outcome"),
                    React.createElement("strong", null, item.outcome ? item.outcome.replaceAll("_", " ") : "Not yet determined"))),
            item.feedback ? React.createElement("div", { className: "feedback-callout" },
                React.createElement("strong", null, "Latest trainer feedback"),
                React.createElement("p", null, item.feedback),
                React.createElement("small", null, "Claire Donnelly \u00B7 26 Jul 2026, 4:18 pm")) : React.createElement(EmptyState, { icon: "message", title: "No feedback yet", body: "Trainer feedback will appear here after your assessment is reviewed." }))));
}
function AssessmentsView({ progress, openUnit }) {
    const [filter, setFilter] = useState("all");
    const rows = UNITS.filter((unit) => filter === "all" || progress[unit.code].status === filter);
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Student assessment centre", title: "Assessments", description: "View due dates, submission status, attempts and trainer feedback." }),
        React.createElement("div", { className: "card table-card" },
            React.createElement("div", { className: "table-toolbar" },
                React.createElement("div", { className: "filter-tabs" }, [["all", "All"], ["in_progress", "In progress"], ["submitted", "Submitted"], ["resubmission_required", "Action required"]].map(([key, label]) => React.createElement("button", { key: key, className: filter === key ? "active" : "", onClick: () => setFilter(key) }, label))),
                React.createElement("button", { className: "button secondary" },
                    React.createElement(Icon, { name: "calendar", size: 16 }),
                    " Assessment calendar")),
            React.createElement("div", { className: "responsive-table" },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Assessment"),
                            React.createElement("th", null, "Due"),
                            React.createElement("th", null, "Attempt"),
                            React.createElement("th", null, "Status"),
                            React.createElement("th", null,
                                React.createElement("span", { className: "sr-only" }, "Action")))),
                    React.createElement("tbody", null, rows.map((unit) => { const item = progress[unit.code]; return React.createElement("tr", { key: unit.code },
                        React.createElement("td", null,
                            React.createElement("span", { className: "table-code" }, unit.code),
                            React.createElement("strong", null, unit.assessment.title),
                            React.createElement("small", null, unit.trainer)),
                        React.createElement("td", null, unit.assessment.dueDate),
                        React.createElement("td", null,
                            Math.max(item.attempt, 0),
                            " of 2"),
                        React.createElement("td", null,
                            React.createElement(StatusBadge, { status: item.status })),
                        React.createElement("td", null,
                            React.createElement("button", { className: "text-button", onClick: () => openUnit(unit, "assessment") }, "Open"))); }))))));
}
function CalendarView() {
    const [view, setView] = useState("agenda");
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Course schedule", title: "Calendar", description: "Classes, practical sessions, assessment dates and support appointments.", actions: React.createElement("button", { className: "button secondary" }, "Add calendar feed") }),
        React.createElement("div", { className: "calendar-layout" },
            React.createElement("section", { className: "card calendar-card" },
                React.createElement("div", { className: "calendar-head" },
                    React.createElement("div", null,
                        React.createElement("button", { className: "icon-button" },
                            React.createElement(Icon, { name: "arrow" })),
                        React.createElement("h2", null, "July 2026"),
                        React.createElement("button", { className: "icon-button" },
                            React.createElement(Icon, { name: "arrow" }))),
                    React.createElement("div", { className: "segmented" },
                        React.createElement("button", { className: view === "month" ? "active" : "", onClick: () => setView("month") }, "Month"),
                        React.createElement("button", { className: view === "agenda" ? "active" : "", onClick: () => setView("agenda") }, "Agenda"))),
                view === "agenda" ? React.createElement("div", { className: "agenda-list" }, CALENDAR_EVENTS.map((event) => React.createElement("article", { key: event.id },
                    React.createElement("div", { className: "date-block" },
                        React.createElement("strong", null, event.date.split(" ")[0]),
                        React.createElement("span", null, event.date.split(" ")[1])),
                    React.createElement("div", { className: `event-dot ${event.type}` }),
                    React.createElement("div", null,
                        React.createElement("span", null, event.time),
                        React.createElement("strong", null, event.title),
                        React.createElement("small", null, event.location)),
                    React.createElement(Badge, { tone: event.type === "assessment" ? "rust" : event.type === "practical" ? "gold" : "info" }, event.type)))) : React.createElement(MonthGrid, null)),
            React.createElement("aside", { className: "stack" },
                React.createElement("section", { className: "card info-panel" },
                    React.createElement("h3", null, "Calendar key"),
                    React.createElement("ul", { className: "legend" },
                        React.createElement("li", null,
                            React.createElement("span", { className: "event-dot class" }),
                            "Class"),
                        React.createElement("li", null,
                            React.createElement("span", { className: "event-dot practical" }),
                            "Practical"),
                        React.createElement("li", null,
                            React.createElement("span", { className: "event-dot assessment" }),
                            "Assessment"),
                        React.createElement("li", null,
                            React.createElement("span", { className: "event-dot support" }),
                            "Support"))),
                React.createElement("section", { className: "card info-panel" },
                    React.createElement("h3", null, "Weather notice"),
                    React.createElement("p", null, "Outdoor sessions may change during unsafe heat, storms or high winds. Check announcements before travelling.")))));
}
function MonthGrid() {
    const days = Array.from({ length: 35 }, (_, i) => i - 2);
    return React.createElement("div", { className: "month-grid" },
        React.createElement("div", { className: "week-label" }, "Mon"),
        React.createElement("div", { className: "week-label" }, "Tue"),
        React.createElement("div", { className: "week-label" }, "Wed"),
        React.createElement("div", { className: "week-label" }, "Thu"),
        React.createElement("div", { className: "week-label" }, "Fri"),
        React.createElement("div", { className: "week-label" }, "Sat"),
        React.createElement("div", { className: "week-label" }, "Sun"),
        days.map((day, i) => React.createElement("div", { key: i, className: cx("day-cell", (day < 1 || day > 31) && "outside", day === 27 && "today") },
            React.createElement("span", null, day < 1 ? 30 + day : day > 31 ? day - 31 : day),
            [7, 14, 21, 27, 28, 30].includes(day) && React.createElement("div", { className: "mini-event" }, day === 27 ? "Plant ID" : day === 28 ? "Soil practical" : day === 30 ? "Support" : "Assessment due"))));
}
function ResultsView({ progress }) {
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Academic record", title: "Results", description: "Learning activity, assessment components and final competency outcomes are reported separately." }),
        React.createElement("div", { className: "metric-grid" },
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Competent units"),
                React.createElement("strong", null,
                    Object.values(progress).filter((x) => x.outcome === "competent").length,
                    React.createElement("em", null, "/17")),
                React.createElement("small", null, "Final outcomes")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Satisfactory tasks"),
                React.createElement("strong", null, Object.values(progress).filter((x) => x.quiz === "passed").length),
                React.createElement("small", null, "Assessment components")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Awaiting assessment"),
                React.createElement("strong", null, Object.values(progress).filter((x) => x.status === "submitted").length),
                React.createElement("small", null, "Trainer review")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Current average"),
                React.createElement("strong", null, "\u2014"),
                React.createElement("small", null, "VET uses competency outcomes"))),
        React.createElement("div", { className: "card table-card" },
            React.createElement("div", { className: "responsive-table" },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Unit"),
                            React.createElement("th", null, "Learning"),
                            React.createElement("th", null, "Knowledge"),
                            React.createElement("th", null, "Evidence"),
                            React.createElement("th", null, "Outcome"))),
                    React.createElement("tbody", null, UNITS.map((unit) => { const item = progress[unit.code]; return React.createElement("tr", { key: unit.code },
                        React.createElement("td", null,
                            React.createElement("span", { className: "table-code" }, unit.code),
                            React.createElement("strong", null, unit.title)),
                        React.createElement("td", null,
                            item.completedModules.length,
                            "/",
                            unit.modules.length),
                        React.createElement("td", null, item.quiz === "passed" ? React.createElement(Badge, { tone: "success" }, "Satisfactory") : React.createElement(Badge, null, "Not completed")),
                        React.createElement("td", null, item.evidence.length ? React.createElement(Badge, { tone: "gold" }, "Submitted") : React.createElement(Badge, null, "Not submitted")),
                        React.createElement("td", null,
                            React.createElement(StatusBadge, { status: item.outcome || "not_started" }))); }))))));
}
function MessagesView() {
    const [selected, setSelected] = useState(0);
    const conversations = [
        { name: "Claire Donnelly", subject: "WHS assessment feedback", preview: "I have added notes to the final section…", time: "9:18 am", unread: true },
        { name: "Michelle Grant", subject: "Study support appointment", preview: "Tuesday at 3:30 pm is available…", time: "Yesterday", unread: true },
        { name: "Mark Ellison", subject: "Plant identification field walk", preview: "Please bring your field guide and hat…", time: "24 Jul", unread: false },
    ];
    const current = conversations[selected];
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Communication", title: "Messages", description: "Contact trainers and student support within your course.", actions: React.createElement("button", { className: "button primary" }, "New message") }),
        React.createElement("div", { className: "message-layout card" },
            React.createElement("aside", { className: "conversation-list" },
                React.createElement("div", { className: "search-field" },
                    React.createElement(Icon, { name: "search", size: 17 }),
                    React.createElement("input", { "aria-label": "Search messages", placeholder: "Search messages" })),
                conversations.map((c, i) => React.createElement("button", { key: c.subject, className: selected === i ? "active" : "", onClick: () => setSelected(i) },
                    c.unread && React.createElement("span", { className: "unread-dot" }),
                    React.createElement("span", { className: "avatar small" }, c.name.split(" ").map((n) => n[0]).join("")),
                    React.createElement("div", null,
                        React.createElement("strong", null, c.name),
                        React.createElement("span", null, c.subject),
                        React.createElement("small", null, c.preview)),
                    React.createElement("time", null, c.time)))),
            React.createElement("section", { className: "conversation" },
                React.createElement("div", { className: "conversation-head" },
                    React.createElement("span", { className: "avatar" }, current.name.split(" ").map((n) => n[0]).join("")),
                    React.createElement("div", null,
                        React.createElement("strong", null, current.name),
                        React.createElement("span", null, "Horticulture Trainer and Assessor"))),
                React.createElement("div", { className: "message-thread" },
                    React.createElement("div", { className: "message received" },
                        React.createElement("span", null, "Yesterday, 4:18 pm"),
                        React.createElement("p", null, "Your hazard identification was thorough. Please add the consultation record and resubmit the final page. I have highlighted the relevant assessment criterion.")),
                    React.createElement("div", { className: "message sent" },
                        React.createElement("span", null, "Today, 8:52 am"),
                        React.createElement("p", null, "Thanks Claire. Does the consultation record need both student signatures, or is the supervisor signature enough?")),
                    React.createElement("div", { className: "message received" },
                        React.createElement("span", null, "Today, 9:18 am"),
                        React.createElement("p", null, "Please include the supervisor signature and record who took part in the discussion. You can use the consultation template in the assessment resources."))),
                React.createElement("div", { className: "compose" },
                    React.createElement("label", { className: "sr-only", htmlFor: "reply" }, "Reply"),
                    React.createElement("textarea", { id: "reply", rows: "2", placeholder: "Write a reply" }),
                    React.createElement("button", { className: "button primary" }, "Send")))));
}
function SupportView() {
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Student services", title: "Support", description: "Practical help with learning, accessibility, wellbeing, technology and course administration." }),
        React.createElement("div", { className: "support-grid" }, [
            ["Academic and LLN support", "Study planning, reading, writing, numeracy and assessment preparation.", "Michelle Grant", "Book appointment"],
            ["Reasonable adjustment", "Discuss disability, health or access needs and appropriate assessment adjustments.", "Student Support", "Request support"],
            ["Technical support", "Login, upload, browser and device assistance for WPHI systems.", "ICT Service Desk", "Create ticket"],
            ["Fees and enrolment", "Payment plans, enrolment records, withdrawals and course administration.", "Enrolments Office", "Contact office"],
            ["Wellbeing referral", "Confidential referral to local health, family and community support services.", "Student Services", "View services"],
            ["Complaints and appeals", "Submit feedback, a complaint or an assessment appeal and track its progress.", "RTO Manager", "Open form"],
        ].map(([title, body, contact, action]) => React.createElement("section", { className: "card support-card", key: title },
            React.createElement("span", { className: "support-icon" },
                React.createElement(Icon, { name: title.includes("Technical") ? "settings" : title.includes("Complaints") ? "shield" : "help" })),
            React.createElement("h2", null, title),
            React.createElement("p", null, body),
            React.createElement("span", null, contact),
            React.createElement("button", { className: "button secondary full" }, action)))),
        React.createElement("section", { className: "card urgent-card" },
            React.createElement("div", null,
                React.createElement(Badge, { tone: "danger" }, "Urgent assistance"),
                React.createElement("h2", null, "Campus safety or immediate wellbeing concern"),
                React.createElement("p", null, "Call campus reception on 02 5550 4720. In an emergency, call 000.")),
            React.createElement("button", { className: "button primary" }, "View emergency contacts")));
}
function TrainerDashboard({ progress, setActive, openMarking }) {
    const queue = UNITS.filter((u) => ["submitted", "resubmission_required"].includes(progress[u.code].status));
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Trainer workspace", title: "Good morning, Claire", description: "Cohort 2026-T3-HORT-A \u00B7 18 active students", actions: React.createElement("button", { className: "button primary" }, "Create announcement") }),
        React.createElement("div", { className: "metric-grid" },
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Awaiting assessment"),
                React.createElement("strong", null, "12"),
                React.createElement("small", null, "4 due within two days")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Resubmissions"),
                React.createElement("strong", null, "5"),
                React.createElement("small", null, "Students require action")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "At-risk students"),
                React.createElement("strong", null, "3"),
                React.createElement("small", null, "Attendance or progress alert")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Average turnaround"),
                React.createElement("strong", null,
                    "2.1",
                    React.createElement("em", null, " days")),
                React.createElement("small", null, "Target: 10 business days"))),
        React.createElement("div", { className: "dashboard-grid" },
            React.createElement("section", { className: "card" },
                React.createElement("div", { className: "card-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "Assessment workload"),
                        React.createElement("h2", null, "Priority marking queue")),
                    React.createElement("button", { className: "text-button", onClick: () => setActive("marking") }, "View all")),
                React.createElement("div", { className: "marking-list" }, [
                    ["Jordan Riley", "AHCWHS302", "Resubmitted workplace evidence", "38 min ago", "resubmission_required"],
                    ["Amelia Grant", "AHCPCM308", "Plant identification portfolio", "2 hr ago", "submitted"],
                    ["Lachlan Moore", "AHCSOL304", "Soil improvement project", "Yesterday", "submitted"],
                    ["Ruby Chen", "AHCWRK320", "Sustainability workplace report", "Yesterday", "submitted"],
                ].map((row, i) => React.createElement("button", { key: row[0], onClick: () => openMarking(i) },
                    React.createElement("span", { className: "avatar small" }, row[0].split(" ").map((n) => n[0]).join("")),
                    React.createElement("div", null,
                        React.createElement("strong", null, row[0]),
                        React.createElement("span", null,
                            row[1],
                            " \u00B7 ",
                            row[2]),
                        React.createElement("small", null, row[3])),
                    React.createElement(StatusBadge, { status: row[4] }))))),
            React.createElement("section", { className: "card" },
                React.createElement("div", { className: "card-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "Today"),
                        React.createElement("h2", null, "Teaching schedule")),
                    React.createElement("button", { className: "text-button", onClick: () => setActive("calendar") }, "Calendar")),
                React.createElement("div", { className: "timeline-list" },
                    React.createElement("div", { className: "timeline-item" },
                        React.createElement("time", null, "8:30"),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Plant identification field walk"),
                            React.createElement("span", null, "18 students \u00B7 Native demonstration garden"))),
                    React.createElement("div", { className: "timeline-item" },
                        React.createElement("time", null, "10:45"),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Soil testing practical"),
                            React.createElement("span", null, "18 students \u00B7 Soil laboratory"))),
                    React.createElement("div", { className: "timeline-item" },
                        React.createElement("time", null, "2:30"),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Assessment marking block"),
                            React.createElement("span", null, "Office 3 \u00B7 90 minutes")))))),
        React.createElement("section", { className: "card at-risk" },
            React.createElement("div", { className: "card-head" },
                React.createElement("div", null,
                    React.createElement("span", { className: "eyebrow" }, "Learner support"),
                    React.createElement("h2", null, "Students requiring follow-up")),
                React.createElement("button", { className: "text-button", onClick: () => setActive("cohort") }, "Open cohort")),
            React.createElement("div", { className: "responsive-table" },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Student"),
                            React.createElement("th", null, "Attendance"),
                            React.createElement("th", null, "Progress"),
                            React.createElement("th", null, "Alert"),
                            React.createElement("th", null, "Last active"),
                            React.createElement("th", null))),
                    React.createElement("tbody", null, DEMO_STUDENTS.filter((s) => s.alerts).map((student) => React.createElement("tr", { key: student.id },
                        React.createElement("td", null,
                            React.createElement("strong", null, student.name),
                            React.createElement("small", null, student.id)),
                        React.createElement("td", null,
                            student.attendance,
                            "%"),
                        React.createElement("td", null,
                            student.progress,
                            "%"),
                        React.createElement("td", null,
                            React.createElement(Badge, { tone: student.alerts > 1 ? "danger" : "warning" },
                                student.alerts,
                                " alert",
                                student.alerts > 1 ? "s" : "")),
                        React.createElement("td", null, student.lastActive),
                        React.createElement("td", null,
                            React.createElement("button", { className: "text-button" }, "Review")))))))));
}
function MarkingQueue({ openMarking }) {
    const rows = [
        ["Jordan Riley", "AHCWHS302", "Workplace evidence resubmission", "27 Jul 2026", "resubmission_required"],
        ["Amelia Grant", "AHCPCM308", "Plant identification portfolio", "27 Jul 2026", "submitted"],
        ["Lachlan Moore", "AHCSOL304", "Soil improvement project", "26 Jul 2026", "submitted"],
        ["Ruby Chen", "AHCWRK320", "Sustainability workplace report", "26 Jul 2026", "submitted"],
        ["Noah Thompson", "AHCPGD307", "Plant establishment practical", "25 Jul 2026", "submitted"],
    ];
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Assessment", title: "Marking queue", description: "Review submissions, record assessor judgements and manage resubmissions." }),
        React.createElement("div", { className: "card table-card" },
            React.createElement("div", { className: "table-toolbar" },
                React.createElement("div", { className: "search-field" },
                    React.createElement(Icon, { name: "search", size: 17 }),
                    React.createElement("input", { "aria-label": "Search marking queue", placeholder: "Search student or unit" })),
                React.createElement("div", { className: "filter-group" },
                    React.createElement(Icon, { name: "filter", size: 17 }),
                    React.createElement("select", { "aria-label": "Filter status" },
                        React.createElement("option", null, "All statuses"),
                        React.createElement("option", null, "Submitted"),
                        React.createElement("option", null, "Resubmission required")))),
            React.createElement("div", { className: "responsive-table" },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Student"),
                            React.createElement("th", null, "Unit"),
                            React.createElement("th", null, "Submission"),
                            React.createElement("th", null, "Received"),
                            React.createElement("th", null, "Status"),
                            React.createElement("th", null))),
                    React.createElement("tbody", null, rows.map((row, i) => React.createElement("tr", { key: row[0] },
                        React.createElement("td", null,
                            React.createElement("strong", null, row[0]),
                            React.createElement("small", null,
                                "S1002",
                                i + 1)),
                        React.createElement("td", null,
                            React.createElement("span", { className: "table-code" }, row[1])),
                        React.createElement("td", null, row[2]),
                        React.createElement("td", null, row[3]),
                        React.createElement("td", null,
                            React.createElement(StatusBadge, { status: row[4] })),
                        React.createElement("td", null,
                            React.createElement("button", { className: "button secondary compact", onClick: () => openMarking(i) }, "Assess")))))))));
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
    return React.createElement("div", null,
        React.createElement("button", { className: "back-button", onClick: close },
            React.createElement(Icon, { name: "arrow", size: 17 }),
            " Back to marking queue"),
        React.createElement(SectionHeader, { eyebrow: `${record.student} · ${unit.code}`, title: record.task, description: `${unit.title} · Attempt ${Math.max(1, item.attempt)} of 2`, actions: React.createElement(StatusBadge, { status: item.status }) }),
        React.createElement("div", { className: "marking-workspace" },
            React.createElement("section", { className: "stack" },
                React.createElement("div", { className: "card content-card" },
                    React.createElement("div", { className: "card-head" },
                        React.createElement("div", null,
                            React.createElement("h2", null, "Student submission"),
                            React.createElement("p", null, "Submitted 27 Jul 2026, 9:02 am")),
                        React.createElement("button", { className: "button secondary compact" }, "View assessment instructions")),
                    React.createElement("div", { className: "submission-summary" },
                        React.createElement("dl", null,
                            React.createElement("div", null,
                                React.createElement("dt", null, "Student declaration"),
                                React.createElement("dd", null,
                                    React.createElement(Badge, { tone: "success" }, "Confirmed"))),
                            React.createElement("div", null,
                                React.createElement("dt", null, "Reasonable adjustment"),
                                React.createElement("dd", null, "None recorded")),
                            React.createElement("div", null,
                                React.createElement("dt", null, "Late submission"),
                                React.createElement("dd", null, "No")))),
                    React.createElement("h3", null, "Evidence files"),
                    React.createElement("div", { className: "evidence-preview" },
                        React.createElement("div", { className: "document-preview" },
                            React.createElement(Icon, { name: "file", size: 42 }),
                            React.createElement("strong", null, "WHS-site-inspection-resubmission.pdf"),
                            React.createElement("span", null, "PDF \u00B7 2.1 MB \u00B7 8 pages"),
                            React.createElement("button", { className: "button secondary" }, "Open evidence")),
                        React.createElement("div", { className: "document-preview" },
                            React.createElement(Icon, { name: "play", size: 42 }),
                            React.createElement("strong", null, "consultation-discussion.mp4"),
                            React.createElement("span", null, "Video \u00B7 46 MB \u00B7 2:14"),
                            React.createElement("button", { className: "button secondary" }, "Play video"))),
                    React.createElement("h3", null, "Student description"),
                    React.createElement("p", null, "I completed a hazard inspection with my workplace supervisor and then led a short consultation with two team members. The PDF includes the updated consultation record and signed final page.")),
                React.createElement("div", { className: "card content-card" },
                    React.createElement("h2", null, "Assessor feedback"),
                    React.createElement("label", { className: "field-label", htmlFor: "student-feedback" }, "Feedback visible to student"),
                    React.createElement("textarea", { id: "student-feedback", rows: "6", value: feedback, onChange: (e) => setFeedback(e.target.value), placeholder: "Explain what was demonstrated and any further evidence required." }),
                    React.createElement("label", { className: "field-label", htmlFor: "internal-note" }, "Internal assessor note"),
                    React.createElement("textarea", { id: "internal-note", rows: "3", value: internalNote, onChange: (e) => setInternalNote(e.target.value), placeholder: "Not visible to the student" }))),
            React.createElement("aside", { className: "card rubric-panel" },
                React.createElement("div", { className: "rubric-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "Marking rubric"),
                        React.createElement("h2", null, "Assessment criteria")),
                    React.createElement(Badge, { tone: "info" }, "Version 2.1")),
                [
                    ["Identify workplace hazards", "Performance criteria 1.1–1.3"],
                    ["Apply appropriate risk controls", "Performance criteria 2.1–2.4"],
                    ["Consult and communicate", "Performance criteria 3.1–3.3"],
                    ["Complete workplace records", "Performance evidence and conditions"],
                ].map(([title, map], i) => React.createElement("div", { className: "rubric-row", key: title },
                    React.createElement("div", null,
                        React.createElement("strong", null, title),
                        React.createElement("span", null, map)),
                    React.createElement("select", { "aria-label": `${title} judgement`, value: criteria[i], onChange: (e) => setCriteria((prev) => prev.map((v, j) => j === i ? e.target.value : v)) },
                        React.createElement("option", { value: "not_assessed" }, "Not assessed"),
                        React.createElement("option", { value: "satisfactory" }, "Satisfactory"),
                        React.createElement("option", { value: "not_yet_satisfactory" }, "Not yet satisfactory")),
                    React.createElement("textarea", { rows: "2", "aria-label": `${title} comment`, placeholder: "Criterion comment" }))),
                React.createElement("div", { className: "decision-panel" },
                    React.createElement("h3", null, "Assessment decision"),
                    React.createElement("p", null, "A final unit competency outcome should only be recorded when all assessment requirements have been satisfied."),
                    React.createElement("button", { className: "button primary full", disabled: criteria.some((c) => c !== "satisfactory"), onClick: () => finalise("satisfactory") }, "Record satisfactory and competent"),
                    React.createElement("button", { className: "button warning full", onClick: () => finalise("resubmission") }, "Request further evidence"),
                    React.createElement("button", { className: "button secondary full", onClick: () => setSaved(true) }, "Save draft"),
                    saved && React.createElement("div", { className: "result-message success", role: "status" },
                        React.createElement("strong", null, "Assessment record saved."),
                        " Audit history updated.")))));
}
function CohortView() {
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "2026-T3-HORT-A", title: "Cohort progress", description: "Attendance, activity, unit progression and learner-support indicators.", actions: React.createElement("button", { className: "button secondary" }, "Export progress report") }),
        React.createElement("div", { className: "card table-card" },
            React.createElement("div", { className: "table-toolbar" },
                React.createElement("div", { className: "search-field" },
                    React.createElement(Icon, { name: "search", size: 17 }),
                    React.createElement("input", { "aria-label": "Search students", placeholder: "Search students" })),
                React.createElement("div", { className: "filter-group" },
                    React.createElement("select", { "aria-label": "Filter support alert" },
                        React.createElement("option", null, "All students"),
                        React.createElement("option", null, "Support alerts"),
                        React.createElement("option", null, "Low attendance"),
                        React.createElement("option", null, "Inactive 7+ days")))),
            React.createElement("div", { className: "responsive-table" },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Student"),
                            React.createElement("th", null, "Attendance"),
                            React.createElement("th", null, "Course progress"),
                            React.createElement("th", null, "Units competent"),
                            React.createElement("th", null, "Alerts"),
                            React.createElement("th", null, "Last active"),
                            React.createElement("th", null))),
                    React.createElement("tbody", null, DEMO_STUDENTS.map((student, i) => React.createElement("tr", { key: student.id },
                        React.createElement("td", null,
                            React.createElement("strong", null, student.name),
                            React.createElement("small", null, student.id)),
                        React.createElement("td", null,
                            React.createElement("span", { className: student.attendance < 80 ? "danger-text" : "" },
                                student.attendance,
                                "%")),
                        React.createElement("td", null,
                            React.createElement("div", { className: "mini-progress" },
                                React.createElement("span", { style: { width: `${student.progress}%` } })),
                            React.createElement("small", null,
                                student.progress,
                                "%")),
                        React.createElement("td", null,
                            Math.floor(student.progress / 10),
                            " / 17"),
                        React.createElement("td", null, student.alerts ? React.createElement(Badge, { tone: student.alerts > 1 ? "danger" : "warning" }, student.alerts) : React.createElement(Badge, { tone: "success" }, "None")),
                        React.createElement("td", null, student.lastActive),
                        React.createElement("td", null,
                            React.createElement("button", { className: "text-button" }, "Open profile")))))))));
}
function ComplianceDashboard({ setActive }) {
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Quality and compliance", title: "RTO compliance overview", description: "Operational checks for training delivery, assessment, records and integrations.", actions: React.createElement("button", { className: "button primary" }, "Generate monthly report") }),
        React.createElement("div", { className: "metric-grid" },
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Mapping coverage"),
                React.createElement("strong", null, "96%"),
                React.createElement("small", null, "4 criteria require review")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Current assessments"),
                React.createElement("strong", null,
                    "31",
                    React.createElement("em", null, "/34")),
                React.createElement("small", null, "Three versions expiring")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "Open quality actions"),
                React.createElement("strong", null, "7"),
                React.createElement("small", null, "Two high priority")),
            React.createElement("div", { className: "metric-card" },
                React.createElement("span", null, "System integrations"),
                React.createElement("strong", null,
                    "4",
                    React.createElement("em", null, "/5")),
                React.createElement("small", null, "One requires attention"))),
        React.createElement("div", { className: "dashboard-grid" },
            React.createElement("section", { className: "card" },
                React.createElement("div", { className: "card-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "Quality actions"),
                        React.createElement("h2", null, "Items requiring attention")),
                    React.createElement("button", { className: "text-button" }, "View register")),
                React.createElement("div", { className: "action-list" },
                    React.createElement("button", { onClick: () => setActive("mapping") },
                        React.createElement("span", { className: "action-icon warning" },
                            React.createElement(Icon, { name: "clipboard" })),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Assessment mapping gap"),
                            React.createElement("span", null, "AHCIRG337 \u00B7 Performance Evidence item 3")),
                        React.createElement(Badge, { tone: "warning" }, "High")),
                    React.createElement("button", null,
                        React.createElement("span", { className: "action-icon info" },
                            React.createElement(Icon, { name: "users" })),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Trainer currency review due"),
                            React.createElement("span", null, "Luke Hammond \u00B7 due 14 Aug")),
                        React.createElement(Badge, { tone: "info" }, "Scheduled")),
                    React.createElement("button", { onClick: () => setActive("integrations") },
                        React.createElement("span", { className: "action-icon warning" },
                            React.createElement(Icon, { name: "settings" })),
                        React.createElement("div", null,
                            React.createElement("strong", null, "SMS sync warning"),
                            React.createElement("span", null, "Three unit outcomes rejected overnight")),
                        React.createElement(Badge, { tone: "warning" }, "Review")))),
            React.createElement("section", { className: "card" },
                React.createElement("div", { className: "card-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "Recent activity"),
                        React.createElement("h2", null, "Audit events")),
                    React.createElement("button", { className: "text-button", onClick: () => setActive("audit") }, "Full audit history")),
                React.createElement("div", { className: "audit-mini" }, DEFAULT_AUDIT.slice(0, 4).map((event) => React.createElement("div", { key: event.id },
                    React.createElement("span", { className: "audit-icon" },
                        React.createElement(Icon, { name: "file", size: 17 })),
                    React.createElement("div", null,
                        React.createElement("strong", null, event.action),
                        React.createElement("span", null, event.item),
                        React.createElement("small", null,
                            event.user,
                            " \u00B7 ",
                            event.time))))))),
        React.createElement("section", { className: "card" },
            React.createElement("div", { className: "card-head" },
                React.createElement("div", null,
                    React.createElement("span", { className: "eyebrow" }, "Assessment governance"),
                    React.createElement("h2", null, "Validation and version status")),
                React.createElement("button", { className: "button secondary compact" }, "Open validation schedule")),
            React.createElement("div", { className: "responsive-table" },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Unit"),
                            React.createElement("th", null, "Current version"),
                            React.createElement("th", null, "Mapping"),
                            React.createElement("th", null, "Last validation"),
                            React.createElement("th", null, "Next review"),
                            React.createElement("th", null, "Status"))),
                    React.createElement("tbody", null, UNITS.slice(0, 6).map((unit, i) => React.createElement("tr", { key: unit.code },
                        React.createElement("td", null,
                            React.createElement("span", { className: "table-code" }, unit.code),
                            React.createElement("strong", null, unit.title)),
                        React.createElement("td", null,
                            "v",
                            2 + (i % 2),
                            ".",
                            i),
                        React.createElement("td", null, i === 3 ? "92%" : "100%"),
                        React.createElement("td", null, i % 2 ? "18 Mar 2026" : "12 Nov 2025"),
                        React.createElement("td", null, i % 2 ? "Mar 2027" : "Nov 2026"),
                        React.createElement("td", null,
                            React.createElement(Badge, { tone: i === 3 ? "warning" : "success" }, i === 3 ? "Review" : "Current")))))))));
}
function MappingView() {
    const unit = UNITS[12];
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Assessment governance", title: "Assessment mapping", description: "Trace every assessment activity to the requirements of the unit of competency.", actions: React.createElement("button", { className: "button secondary" }, "Export mapping matrix") }),
        React.createElement("div", { className: "mapping-header card" },
            React.createElement("div", null,
                React.createElement("span", { className: "unit-code large" }, unit.code),
                React.createElement("h2", null, unit.title),
                React.createElement("p", null, "Assessment tool version 2.0 \u00B7 Published 1 July 2026")),
            React.createElement("div", null,
                React.createElement(ProgressBar, { value: 96, label: "Coverage" }),
                React.createElement(Badge, { tone: "warning" }, "4 items require review"))),
        React.createElement("div", { className: "card table-card" },
            React.createElement("div", { className: "responsive-table" },
                React.createElement("table", { className: "mapping-table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Requirement"),
                            React.createElement("th", null, "Knowledge questions"),
                            React.createElement("th", null, "Practical observation"),
                            React.createElement("th", null, "Workplace evidence"),
                            React.createElement("th", null, "Coverage"))),
                    React.createElement("tbody", null, [
                        ["PC 1.1 Identify system components", true, true, false, "covered"],
                        ["PC 1.2 Confirm operating requirements", true, true, true, "covered"],
                        ["PC 2.1 Complete pre-start checks", false, true, true, "covered"],
                        ["PC 2.4 Monitor pressure and flow", true, true, true, "covered"],
                        ["PE 3 Respond to two system faults", false, true, false, "gap"],
                        ["KE 6 Environmental impacts", true, false, false, "covered"],
                        ["AC Workplace or realistic simulation", false, true, true, "covered"],
                    ].map((row) => React.createElement("tr", { key: row[0] },
                        React.createElement("td", null,
                            React.createElement("strong", null, row[0])),
                        row.slice(1, 4).map((v, i) => React.createElement("td", { key: i }, v ? React.createElement("span", { className: "mapping-check" },
                            React.createElement(Icon, { name: "check", size: 16 })) : React.createElement("span", { className: "mapping-empty" }, "\u2014"))),
                        React.createElement("td", null,
                            React.createElement(Badge, { tone: row[4] === "gap" ? "danger" : "success" }, row[4] === "gap" ? "Gap" : "Covered")))))))));
}
function AuditView() {
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Records integrity", title: "Audit history", description: "Append-only record of material access, changes, submissions and assessment decisions.", actions: React.createElement("button", { className: "button secondary" }, "Export filtered events") }),
        React.createElement("div", { className: "card table-card" },
            React.createElement("div", { className: "table-toolbar" },
                React.createElement("div", { className: "search-field" },
                    React.createElement(Icon, { name: "search", size: 17 }),
                    React.createElement("input", { "aria-label": "Search audit events", placeholder: "Search user, action or record" })),
                React.createElement("div", { className: "filter-group" },
                    React.createElement("select", { "aria-label": "Filter audit category" },
                        React.createElement("option", null, "All categories"),
                        React.createElement("option", null, "Assessment"),
                        React.createElement("option", null, "Access"),
                        React.createElement("option", null, "Content"),
                        React.createElement("option", null, "Integration")))),
            React.createElement("div", { className: "responsive-table" },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Event ID"),
                            React.createElement("th", null, "Date and time"),
                            React.createElement("th", null, "User"),
                            React.createElement("th", null, "Action"),
                            React.createElement("th", null, "Record"),
                            React.createElement("th", null, "IP / source"))),
                    React.createElement("tbody", null, [...DEFAULT_AUDIT, { id: "AUD-1000", time: "25 Jul 2026, 8:15 am", user: "Claire Donnelly", action: "Recorded assessment decision", item: "AHCPCM308 — Amelia Grant" }].map((event, i) => React.createElement("tr", { key: event.id },
                        React.createElement("td", null,
                            React.createElement("span", { className: "table-code" }, event.id)),
                        React.createElement("td", null, event.time),
                        React.createElement("td", null, event.user),
                        React.createElement("td", null, event.action),
                        React.createElement("td", null, event.item),
                        React.createElement("td", null, i === 3 ? "SIS API" : "10.24.16.42"))))))));
}
function IntegrationsView() {
    const integrations = [
        ["Student Management System", "Enrolments, unit outcomes and completion data", "Connected", "Last sync 9:12 am", "success"],
        ["WPHI Identity", "Single sign-on and multi-factor authentication", "Connected", "Healthy", "success"],
        ["Evidence Storage", "Secure documents, images and video", "Connected", "2.8 TB available", "success"],
        ["Email and SMS", "Transactional notifications and reminders", "Connected", "14 messages queued", "success"],
        ["AVETMISS validation service", "Pre-submission data validation", "Attention", "Three rejected records", "warning"],
    ];
    return React.createElement("div", null,
        React.createElement(SectionHeader, { eyebrow: "Platform administration", title: "Integrations", description: "Status of identity, student management, storage, communication and reporting services.", actions: React.createElement("button", { className: "button secondary" }, "Run health check") }),
        React.createElement("div", { className: "integration-grid" }, integrations.map(([name, body, status, detail, tone]) => React.createElement("section", { className: "card integration-card", key: name },
            React.createElement("div", { className: "integration-icon" },
                React.createElement(Icon, { name: name.includes("Identity") ? "shield" : name.includes("Storage") ? "file" : name.includes("Email") ? "message" : "settings" })),
            React.createElement("div", null,
                React.createElement("h2", null, name),
                React.createElement("p", null, body),
                React.createElement("div", null,
                    React.createElement(Badge, { tone: tone }, status),
                    React.createElement("span", null, detail))),
            React.createElement("button", { className: "button secondary compact" }, "Manage")))),
        React.createElement("section", { className: "card sync-log" },
            React.createElement("div", { className: "card-head" },
                React.createElement("div", null,
                    React.createElement("h2", null, "Recent synchronisation activity"),
                    React.createElement("p", null, "Outbound and inbound records processed during the past 24 hours."))),
            React.createElement("div", { className: "responsive-table" },
                React.createElement("table", null,
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Time"),
                            React.createElement("th", null, "Service"),
                            React.createElement("th", null, "Operation"),
                            React.createElement("th", null, "Records"),
                            React.createElement("th", null, "Result"))),
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "9:12 am"),
                            React.createElement("td", null, "Student Management System"),
                            React.createElement("td", null, "Enrolment sync"),
                            React.createElement("td", null, "18"),
                            React.createElement("td", null,
                                React.createElement(Badge, { tone: "success" }, "Successful"))),
                        React.createElement("tr", null,
                            React.createElement("td", null, "8:45 am"),
                            React.createElement("td", null, "AVETMISS validator"),
                            React.createElement("td", null, "Outcome validation"),
                            React.createElement("td", null, "42"),
                            React.createElement("td", null,
                                React.createElement(Badge, { tone: "warning" }, "39 accepted, 3 rejected"))),
                        React.createElement("tr", null,
                            React.createElement("td", null, "8:30 am"),
                            React.createElement("td", null, "Email and SMS"),
                            React.createElement("td", null, "Due-date reminders"),
                            React.createElement("td", null, "27"),
                            React.createElement("td", null,
                                React.createElement(Badge, { tone: "success" }, "Sent"))))))));
}
function WPHILearnV2() {
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
            if (record === null || record === void 0 ? void 0 : record.value) {
                try {
                    setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(record.value) });
                }
                catch { }
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
        content = React.createElement("div", { className: "loading-screen" },
            React.createElement("div", { className: "loader" }),
            React.createElement("strong", null, "Loading WPHI Learn"));
    }
    else if (selectedUnit) {
        content = React.createElement(UnitWorkspace, { unit: selectedUnit, progress: progress, updateProgress: updateProgress, initialTab: selectedUnitTab, close: () => setSelectedUnit(null) });
    }
    else if (markingIndex !== null) {
        content = React.createElement(MarkingWorkspace, { index: markingIndex, close: () => setMarkingIndex(null), progress: progress, updateProgress: updateProgress });
    }
    else {
        const views = {
            dashboard: React.createElement(StudentDashboard, { progress: progress, openUnit: openUnit, setActive: setActive }),
            course: React.createElement(CourseView, { progress: progress, openUnit: openUnit }),
            calendar: React.createElement(CalendarView, null),
            assessments: React.createElement(AssessmentsView, { progress: progress, openUnit: openUnit }),
            results: React.createElement(ResultsView, { progress: progress }),
            messages: React.createElement(MessagesView, null),
            support: React.createElement(SupportView, null),
            "trainer-dashboard": React.createElement(TrainerDashboard, { progress: progress, setActive: setActive, openMarking: openMarking }),
            marking: React.createElement(MarkingQueue, { openMarking: openMarking }),
            cohort: React.createElement(CohortView, null),
            "compliance-dashboard": React.createElement(ComplianceDashboard, { setActive: setActive }),
            mapping: React.createElement(MappingView, null),
            audit: React.createElement(AuditView, null),
            integrations: React.createElement(IntegrationsView, null),
        };
        content = views[active] || views.dashboard;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("style", null, `
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
      `),
        React.createElement(AppShell, { role: role, setRole: setRole, active: active, setActive: (key) => { setSelectedUnit(null); setMarkingIndex(null); setActive(key); }, unread: unread, mobileNav: mobileNav, setMobileNav: setMobileNav }, content)));
}
(function bootWPHI() {
    const mount = document.getElementById("root");
    if (!mount)
        return;
    const root = ReactDOM.createRoot(mount);
    root.render(React.createElement(WPHILearnV2));
})();
