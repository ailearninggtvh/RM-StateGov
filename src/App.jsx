import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Briefcase, Users, Activity, CheckSquare, BookOpen,
  Map, Grid3x3, FileText, Plus, Search, Trash2, X, ChevronRight,
  MapPin, Target, Menu, Save, Download, Upload, Settings as SettingsIcon
} from "lucide-react";

// ============================================================
// DEFAULT MASTER LISTS (used on first run)
// ============================================================
const DEFAULT_MASTER = {
  states: ["Tamil Nadu", "Karnataka", "Maharashtra"],
  products: ["UPI", "NCMC", "RuPay", "AePS", "BBPS", "FASTag", "Bharat Connect", "Multiple"],
  departments: [
    "Transport", "Metro Rail / UMTA", "Treasury / Finance", "Welfare / Social Justice",
    "Municipal Admin / ULB", "e-Governance / IT", "Smart City SPV", "Health",
    "Education", "Food / PDS", "Revenue", "CMO / Planning"
  ],
  stages: [
    "Signal Detected", "Department Engaged", "Concept Note Shared", "Pilot Scoping",
    "Pilot Live", "RFP Drafted", "Tender Released", "Bidding", "Won", "Lost", "Stalled"
  ],
  sentiments: ["Champion", "Supportive", "Neutral", "Skeptical", "Blocker"],
  priorities: ["P0 - Critical", "P1 - High", "P2 - Medium", "P3 - Low"],
  statuses: ["Open", "In Progress", "Blocked", "Done", "Dropped"],
  touchFreq: [
    { label: "Weekly", days: 7 },
    { label: "Bi-weekly", days: 14 },
    { label: "Monthly", days: 30 },
    { label: "Quarterly", days: 90 },
    { label: "On-demand", days: 60 },
  ],
};

// ============================================================
// SEED DATA
// ============================================================
const SEED_STATES = [
  { id: "ST-01", name: "Tamil Nadu", capital: "Chennai", priorities: "1) Chennai Metro Phase 2 rollout  2) PDS modernization  3) MSME credit access", initiatives: "Chennai Metro Phase 2 (118 km), TNSTC fleet digitization, Smart City Coimbatore & Madurai", footprint: "UPI dominant; FASTag mature; AePS via TN Co-op Bank network", whitespace: "NCMC on TNSTC buses; BBPS for property tax in tier-2 ULBs; AePS expansion in PDS", lead: "TNeGA under IT Dept", budget: "3,80,000" },
  { id: "ST-02", name: "Karnataka", capital: "Bengaluru", priorities: "1) Namma Metro Phase 3  2) BBMP revenue digitization  3) Welfare DBT consolidation", initiatives: "BMRCL Phase 3, BBMP property tax revamp, Karnataka One, Anna Bhagya DBT", footprint: "UPI saturated; NCMC live on BMRCL; Karnataka One uses BBPS rails", whitespace: "NCMC on BMTC bus fleet; cross-modal NCMC; BBPS for water utility", lead: "Centre for Smart Governance (CSG)", budget: "3,71,000" },
  { id: "ST-03", name: "Maharashtra", capital: "Mumbai", priorities: "1) Mumbai Metro Line 3+ commissioning  2) MahaDBT consolidation  3) Aaple Sarkar 2.0", initiatives: "Mumbai Metro Lines 2A/3/7, MSRTC fleet, Smart City Pune/Nagpur, MahaDBT", footprint: "UPI saturated; Mumbai 1 card legacy; MahaDBT runs partly on AePS", whitespace: "Open-loop NCMC on metro + MSRTC; BBPS for octroi-replacement levies; AePS in tribal welfare", lead: "MahaIT (Directorate of IT)", budget: "6,12,000" },
];

const SEED_OFFICIALS = [
  { id: "OFF-001", state: "Tamil Nadu", dept: "Transport", name: "[Name]", designation: "Principal Secretary - Transport", cadre: "IAS", batch: "1995", relevance: "Owns TNSTC fleet decisions; AFC budget approver", sentiment: "Neutral", touchFreq: "Monthly", lastTouch: "2026-04-22", notes: "Met at NCMC industry roundtable" },
  { id: "OFF-002", state: "Tamil Nadu", dept: "Metro Rail / UMTA", name: "[Name]", designation: "MD - CMRL", cadre: "IRS", batch: "2001", relevance: "Phase 2 AFC vendor selection", sentiment: "Supportive", touchFreq: "Bi-weekly", lastTouch: "2026-04-30", notes: "Open to NCMC interoperability" },
  { id: "OFF-003", state: "Karnataka", dept: "Metro Rail / UMTA", name: "[Name]", designation: "MD - BMRCL", cadre: "IAS", batch: "1992", relevance: "Phase 3 AFC; NCMC live on Phase 1/2", sentiment: "Champion", touchFreq: "Monthly", lastTouch: "2026-05-02", notes: "Already running NCMC at scale" },
  { id: "OFF-004", state: "Karnataka", dept: "Municipal Admin / ULB", name: "[Name]", designation: "Commissioner - BBMP", cadre: "IAS", batch: "2003", relevance: "Property tax + utility BBPS rails", sentiment: "Neutral", touchFreq: "Monthly", lastTouch: "2026-03-15", notes: "" },
  { id: "OFF-005", state: "Maharashtra", dept: "Transport", name: "[Name]", designation: "VC & MD - MSRTC", cadre: "MH State", batch: "—", relevance: "Bus fleet AFC + EV infra", sentiment: "Supportive", touchFreq: "Bi-weekly", lastTouch: "2026-04-18", notes: "Driving fleet modernization" },
  { id: "OFF-006", state: "Maharashtra", dept: "e-Governance / IT", name: "[Name]", designation: "Principal Secretary - IT", cadre: "IAS", batch: "1998", relevance: "MahaDBT, AePS, MahaIT initiatives", sentiment: "Neutral", touchFreq: "Monthly", lastTouch: "2026-04-12", notes: "" },
  { id: "OFF-007", state: "Tamil Nadu", dept: "e-Governance / IT", name: "[Name]", designation: "CEO - TNeGA", cadre: "IAS", batch: "2005", relevance: "Owns digital payments mission", sentiment: "Champion", touchFreq: "Bi-weekly", lastTouch: "2026-05-04", notes: "Strong AePS push" },
  { id: "OFF-008", state: "Karnataka", dept: "Treasury / Finance", name: "[Name]", designation: "Director - Treasuries", cadre: "KAS", batch: "—", relevance: "Welfare DBT execution", sentiment: "Neutral", touchFreq: "Quarterly", lastTouch: "2026-02-28", notes: "" },
];

const SEED_OPPS = [
  { id: "OPP-001", state: "Tamil Nadu", dept: "Metro Rail / UMTA", project: "CMRL Phase 2 AFC + NCMC integration", product: "NCMC", scale: 180, stage: "Concept Note Shared", probability: 40, source: "CMRL tender pre-bid query published Feb 2026", nextMilestone: "Pre-bid clarification meeting", nextDate: "2026-06-10", officialId: "OFF-002", notes: "Push interoperability angle" },
  { id: "OPP-002", state: "Tamil Nadu", dept: "Transport", project: "TNSTC fleet AFC modernization (35k buses)", product: "NCMC", scale: 220, stage: "Department Engaged", probability: 25, source: "Transport Dept FY26 budget speech", nextMilestone: "Concept note submission", nextDate: "2026-05-30", officialId: "OFF-001", notes: "PSU bank-led consortium scoping" },
  { id: "OPP-003", state: "Tamil Nadu", dept: "Food / PDS", project: "PDS biometric authentication expansion to 100% FPS", product: "AePS", scale: 45, stage: "Pilot Live", probability: 70, source: "TNeGA pilot in 3 districts; expansion paper drafted", nextMilestone: "State-wide rollout cabinet approval", nextDate: "2026-07-15", officialId: "OFF-007", notes: "Champion in TNeGA" },
  { id: "OPP-004", state: "Karnataka", dept: "Metro Rail / UMTA", project: "BMRCL Phase 3 AFC + cross-modal NCMC", product: "NCMC", scale: 140, stage: "Pilot Scoping", probability: 55, source: "BMRCL Phase 1/2 NCMC success; Phase 3 AFC RFI", nextMilestone: "RFP draft review", nextDate: "2026-06-25", officialId: "OFF-003", notes: "Use as flagship case study" },
  { id: "OPP-005", state: "Karnataka", dept: "Municipal Admin / ULB", project: "BBMP property tax + water utility on BBPS", product: "BBPS", scale: 30, stage: "Department Engaged", probability: 35, source: "BBMP Commissioner town hall comments", nextMilestone: "Workshop with BBMP revenue cell", nextDate: "2026-06-15", officialId: "OFF-004", notes: "Existing BBMP gateway vendor" },
  { id: "OPP-006", state: "Karnataka", dept: "Welfare / Social Justice", project: "Anna Bhagya DBT consolidation on AePS", product: "AePS", scale: 35, stage: "Signal Detected", probability: 15, source: "Welfare Dept news leak; budget allocation up 18%", nextMilestone: "Initial meeting with welfare commissioner", nextDate: "2026-06-30", officialId: "", notes: "" },
  { id: "OPP-007", state: "Maharashtra", dept: "Transport", project: "MSRTC fleet AFC + EV charging payments", product: "Multiple", scale: 310, stage: "Department Engaged", probability: 30, source: "MSRTC modernization paper Mar 2026", nextMilestone: "Joint workshop with MSRTC tech team", nextDate: "2026-06-05", officialId: "OFF-005", notes: "NCMC + UPI dual stack pitch" },
  { id: "OPP-008", state: "Maharashtra", dept: "e-Governance / IT", project: "MahaDBT next-gen AePS layer", product: "AePS", scale: 55, stage: "Concept Note Shared", probability: 45, source: "MahaIT Pr. Secy meeting Apr 2026", nextMilestone: "Technical proposal review", nextDate: "2026-05-25", officialId: "OFF-006", notes: "" },
];

const SEED_ACTIONS = [
  { id: "ACT-001", source: "CMRL pre-bid clarification", state: "Tamil Nadu", oppId: "OPP-001", officialId: "OFF-002", description: "Send NCMC interoperability tech briefing pack to CMRL", dueDate: "2026-05-15", priority: "P1 - High", status: "In Progress", notes: "Pulled BMRCL specs for reference" },
  { id: "ACT-002", source: "TNeGA quarterly review", state: "Tamil Nadu", oppId: "OPP-003", officialId: "OFF-007", description: "Prepare cabinet briefing materials for state-wide PDS AePS rollout", dueDate: "2026-05-25", priority: "P0 - Critical", status: "Open", notes: "" },
  { id: "ACT-003", source: "BMRCL Phase 3 RFI", state: "Karnataka", oppId: "OPP-004", officialId: "OFF-003", description: "Draft Phase 3 cross-modal NCMC inputs for RFP", dueDate: "2026-06-10", priority: "P0 - Critical", status: "In Progress", notes: "" },
  { id: "ACT-004", source: "MSRTC scoping call", state: "Maharashtra", oppId: "OPP-007", officialId: "OFF-005", description: "Confirm joint workshop date with MSRTC tech team", dueDate: "2026-05-20", priority: "P1 - High", status: "Blocked", notes: "Awaiting MSRTC tech team availability" },
  { id: "ACT-005", source: "MahaIT proposal review", state: "Maharashtra", oppId: "OPP-008", officialId: "OFF-006", description: "Submit revised technical proposal for MahaDBT AePS layer", dueDate: "2026-05-22", priority: "P1 - High", status: "Open", notes: "" },
  { id: "ACT-006", source: "BBMP property tax pitch", state: "Karnataka", oppId: "OPP-005", officialId: "OFF-004", description: "Schedule workshop with BBMP revenue cell", dueDate: "2026-06-15", priority: "P2 - Medium", status: "Open", notes: "" },
  { id: "ACT-007", source: "TN Transport Secy meeting", state: "Tamil Nadu", oppId: "OPP-002", officialId: "OFF-001", description: "Share BMRCL benchmark data + propose joint TNSTC workshop", dueDate: "2026-05-30", priority: "P1 - High", status: "Open", notes: "" },
];

const SEED_CASES = [
  { id: "CS-001", state: "Karnataka", project: "BMRCL Phase 1/2 NCMC", dept: "BMRCL", product: "NCMC", year: 2022, scale: "≈8 Cr txn/yr", outcomes: "Cash share dropped from ~60% to <25%; queue times reduced; interoperable across modes", whatWorked: "Strong CEO sponsorship; phased rollout; bank consortium", watchOut: "Initial card issuance bottleneck" },
  { id: "CS-002", state: "Delhi", project: "DMRC NCMC + Mobile Wallet", dept: "DMRC", product: "NCMC", year: 2023, scale: "≈15 Cr txn/yr", outcomes: "First open-loop on India's largest metro; benchmark for Phase 4", whatWorked: "Strong central govt push; tech-mature DMRC team", watchOut: "Card-mobile parity took multiple iterations" },
  { id: "CS-003", state: "Andhra Pradesh", project: "AP PDS AePS authentication", dept: "Civil Supplies", product: "AePS", year: 2018, scale: "≈30 Cr txn/yr at peak", outcomes: "100% biometric auth at FPS; leakage reduction documented in CAG reports", whatWorked: "Political will; FPS dealer training", watchOut: "Connectivity at rural FPS; biometric exception handling" },
  { id: "CS-004", state: "Telangana", project: "T-App Folio / MeeSeva BBPS", dept: "ITE&C Dept", product: "BBPS", year: 2020, scale: "≈4 Cr txn/yr", outcomes: "Citizen service fee aggregation; cross-channel payment options", whatWorked: "MeeSeva existing footprint", watchOut: "Biller onboarding pace" },
  { id: "CS-005", state: "Gujarat", project: "GSRTC bus ticketing UPI + NCMC", dept: "GSRTC", product: "Multiple", year: 2023, scale: "≈12 Cr txn/yr", outcomes: "Cash leakage reduction; conductor productivity up; reconciliation T+1", whatWorked: "Mid-size pilot before scale; conductor incentive design", watchOut: "Hardware uptime in monsoon" },
  { id: "CS-006", state: "Kerala", project: "Kochi Metro Open-Loop Card", dept: "KMRL", product: "NCMC", year: 2021, scale: "≈3 Cr txn/yr", outcomes: "Multi-modal (metro + water metro + bus) on single card", whatWorked: "Single SPV across modes; political alignment", watchOut: "Smaller scale; per-txn economics" },
];

// ============================================================
// STORAGE
// ============================================================
const lsGet = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const lsSet = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error(e); }
};

const todayStr = () => new Date().toISOString().slice(0, 10);
const daysBetween = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date(todayStr());
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
};

const sentimentColor = (s) => ({
  Champion: "bg-emerald-100 text-emerald-900 border-emerald-300",
  Supportive: "bg-teal-100 text-teal-900 border-teal-300",
  Neutral: "bg-stone-100 text-stone-700 border-stone-300",
  Skeptical: "bg-amber-100 text-amber-900 border-amber-300",
  Blocker: "bg-rose-100 text-rose-900 border-rose-300",
}[s] || "bg-stone-100 text-stone-700 border-stone-300");

const stageColor = (s) => {
  if (s === "Won") return "bg-emerald-600 text-white";
  if (["Lost", "Stalled"].includes(s)) return "bg-stone-400 text-white";
  if (["Bidding", "Tender Released", "RFP Drafted"].includes(s)) return "bg-amber-600 text-white";
  if (["Pilot Live", "Pilot Scoping", "Concept Note Shared"].includes(s)) return "bg-indigo-600 text-white";
  return "bg-stone-200 text-stone-800";
};

const priorityColor = (p) => {
  if (!p) return "bg-stone-300 text-stone-700";
  if (p.startsWith("P0")) return "bg-rose-600 text-white";
  if (p.startsWith("P1")) return "bg-amber-600 text-white";
  if (p.startsWith("P2")) return "bg-stone-500 text-white";
  return "bg-stone-300 text-stone-700";
};

const statusColor = (s) => ({
  Open: "bg-sky-100 text-sky-900 border-sky-300",
  "In Progress": "bg-indigo-100 text-indigo-900 border-indigo-300",
  Blocked: "bg-rose-100 text-rose-900 border-rose-300",
  Done: "bg-emerald-100 text-emerald-900 border-emerald-300",
  Dropped: "bg-stone-100 text-stone-600 border-stone-300",
}[s] || "bg-stone-100 text-stone-700 border-stone-300");

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Master lists (editable)
  const [master, setMaster] = useState(() => {
    const saved = lsGet("npci_master", null);
    if (!saved) return DEFAULT_MASTER;
    // Merge with defaults to handle new master keys added in future versions
    return { ...DEFAULT_MASTER, ...saved };
  });

  // Domain data
  const [states, setStates] = useState(() => lsGet("npci_states", SEED_STATES));
  const [officials, setOfficials] = useState(() => lsGet("npci_officials", SEED_OFFICIALS));
  const [opps, setOpps] = useState(() => lsGet("npci_opps", SEED_OPPS));
  const [actions, setActions] = useState(() => lsGet("npci_actions", SEED_ACTIONS));
  const [cases, setCases] = useState(() => lsGet("npci_cases", SEED_CASES));
  const [meetings, setMeetings] = useState(() => lsGet("npci_meetings", []));

  // Persist on change
  useEffect(() => { lsSet("npci_master", master); }, [master]);
  useEffect(() => { lsSet("npci_states", states); }, [states]);
  useEffect(() => { lsSet("npci_officials", officials); }, [officials]);
  useEffect(() => { lsSet("npci_opps", opps); }, [opps]);
  useEffect(() => { lsSet("npci_actions", actions); }, [actions]);
  useEffect(() => { lsSet("npci_cases", cases); }, [cases]);
  useEffect(() => { lsSet("npci_meetings", meetings); }, [meetings]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pipeline", label: "Pipeline", icon: Briefcase },
    { id: "officials", label: "Officials", icon: Users },
    { id: "cadence", label: "Cadence", icon: Activity },
    { id: "actions", label: "Actions", icon: CheckSquare },
    { id: "meetings", label: "Meeting Prep", icon: FileText },
    { id: "cases", label: "Case Studies", icon: BookOpen },
    { id: "states", label: "State Profiles", icon: Map },
    { id: "fitmatrix", label: "Product Fit", icon: Grid3x3 },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  const resetData = () => {
    if (!confirm("Reset all data and master lists to seed examples? This cannot be undone.")) return;
    setMaster(DEFAULT_MASTER);
    setStates(SEED_STATES); setOfficials(SEED_OFFICIALS); setOpps(SEED_OPPS);
    setActions(SEED_ACTIONS); setCases(SEED_CASES); setMeetings([]);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ master, states, officials, opps, actions, cases, meetings }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `npci-gr-export-${todayStr()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const j = JSON.parse(ev.target.result);
        if (!confirm("This will replace all current data. Continue?")) return;
        if (j.master) setMaster({ ...DEFAULT_MASTER, ...j.master });
        if (j.states) setStates(j.states);
        if (j.officials) setOfficials(j.officials);
        if (j.opps) setOpps(j.opps);
        if (j.actions) setActions(j.actions);
        if (j.cases) setCases(j.cases);
        if (j.meetings) setMeetings(j.meetings);
        alert("Import complete.");
      } catch (err) {
        alert("Failed to parse file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setDrawerOpen(true)} className="p-1 -ml-1" aria-label="Menu"><Menu className="w-6 h-6" /></button>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500">NPCI · GR Hub</div>
            <div className="text-base font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>{navItems.find(n => n.id === tab)?.label}</div>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="p-5 border-b border-stone-200">
              <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Government Relations</div>
              <div className="text-xl font-bold mt-1" style={{ fontFamily: "'Fraunces', serif" }}>NPCI GR Hub</div>
            </div>
            <nav className="flex-1 p-2 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button key={item.id} onClick={() => { setTab(item.id); setDrawerOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left text-sm transition ${active ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"}`}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <DrawerActions exportData={exportData} importData={importData} resetData={resetData} />
          </div>
        </div>
      )}

      <div className="md:flex">
        <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:border-r md:border-stone-200 bg-white">
          <div className="p-6 border-b border-stone-200">
            <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Government Relations</div>
            <div className="text-2xl font-bold mt-1 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>NPCI<br />GR Hub</div>
          </div>
          <nav className="flex-1 p-3 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left text-sm transition mb-0.5 ${active ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"}`}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <DrawerActions exportData={exportData} importData={importData} resetData={resetData} />
        </aside>

        <main className="md:ml-64 flex-1 min-h-screen pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            {tab === "dashboard" && <Dashboard opps={opps} actions={actions} officials={officials} master={master} setTab={setTab} />}
            {tab === "pipeline" && <Pipeline opps={opps} setOpps={setOpps} officials={officials} master={master} />}
            {tab === "officials" && <Officials officials={officials} setOfficials={setOfficials} master={master} />}
            {tab === "cadence" && <Cadence officials={officials} setOfficials={setOfficials} opps={opps} master={master} />}
            {tab === "actions" && <Actions actions={actions} setActions={setActions} opps={opps} officials={officials} master={master} />}
            {tab === "meetings" && <Meetings meetings={meetings} setMeetings={setMeetings} officials={officials} states={states} />}
            {tab === "cases" && <Cases cases={cases} setCases={setCases} master={master} />}
            {tab === "states" && <StatesView states={states} setStates={setStates} />}
            {tab === "fitmatrix" && <FitMatrix master={master} />}
            {tab === "settings" && <Settings master={master} setMaster={setMaster} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function DrawerActions({ exportData, importData, resetData }) {
  return (
    <div className="p-3 border-t border-stone-200 space-y-1">
      <button onClick={exportData} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded">
        <Download className="w-3.5 h-3.5" /> Export JSON
      </button>
      <label className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded cursor-pointer">
        <Upload className="w-3.5 h-3.5" /> Import JSON
        <input type="file" accept="application/json" onChange={importData} className="hidden" />
      </label>
      <button onClick={resetData} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded">
        <Trash2 className="w-3.5 h-3.5" /> Reset to seed
      </button>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ opps, actions, officials, master, setTab }) {
  const totalScale = opps.reduce((s, o) => s + (Number(o.scale) || 0), 0);
  const weighted = opps.reduce((s, o) => s + ((Number(o.scale) || 0) * (Number(o.probability) || 0) / 100), 0);
  const overdue = actions.filter(a => a.status !== "Done" && a.status !== "Dropped" && new Date(a.dueDate) < new Date(todayStr()));
  const dueThisWeek = actions.filter(a => {
    if (a.status === "Done" || a.status === "Dropped") return false;
    const d = new Date(a.dueDate);
    const today = new Date(todayStr());
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });
  const overdueTouches = officials.filter(o => {
    const d = daysBetween(o.lastTouch);
    const target = master.touchFreq.find(f => f.label === o.touchFreq)?.days || 30;
    return d !== null && d > target * 1.5;
  });
  const upcomingMilestones = [...opps]
    .filter(o => o.nextDate && new Date(o.nextDate) >= new Date(todayStr()))
    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
    .slice(0, 5);

  const dateLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <div className="text-[11px] uppercase tracking-[0.25em] text-stone-500">{dateLabel}</div>
        <h1 className="text-4xl font-bold mt-2 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>Dashboard</h1>
        <p className="text-stone-600 mt-1 text-sm">Pipeline at a glance, actions due, relationship health.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Pipeline value" value={`₹${totalScale.toLocaleString("en-IN")} Cr`} sub={`across ${opps.length} opps`} />
        <Stat label="Weighted" value={`₹${weighted.toFixed(0)} Cr`} sub="risk-adjusted" tone="accent" />
        <Stat label="Overdue actions" value={overdue.length} sub={`of ${actions.length}`} tone={overdue.length > 0 ? "danger" : "neutral"} />
        <Stat label="Touchpoints due" value={overdueTouches.length} sub={`of ${officials.length} officials`} tone={overdueTouches.length > 0 ? "warn" : "neutral"} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Overdue actions" cta={{ label: "View all", onClick: () => setTab("actions") }}>
          {overdue.length === 0 && <Empty msg="Nothing overdue. Nice." />}
          {overdue.slice(0, 5).map(a => (
            <div key={a.id} className="py-3 border-b border-stone-100 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-stone-900 truncate">{a.description}</div>
                  <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {a.state} · due {a.dueDate}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${priorityColor(a.priority)}`}>{a.priority?.split(" ")[0]}</span>
              </div>
            </div>
          ))}
        </Card>

        <Card title="Touchpoints due" cta={{ label: "View cadence", onClick: () => setTab("cadence") }}>
          {overdueTouches.length === 0 && <Empty msg="All touchpoints in cadence." />}
          {overdueTouches.slice(0, 5).map(o => {
            const d = daysBetween(o.lastTouch);
            return (
              <div key={o.id} className="py-3 border-b border-stone-100 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-stone-900 truncate">{o.designation}</div>
                    <div className="text-xs text-stone-500 mt-1">{o.state} · {o.dept}</div>
                  </div>
                  <span className="text-xs text-rose-700 font-mono whitespace-nowrap" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{d}d</span>
                </div>
              </div>
            );
          })}
        </Card>

        <Card title="Upcoming milestones" cta={{ label: "View pipeline", onClick: () => setTab("pipeline") }}>
          {upcomingMilestones.length === 0 && <Empty msg="No upcoming milestones scheduled." />}
          {upcomingMilestones.map(o => (
            <div key={o.id} className="py-3 border-b border-stone-100 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-stone-900 truncate">{o.nextMilestone}</div>
                  <div className="text-xs text-stone-500 mt-1 truncate">{o.project}</div>
                </div>
                <span className="text-xs text-stone-700 font-mono whitespace-nowrap" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{o.nextDate}</span>
              </div>
            </div>
          ))}
        </Card>

        <Card title="Due this week" cta={{ label: "View actions", onClick: () => setTab("actions") }}>
          {dueThisWeek.length === 0 && <Empty msg="Nothing due this week." />}
          {dueThisWeek.map(a => (
            <div key={a.id} className="py-3 border-b border-stone-100 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-stone-900 truncate">{a.description}</div>
                  <div className="text-xs text-stone-500 mt-1">{a.state} · {a.dueDate}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${statusColor(a.status)}`}>{a.status}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white border-stone-200",
    accent: "bg-stone-900 text-white border-stone-900",
    danger: "bg-rose-50 border-rose-200",
    warn: "bg-amber-50 border-amber-200",
  };
  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <div className={`text-[10px] uppercase tracking-widest ${tone === "accent" ? "text-stone-400" : "text-stone-500"}`}>{label}</div>
      <div className={`text-2xl md:text-3xl font-bold mt-1 ${tone === "accent" ? "text-white" : "text-stone-900"}`} style={{ fontFamily: "'Fraunces', serif" }}>{value}</div>
      <div className={`text-xs mt-0.5 ${tone === "accent" ? "text-stone-400" : "text-stone-500"}`}>{sub}</div>
    </div>
  );
}

function Card({ title, cta, children }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg">
      <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>{title}</h3>
        {cta && (
          <button onClick={cta.onClick} className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-0.5">
            {cta.label} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}

function Empty({ msg }) { return <div className="text-xs text-stone-400 italic py-6 text-center">{msg}</div>; }

// ============================================================
// PIPELINE
// ============================================================
function Pipeline({ opps, setOpps, officials, master }) {
  const [stateFilter, setStateFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => opps.filter(o =>
    (stateFilter === "All" || o.state === stateFilter) &&
    (stageFilter === "All" || o.stage === stageFilter) &&
    (!search || o.project.toLowerCase().includes(search.toLowerCase()))
  ), [opps, stateFilter, stageFilter, search]);

  const totalScale = filtered.reduce((s, o) => s + (Number(o.scale) || 0), 0);
  const weighted = filtered.reduce((s, o) => s + ((Number(o.scale) || 0) * (Number(o.probability) || 0) / 100), 0);

  const newOpp = () => setEditing({
    id: `OPP-${String(opps.length + 1).padStart(3, "0")}`,
    state: master.states[0] || "", dept: master.departments[0] || "",
    product: master.products[0] || "", stage: master.stages[0] || "",
    probability: 20, scale: 0, project: "", source: "", nextMilestone: "",
    nextDate: "", officialId: "", notes: ""
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Pipeline" subtitle={`${filtered.length} opportunities · ₹${totalScale.toLocaleString("en-IN")} Cr · ₹${weighted.toFixed(0)} Cr weighted`} action={{ label: "Add", onClick: newOpp }} />

      <div className="flex flex-wrap gap-2">
        <Pill options={["All", ...master.states]} value={stateFilter} onChange={setStateFilter} label="State" />
        <Pill options={["All", ...master.stages]} value={stageFilter} onChange={setStageFilter} label="Stage" />
        <div className="flex-1 min-w-[160px] relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…" className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:border-stone-400" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(o => {
          const w = (Number(o.scale) * Number(o.probability) / 100).toFixed(1);
          const off = officials.find(x => x.id === o.officialId);
          return (
            <div key={o.id} className="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition cursor-pointer" onClick={() => setEditing(o)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${stageColor(o.stage)}`}>{o.stage}</span>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500">{o.state} · {o.dept}</span>
                  </div>
                  <h3 className="text-base font-semibold text-stone-900 leading-snug">{o.project}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                    <span className="px-1.5 py-0.5 bg-stone-100 rounded font-medium">{o.product}</span>
                    {off && <span className="truncate">{off.designation}</span>}
                  </div>
                  {o.nextMilestone && (
                    <div className="mt-2 text-xs text-stone-600 flex items-center gap-1.5">
                      <Target className="w-3 h-3 shrink-0" /> {o.nextMilestone} · <span className="font-mono" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{o.nextDate}</span>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-stone-500">Scale</div>
                  <div className="text-lg font-bold" style={{ fontFamily: "'Fraunces', serif" }}>₹{o.scale}<span className="text-xs font-normal text-stone-500"> Cr</span></div>
                  <div className="text-[10px] text-stone-500 mt-1">{o.probability}% · ₹{w} Cr w.</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editing && <OppForm opp={editing} officials={officials} master={master} onSave={(updated) => {
        setOpps(prev => prev.find(x => x.id === updated.id) ? prev.map(x => x.id === updated.id ? updated : x) : [...prev, updated]);
        setEditing(null);
      }} onDelete={() => { setOpps(prev => prev.filter(x => x.id !== editing.id)); setEditing(null); }} onClose={() => setEditing(null)} />}
    </div>
  );
}

function OppForm({ opp, officials, master, onSave, onDelete, onClose }) {
  const [d, setD] = useState(opp);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  return (
    <Modal onClose={onClose} title={opp.project ? "Edit opportunity" : "New opportunity"}>
      <Field label="Project / Initiative"><input value={d.project} onChange={e => set("project", e.target.value)} className={inputCls} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="State"><Select value={d.state} onChange={v => set("state", v)} options={master.states} /></Field>
        <Field label="Department"><Select value={d.dept} onChange={v => set("dept", v)} options={master.departments} /></Field>
        <Field label="NPCI product"><Select value={d.product} onChange={v => set("product", v)} options={master.products} /></Field>
        <Field label="Stage"><Select value={d.stage} onChange={v => set("stage", v)} options={master.stages} /></Field>
        <Field label="Scale (₹ Cr)"><input type="number" value={d.scale} onChange={e => set("scale", Number(e.target.value))} className={inputCls} /></Field>
        <Field label="Probability %"><input type="number" min="0" max="100" value={d.probability} onChange={e => set("probability", Number(e.target.value))} className={inputCls} /></Field>
      </div>
      <Field label="Source / Signal"><textarea value={d.source} onChange={e => set("source", e.target.value)} className={textareaCls} rows="2" /></Field>
      <Field label="Next milestone"><input value={d.nextMilestone} onChange={e => set("nextMilestone", e.target.value)} className={inputCls} /></Field>
      <Field label="Next milestone date"><input type="date" value={d.nextDate} onChange={e => set("nextDate", e.target.value)} className={inputCls} /></Field>
      <Field label="Linked official">
        <Select value={d.officialId} onChange={v => set("officialId", v)} options={["", ...officials.map(o => o.id)]} display={v => v ? `${v} - ${officials.find(o => o.id === v)?.designation || "?"}` : "— none —"} />
      </Field>
      <Field label="Notes"><textarea value={d.notes} onChange={e => set("notes", e.target.value)} className={textareaCls} rows="2" /></Field>
      <FormActions onSave={() => onSave(d)} onDelete={opp.project ? onDelete : null} onClose={onClose} />
    </Modal>
  );
}

// ============================================================
// OFFICIALS
// ============================================================
function Officials({ officials, setOfficials, master }) {
  const [stateFilter, setStateFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => officials.filter(o =>
    (stateFilter === "All" || o.state === stateFilter) &&
    (!search || o.designation.toLowerCase().includes(search.toLowerCase()) || o.name.toLowerCase().includes(search.toLowerCase()) || o.dept.toLowerCase().includes(search.toLowerCase()))
  ), [officials, stateFilter, search]);

  const newOff = () => setEditing({
    id: `OFF-${String(officials.length + 1).padStart(3, "0")}`,
    state: master.states[0] || "", dept: master.departments[0] || "",
    name: "", designation: "", cadre: "", batch: "", relevance: "",
    sentiment: master.sentiments[2] || "Neutral",
    touchFreq: master.touchFreq[2]?.label || "Monthly",
    lastTouch: "", notes: ""
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Officials" subtitle={`${filtered.length} of ${officials.length} contacts`} action={{ label: "Add", onClick: newOff }} />
      <div className="flex flex-wrap gap-2">
        <Pill options={["All", ...master.states]} value={stateFilter} onChange={setStateFilter} label="State" />
        <div className="flex-1 min-w-[160px] relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, designation, dept…" className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:border-stone-400" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map(o => (
          <div key={o.id} onClick={() => setEditing(o)} className="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition cursor-pointer">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">{o.state} · {o.dept}</div>
                <h3 className="text-base font-semibold leading-tight">{o.designation}</h3>
                <div className="text-xs text-stone-500 mt-1">{o.name} · {o.cadre} {o.batch && `· ${o.batch}`}</div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded border whitespace-nowrap ${sentimentColor(o.sentiment)}`}>{o.sentiment}</span>
            </div>
            <p className="text-xs text-stone-700 mt-3 leading-relaxed">{o.relevance}</p>
            {o.lastTouch && <div className="text-[10px] text-stone-400 mt-2 font-mono" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Last touch: {o.lastTouch} · target {o.touchFreq}</div>}
          </div>
        ))}
      </div>

      {editing && <OffForm off={editing} master={master} onSave={(u) => { setOfficials(prev => prev.find(x => x.id === u.id) ? prev.map(x => x.id === u.id ? u : x) : [...prev, u]); setEditing(null); }} onDelete={() => { setOfficials(prev => prev.filter(x => x.id !== editing.id)); setEditing(null); }} onClose={() => setEditing(null)} />}
    </div>
  );
}

function OffForm({ off, master, onSave, onDelete, onClose }) {
  const [d, setD] = useState(off);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  return (
    <Modal onClose={onClose} title={off.designation ? "Edit official" : "New official"}>
      <Field label="Name"><input value={d.name} onChange={e => set("name", e.target.value)} className={inputCls} /></Field>
      <Field label="Designation"><input value={d.designation} onChange={e => set("designation", e.target.value)} className={inputCls} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="State"><Select value={d.state} onChange={v => set("state", v)} options={master.states} /></Field>
        <Field label="Department"><Select value={d.dept} onChange={v => set("dept", v)} options={master.departments} /></Field>
        <Field label="Cadre / Service"><input value={d.cadre} onChange={e => set("cadre", e.target.value)} className={inputCls} /></Field>
        <Field label="Batch"><input value={d.batch} onChange={e => set("batch", e.target.value)} className={inputCls} /></Field>
      </div>
      <Field label="NPCI relevance"><textarea value={d.relevance} onChange={e => set("relevance", e.target.value)} className={textareaCls} rows="2" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sentiment"><Select value={d.sentiment} onChange={v => set("sentiment", v)} options={master.sentiments} /></Field>
        <Field label="Touch frequency"><Select value={d.touchFreq} onChange={v => set("touchFreq", v)} options={master.touchFreq.map(f => f.label)} /></Field>
        <Field label="Last touch"><input type="date" value={d.lastTouch} onChange={e => set("lastTouch", e.target.value)} className={inputCls} /></Field>
      </div>
      <Field label="Notes"><textarea value={d.notes} onChange={e => set("notes", e.target.value)} className={textareaCls} rows="2" /></Field>
      <FormActions onSave={() => onSave(d)} onDelete={off.designation ? onDelete : null} onClose={onClose} />
    </Modal>
  );
}

// ============================================================
// CADENCE
// ============================================================
function Cadence({ officials, setOfficials, opps, master }) {
  const enriched = officials.map(o => {
    const days = daysBetween(o.lastTouch);
    const target = master.touchFreq.find(f => f.label === o.touchFreq)?.days || 30;
    let health = "On track";
    if (days === null) health = "—";
    else if (days > target * 1.5) health = "Overdue";
    else if (days > target) health = "Due";
    const activeOpps = opps.filter(p => p.officialId === o.id).length;
    return { ...o, daysSince: days, target, health, activeOpps };
  });

  const sorted = [...enriched].sort((a, b) => {
    const order = { Overdue: 0, Due: 1, "On track": 2, "—": 3 };
    return (order[a.health] || 4) - (order[b.health] || 4);
  });

  const logTouch = (id) => {
    setOfficials(prev => prev.map(o => o.id === id ? { ...o, lastTouch: todayStr() } : o));
  };

  const healthColor = (h) => ({
    Overdue: "bg-rose-100 text-rose-900 border-rose-300",
    Due: "bg-amber-100 text-amber-900 border-amber-300",
    "On track": "bg-emerald-100 text-emerald-900 border-emerald-300",
    "—": "bg-stone-100 text-stone-500 border-stone-300",
  }[h]);

  return (
    <div className="space-y-4">
      <PageHeader title="Cadence" subtitle="Touch frequency vs target. Tap to log a touchpoint." />
      <div className="space-y-2">
        {sorted.map(o => (
          <div key={o.id} className="bg-white border border-stone-200 rounded-lg p-4 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className={`text-[10px] px-2 py-0.5 rounded border ${healthColor(o.health)}`}>{o.health}</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-500">{o.state} · {o.dept}</span>
              </div>
              <div className="text-sm font-semibold truncate">{o.designation}</div>
              <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="font-mono" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{o.daysSince === null ? "no touch logged" : `${o.daysSince}d ago / ${o.target}d target`}</span>
                {o.activeOpps > 0 && <span>· {o.activeOpps} opp{o.activeOpps !== 1 ? "s" : ""}</span>}
              </div>
            </div>
            <button onClick={() => logTouch(o.id)} className="px-3 py-1.5 text-xs bg-stone-900 text-white rounded hover:bg-stone-700 whitespace-nowrap">
              Log touch
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ACTIONS
// ============================================================
function Actions({ actions, setActions, opps, officials, master }) {
  const [statusFilter, setStatusFilter] = useState("Active");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    let arr = actions;
    if (statusFilter === "Active") arr = arr.filter(a => a.status !== "Done" && a.status !== "Dropped");
    else if (statusFilter !== "All") arr = arr.filter(a => a.status === statusFilter);
    return [...arr].sort((a, b) => new Date(a.dueDate || "9999") - new Date(b.dueDate || "9999"));
  }, [actions, statusFilter]);

  const newAct = () => setEditing({
    id: `ACT-${String(actions.length + 1).padStart(3, "0")}`,
    source: "", state: master.states[0] || "", oppId: "", officialId: "",
    description: "", dueDate: "",
    priority: master.priorities[2] || "P2 - Medium",
    status: master.statuses[0] || "Open", notes: ""
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Actions" subtitle={`${filtered.length} action${filtered.length !== 1 ? "s" : ""}`} action={{ label: "Add", onClick: newAct }} />
      <Pill options={["Active", "All", ...master.statuses]} value={statusFilter} onChange={setStatusFilter} label="Status" />
      <div className="space-y-2">
        {filtered.map(a => {
          const days = a.dueDate ? Math.floor((new Date(a.dueDate) - new Date(todayStr())) / (1000 * 60 * 60 * 24)) : null;
          const overdue = days !== null && days < 0;
          return (
            <div key={a.id} onClick={() => setEditing(a)} className="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${priorityColor(a.priority)}`}>{a.priority?.split(" ")[0]}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${statusColor(a.status)}`}>{a.status}</span>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500">{a.state}</span>
                  </div>
                  <div className="text-sm font-medium leading-snug">{a.description}</div>
                  {a.notes && <div className="text-xs text-stone-500 mt-1.5">{a.notes}</div>}
                </div>
                <div className="text-right shrink-0">
                  {a.dueDate && (
                    <>
                      <div className="text-[10px] text-stone-500">Due</div>
                      <div className={`text-sm font-mono ${overdue ? "text-rose-700 font-semibold" : "text-stone-900"}`} style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{a.dueDate}</div>
                      <div className={`text-[10px] mt-0.5 ${overdue ? "text-rose-600" : days <= 3 ? "text-amber-600" : "text-stone-500"}`}>{days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "today" : `in ${days}d`}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {editing && <ActForm act={editing} opps={opps} officials={officials} master={master} onSave={(u) => { setActions(prev => prev.find(x => x.id === u.id) ? prev.map(x => x.id === u.id ? u : x) : [...prev, u]); setEditing(null); }} onDelete={() => { setActions(prev => prev.filter(x => x.id !== editing.id)); setEditing(null); }} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ActForm({ act, opps, officials, master, onSave, onDelete, onClose }) {
  const [d, setD] = useState(act);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  return (
    <Modal onClose={onClose} title={act.description ? "Edit action" : "New action"}>
      <Field label="Description"><textarea value={d.description} onChange={e => set("description", e.target.value)} className={textareaCls} rows="2" /></Field>
      <Field label="Source / trigger"><input value={d.source} onChange={e => set("source", e.target.value)} className={inputCls} placeholder="Meeting or trigger that created this action" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="State"><Select value={d.state} onChange={v => set("state", v)} options={master.states} /></Field>
        <Field label="Due date"><input type="date" value={d.dueDate} onChange={e => set("dueDate", e.target.value)} className={inputCls} /></Field>
        <Field label="Priority"><Select value={d.priority} onChange={v => set("priority", v)} options={master.priorities} /></Field>
        <Field label="Status"><Select value={d.status} onChange={v => set("status", v)} options={master.statuses} /></Field>
      </div>
      <Field label="Linked opportunity">
        <Select value={d.oppId} onChange={v => set("oppId", v)} options={["", ...opps.map(o => o.id)]} display={v => v ? `${v} - ${opps.find(o => o.id === v)?.project || "?"}` : "— none —"} />
      </Field>
      <Field label="Linked official">
        <Select value={d.officialId} onChange={v => set("officialId", v)} options={["", ...officials.map(o => o.id)]} display={v => v ? `${v} - ${officials.find(o => o.id === v)?.designation || "?"}` : "— none —"} />
      </Field>
      <Field label="Notes"><textarea value={d.notes} onChange={e => set("notes", e.target.value)} className={textareaCls} rows="2" /></Field>
      <FormActions onSave={() => onSave(d)} onDelete={act.description ? onDelete : null} onClose={onClose} />
    </Modal>
  );
}

// ============================================================
// MEETINGS
// ============================================================
function Meetings({ meetings, setMeetings, officials, states }) {
  const [editing, setEditing] = useState(null);

  const newMeeting = () => {
    const off = officials[0];
    const stateProfile = states.find(s => s.name === off?.state);
    setEditing({
      id: `MTG-${Date.now()}`,
      date: todayStr(), time: "", venue: "", officialId: off?.id || "",
      attendeesNpci: "", attendeesGovt: "", agenda: "", outcome: "",
      stateContext: stateProfile?.priorities || "",
      footprint: stateProfile?.footprint || "",
      whitespace: stateProfile?.whitespace || "",
      talkingPoints: "1. Open with state-specific data point\n2. Anchor on department's stated priority\n3. Position 1-2 NPCI products with case study from peer state\n4. Close with a specific, low-friction ask",
      objections: "Existing vendor lock-in → Show NCMC interoperability path; phased migration\nBudget not provisioned → Pilot scope at low capex; multilateral co-finance\nReconciliation complexity → NPCI-managed settlement T+1; RBI-regulated rails\nCitizen behavior → Cite adoption from peer city; joint awareness campaign",
      caseStudies: "", ask: "", fallback: "", leaveBehind: "", postMeeting: "",
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Meeting Prep" subtitle={`${meetings.length} brief${meetings.length !== 1 ? "s" : ""} saved`} action={{ label: "New brief", onClick: newMeeting }} />
      {meetings.length === 0 && (
        <div className="bg-white border border-dashed border-stone-300 rounded-lg p-8 text-center">
          <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-500">No meeting briefs saved yet.</p>
          <p className="text-xs text-stone-400 mt-1">Tap "New brief" to start one.</p>
        </div>
      )}
      <div className="space-y-2">
        {[...meetings].sort((a, b) => new Date(b.date) - new Date(a.date)).map(m => {
          const off = officials.find(o => o.id === m.officialId);
          return (
            <div key={m.id} onClick={() => setEditing(m)} className="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1 font-mono" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{m.date} {m.time}</div>
                  <h3 className="text-sm font-semibold leading-snug">{off?.designation || "Meeting"}</h3>
                  {off && <div className="text-xs text-stone-500 mt-0.5">{off.state} · {off.dept}</div>}
                  {m.agenda && <p className="text-xs text-stone-700 mt-2 line-clamp-2">{m.agenda}</p>}
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
      {editing && <MeetingForm meeting={editing} officials={officials} states={states} onSave={(u) => { setMeetings(prev => prev.find(x => x.id === u.id) ? prev.map(x => x.id === u.id ? u : x) : [...prev, u]); setEditing(null); }} onDelete={() => { setMeetings(prev => prev.filter(x => x.id !== editing.id)); setEditing(null); }} onClose={() => setEditing(null)} />}
    </div>
  );
}

function MeetingForm({ meeting, officials, states, onSave, onDelete, onClose }) {
  const [d, setD] = useState(meeting);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const onOfficialChange = (id) => {
    const off = officials.find(o => o.id === id);
    const sp = states.find(s => s.name === off?.state);
    setD(prev => ({
      ...prev, officialId: id,
      stateContext: prev.stateContext || sp?.priorities || "",
      footprint: prev.footprint || sp?.footprint || "",
      whitespace: prev.whitespace || sp?.whitespace || "",
    }));
  };
  return (
    <Modal onClose={onClose} title="Meeting brief" wide>
      <SectionHead>1 · Context</SectionHead>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date"><input type="date" value={d.date} onChange={e => set("date", e.target.value)} className={inputCls} /></Field>
        <Field label="Time"><input value={d.time} onChange={e => set("time", e.target.value)} className={inputCls} placeholder="e.g. 11:30 AM" /></Field>
      </div>
      <Field label="Venue / Mode"><input value={d.venue} onChange={e => set("venue", e.target.value)} className={inputCls} /></Field>
      <Field label="Official">
        <Select value={d.officialId} onChange={onOfficialChange} options={officials.map(o => o.id)} display={v => { const o = officials.find(x => x.id === v); return o ? `${o.designation} (${o.state})` : v; }} />
      </Field>
      <Field label="Attendees - NPCI side"><textarea value={d.attendeesNpci} onChange={e => set("attendeesNpci", e.target.value)} className={textareaCls} rows="2" /></Field>
      <Field label="Attendees - Govt side"><textarea value={d.attendeesGovt} onChange={e => set("attendeesGovt", e.target.value)} className={textareaCls} rows="2" /></Field>
      <Field label="Agenda summary"><textarea value={d.agenda} onChange={e => set("agenda", e.target.value)} className={textareaCls} rows="2" /></Field>
      <Field label="Desired outcome"><textarea value={d.outcome} onChange={e => set("outcome", e.target.value)} className={textareaCls} rows="2" /></Field>

      <SectionHead>2 · State context (auto-pulled)</SectionHead>
      <Field label="Departmental priorities"><textarea value={d.stateContext} onChange={e => set("stateContext", e.target.value)} className={textareaCls} rows="2" /></Field>
      <Field label="Existing NPCI footprint"><textarea value={d.footprint} onChange={e => set("footprint", e.target.value)} className={textareaCls} rows="2" /></Field>
      <Field label="Whitespace we are targeting"><textarea value={d.whitespace} onChange={e => set("whitespace", e.target.value)} className={textareaCls} rows="2" /></Field>

      <SectionHead>3 · Talking points</SectionHead>
      <Field label="In order of priority"><textarea value={d.talkingPoints} onChange={e => set("talkingPoints", e.target.value)} className={textareaCls} rows="6" /></Field>

      <SectionHead>4 · Anticipated objections & responses</SectionHead>
      <Field label="One per line: Objection → Response"><textarea value={d.objections} onChange={e => set("objections", e.target.value)} className={textareaCls} rows="6" /></Field>

      <SectionHead>5 · Case studies to reference</SectionHead>
      <Field label="Pull from Case Studies tab"><textarea value={d.caseStudies} onChange={e => set("caseStudies", e.target.value)} className={textareaCls} rows="3" /></Field>

      <SectionHead>6 · The ask</SectionHead>
      <Field label="Primary ask"><textarea value={d.ask} onChange={e => set("ask", e.target.value)} className={textareaCls} rows="2" /></Field>
      <Field label="Fallback ask"><textarea value={d.fallback} onChange={e => set("fallback", e.target.value)} className={textareaCls} rows="2" /></Field>
      <Field label="Leave-behind"><textarea value={d.leaveBehind} onChange={e => set("leaveBehind", e.target.value)} className={textareaCls} rows="2" /></Field>

      <SectionHead>7 · Post-meeting (fill within 24h)</SectionHead>
      <Field label="What was agreed, new objections, sentiment shift, action items"><textarea value={d.postMeeting} onChange={e => set("postMeeting", e.target.value)} className={textareaCls} rows="4" /></Field>

      <FormActions onSave={() => onSave(d)} onDelete={onDelete} onClose={onClose} />
    </Modal>
  );
}

// ============================================================
// CASES
// ============================================================
function Cases({ cases, setCases, master }) {
  const [productFilter, setProductFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const filtered = cases.filter(c =>
    (productFilter === "All" || c.product === productFilter) &&
    (!search || c.project.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase()))
  );

  const newCase = () => setEditing({
    id: `CS-${String(cases.length + 1).padStart(3, "0")}`,
    state: "", project: "", dept: "",
    product: master.products[0] || "",
    year: new Date().getFullYear(),
    scale: "", outcomes: "", whatWorked: "", watchOut: ""
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Case Studies" subtitle={`${filtered.length} of ${cases.length}`} action={{ label: "Add", onClick: newCase }} />
      <div className="flex flex-wrap gap-2">
        <Pill options={["All", ...master.products]} value={productFilter} onChange={setProductFilter} label="Product" />
        <div className="flex-1 min-w-[160px] relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Project or state…" className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:border-stone-400" />
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} onClick={() => setEditing(c)} className="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 cursor-pointer">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="px-2 py-0.5 bg-stone-900 text-white text-[10px] rounded">{c.product}</span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500">{c.state} · {c.year}</span>
                </div>
                <h3 className="text-base font-semibold leading-snug">{c.project}</h3>
                <div className="text-xs text-stone-500 mt-0.5">{c.dept} · {c.scale}</div>
                <p className="text-xs text-stone-700 mt-2 leading-relaxed">{c.outcomes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && <CaseForm cs={editing} master={master} onSave={(u) => { setCases(prev => prev.find(x => x.id === u.id) ? prev.map(x => x.id === u.id ? u : x) : [...prev, u]); setEditing(null); }} onDelete={() => { setCases(prev => prev.filter(x => x.id !== editing.id)); setEditing(null); }} onClose={() => setEditing(null)} />}
    </div>
  );
}

function CaseForm({ cs, master, onSave, onDelete, onClose }) {
  const [d, setD] = useState(cs);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  return (
    <Modal onClose={onClose} title={cs.project ? "Edit case study" : "New case study"}>
      <Field label="Project name"><input value={d.project} onChange={e => set("project", e.target.value)} className={inputCls} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="State"><input value={d.state} onChange={e => set("state", e.target.value)} className={inputCls} /></Field>
        <Field label="Department / Owner"><input value={d.dept} onChange={e => set("dept", e.target.value)} className={inputCls} /></Field>
        <Field label="Product"><Select value={d.product} onChange={v => set("product", v)} options={master.products} /></Field>
        <Field label="Year live"><input type="number" value={d.year} onChange={e => set("year", Number(e.target.value))} className={inputCls} /></Field>
      </div>
      <Field label="Scale (txn/yr or users)"><input value={d.scale} onChange={e => set("scale", e.target.value)} className={inputCls} /></Field>
      <Field label="Key outcomes"><textarea value={d.outcomes} onChange={e => set("outcomes", e.target.value)} className={textareaCls} rows="3" /></Field>
      <Field label="What worked"><textarea value={d.whatWorked} onChange={e => set("whatWorked", e.target.value)} className={textareaCls} rows="2" /></Field>
      <Field label="What to watch out for"><textarea value={d.watchOut} onChange={e => set("watchOut", e.target.value)} className={textareaCls} rows="2" /></Field>
      <FormActions onSave={() => onSave(d)} onDelete={cs.project ? onDelete : null} onClose={onClose} />
    </Modal>
  );
}

// ============================================================
// STATES
// ============================================================
function StatesView({ states, setStates }) {
  const [editing, setEditing] = useState(null);
  const newState = () => setEditing({
    id: `ST-${Date.now()}`, name: "", capital: "", priorities: "",
    initiatives: "", footprint: "", whitespace: "", lead: "", budget: ""
  });
  return (
    <div className="space-y-4">
      <PageHeader title="State Profiles" subtitle="Refresh quarterly. The Meeting Prep brief auto-pulls from here." action={{ label: "Add state", onClick: newState }} />
      <div className="space-y-3">
        {states.map(s => (
          <div key={s.id} onClick={() => setEditing(s)} className="bg-white border border-stone-200 rounded-lg p-5 hover:border-stone-300 cursor-pointer">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>{s.name}</h3>
                <div className="text-xs text-stone-500 mt-0.5">{s.capital} · FY budget ₹{s.budget} Cr · Lead: {s.lead}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div><div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Priorities</div><p className="text-stone-700 leading-relaxed">{s.priorities}</p></div>
              <div><div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Initiatives</div><p className="text-stone-700 leading-relaxed">{s.initiatives}</p></div>
              <div><div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">NPCI footprint</div><p className="text-stone-700 leading-relaxed">{s.footprint}</p></div>
              <div><div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Whitespace</div><p className="text-stone-700 leading-relaxed">{s.whitespace}</p></div>
            </div>
          </div>
        ))}
      </div>
      {editing && <StateForm st={editing} onSave={(u) => { setStates(prev => prev.find(x => x.id === u.id) ? prev.map(x => x.id === u.id ? u : x) : [...prev, u]); setEditing(null); }} onDelete={() => { setStates(prev => prev.filter(x => x.id !== editing.id)); setEditing(null); }} onClose={() => setEditing(null)} />}
    </div>
  );
}

function StateForm({ st, onSave, onDelete, onClose }) {
  const [d, setD] = useState(st);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  return (
    <Modal onClose={onClose} title={st.name ? `Edit ${st.name}` : "New state"}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name"><input value={d.name} onChange={e => set("name", e.target.value)} className={inputCls} /></Field>
        <Field label="Capital"><input value={d.capital} onChange={e => set("capital", e.target.value)} className={inputCls} /></Field>
        <Field label="Lead Dept"><input value={d.lead} onChange={e => set("lead", e.target.value)} className={inputCls} /></Field>
        <Field label="FY Budget (₹ Cr)"><input value={d.budget} onChange={e => set("budget", e.target.value)} className={inputCls} /></Field>
      </div>
      <Field label="Top departmental priorities"><textarea value={d.priorities} onChange={e => set("priorities", e.target.value)} className={textareaCls} rows="3" /></Field>
      <Field label="Active flagship initiatives"><textarea value={d.initiatives} onChange={e => set("initiatives", e.target.value)} className={textareaCls} rows="3" /></Field>
      <Field label="NPCI footprint today"><textarea value={d.footprint} onChange={e => set("footprint", e.target.value)} className={textareaCls} rows="3" /></Field>
      <Field label="Whitespace / gaps"><textarea value={d.whitespace} onChange={e => set("whitespace", e.target.value)} className={textareaCls} rows="3" /></Field>
      <FormActions onSave={() => onSave(d)} onDelete={st.name ? onDelete : null} onClose={onClose} />
    </Modal>
  );
}

// ============================================================
// FIT MATRIX
// ============================================================
function FitMatrix({ master }) {
  // Built-in fit map for the standard products. If user adds custom products they show empty cells (still useful as a reference grid).
  const productsX = master.products.filter(p => p !== "Multiple").slice(0, 8);
  const dept = [
    "Transport (RTO / fines)", "Metro / Bus AFC", "Treasury (collections)", "Welfare / DBT",
    "Municipal (tax / utility)", "e-Governance", "Smart City SPV", "Health", "Education", "Food / PDS"
  ];
  const fit = {
    "UPI|Transport (RTO / fines)": "H", "UPI|Metro / Bus AFC": "M", "UPI|Treasury (collections)": "H",
    "UPI|Welfare / DBT": "M", "UPI|Municipal (tax / utility)": "H", "UPI|e-Governance": "H",
    "UPI|Smart City SPV": "H", "UPI|Health": "H", "UPI|Education": "H",
    "NCMC|Metro / Bus AFC": "H", "NCMC|Smart City SPV": "H", "NCMC|Transport (RTO / fines)": "L",
    "RuPay|Treasury (collections)": "M", "RuPay|Welfare / DBT": "H", "RuPay|Health": "M", "RuPay|Education": "M",
    "AePS|Welfare / DBT": "H", "AePS|Food / PDS": "H", "AePS|Treasury (collections)": "L",
    "BBPS|Municipal (tax / utility)": "H", "BBPS|Treasury (collections)": "H", "BBPS|Education": "M", "BBPS|Health": "M",
    "FASTag|Transport (RTO / fines)": "H", "FASTag|Smart City SPV": "H",
    "Bharat Connect|Treasury (collections)": "H", "Bharat Connect|Municipal (tax / utility)": "M",
  };
  const cell = (p, d) => {
    const v = fit[`${p}|${d}`];
    if (v === "H") return <span className="block w-full h-full bg-emerald-200 text-emerald-900 text-center py-1.5 text-xs font-bold rounded">H</span>;
    if (v === "M") return <span className="block w-full h-full bg-amber-200 text-amber-900 text-center py-1.5 text-xs font-bold rounded">M</span>;
    if (v === "L") return <span className="block w-full h-full bg-stone-100 text-stone-500 text-center py-1.5 text-xs rounded">L</span>;
    return <span className="block py-1.5 text-stone-300 text-center text-xs">·</span>;
  };
  return (
    <div className="space-y-4">
      <PageHeader title="Product Fit Matrix" subtitle="NPCI products mapped to department use-cases. H = lead with this. M = secondary. L = not the primary fit." />
      <div className="bg-white border border-stone-200 rounded-lg p-3 overflow-x-auto">
        <table className="w-full min-w-[600px] border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-stone-500 px-2"></th>
              {productsX.map(p => <th key={p} className="text-xs font-semibold text-stone-700 px-1 pb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {dept.map(d => (
              <tr key={d}>
                <td className="text-xs text-stone-700 pr-2 py-1 whitespace-nowrap">{d}</td>
                {productsX.map(p => <td key={p} className="px-0">{cell(p, d)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// SETTINGS — master list editor
// ============================================================
function Settings({ master, setMaster }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Settings" subtitle="Edit master lists. Changes apply everywhere immediately." />

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900">
        <strong>Tip:</strong> If you delete a value that is already used somewhere (e.g. a product on an existing opportunity), the existing entry will keep its original value but the dropdown will no longer offer it for new entries. Use Export JSON before big edits to keep a backup.
      </div>

      <ListEditor
        title="Products"
        description="NPCI products / payment rails available for opportunity tagging."
        items={master.products}
        onChange={items => setMaster(m => ({ ...m, products: items }))}
      />
      <ListEditor
        title="States"
        description="States in your portfolio. Used in filters and forms."
        items={master.states}
        onChange={items => setMaster(m => ({ ...m, states: items }))}
      />
      <ListEditor
        title="Departments"
        description="State government departments / agencies."
        items={master.departments}
        onChange={items => setMaster(m => ({ ...m, departments: items }))}
      />
      <ListEditor
        title="Pipeline Stages"
        description="Stages an opportunity moves through. Order matters: arrange from earliest to latest."
        items={master.stages}
        onChange={items => setMaster(m => ({ ...m, stages: items }))}
        ordered
      />
      <ListEditor
        title="Sentiment levels"
        description="How an official feels about NPCI's pitch."
        items={master.sentiments}
        onChange={items => setMaster(m => ({ ...m, sentiments: items }))}
      />
      <ListEditor
        title="Action priorities"
        description="Priority labels for action items."
        items={master.priorities}
        onChange={items => setMaster(m => ({ ...m, priorities: items }))}
      />
      <ListEditor
        title="Action statuses"
        description="Status labels for action items."
        items={master.statuses}
        onChange={items => setMaster(m => ({ ...m, statuses: items }))}
      />
      <FreqEditor
        items={master.touchFreq}
        onChange={items => setMaster(m => ({ ...m, touchFreq: items }))}
      />
    </div>
  );
}

function ListEditor({ title, description, items, onChange, ordered }) {
  const [draft, setDraft] = useState("");
  const [editingIdx, setEditingIdx] = useState(-1);
  const [editVal, setEditVal] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (items.includes(v)) { alert(`"${v}" already exists.`); return; }
    onChange([...items, v]);
    setDraft("");
  };

  const remove = (idx) => {
    if (!confirm(`Remove "${items[idx]}"?`)) return;
    onChange(items.filter((_, i) => i !== idx));
  };

  const move = (idx, dir) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= items.length) return;
    const arr = [...items];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    onChange(arr);
  };

  const startEdit = (idx) => { setEditingIdx(idx); setEditVal(items[idx]); };
  const saveEdit = () => {
    const v = editVal.trim();
    if (!v) return;
    if (items.includes(v) && items[editingIdx] !== v) { alert(`"${v}" already exists.`); return; }
    onChange(items.map((it, i) => i === editingIdx ? v : it));
    setEditingIdx(-1); setEditVal("");
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg">
      <div className="px-4 py-3 border-b border-stone-200">
        <h3 className="text-sm font-semibold tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>{title}</h3>
        {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
      </div>
      <div className="p-4">
        <div className="space-y-1.5 mb-3">
          {items.map((item, idx) => (
            <div key={`${item}-${idx}`} className="flex items-center gap-2 group">
              {ordered && (
                <span className="text-[10px] text-stone-400 w-5 font-mono" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{idx + 1}.</span>
              )}
              {editingIdx === idx ? (
                <>
                  <input value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEdit()} className="flex-1 px-2 py-1 text-sm border border-stone-300 rounded bg-white" autoFocus />
                  <button onClick={saveEdit} className="text-xs text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded">Save</button>
                  <button onClick={() => setEditingIdx(-1)} className="text-xs text-stone-500 hover:bg-stone-100 px-2 py-1 rounded">Cancel</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-stone-800 cursor-pointer hover:text-stone-900" onClick={() => startEdit(idx)}>{item}</span>
                  {ordered && (
                    <>
                      <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-stone-400 hover:text-stone-700 disabled:opacity-20 px-1 text-xs">↑</button>
                      <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="text-stone-400 hover:text-stone-700 disabled:opacity-20 px-1 text-xs">↓</button>
                    </>
                  )}
                  <button onClick={() => remove(idx)} className="text-stone-400 hover:text-rose-600 p-1" aria-label={`Remove ${item}`}><X className="w-3.5 h-3.5" /></button>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-3 border-t border-stone-100">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            placeholder={`Add ${title.toLowerCase()}…`}
            className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:border-stone-400"
          />
          <button onClick={add} className="px-3 py-2 text-sm bg-stone-900 text-white rounded hover:bg-stone-700 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

function FreqEditor({ items, onChange }) {
  const [label, setLabel] = useState("");
  const [days, setDays] = useState(30);

  const add = () => {
    const v = label.trim();
    if (!v) return;
    if (items.find(i => i.label === v)) { alert(`"${v}" already exists.`); return; }
    if (days < 1) { alert("Days must be at least 1."); return; }
    onChange([...items, { label: v, days: Number(days) }]);
    setLabel(""); setDays(30);
  };

  const remove = (idx) => {
    if (!confirm(`Remove "${items[idx].label}"?`)) return;
    onChange(items.filter((_, i) => i !== idx));
  };

  const updateDays = (idx, newDays) => {
    onChange(items.map((it, i) => i === idx ? { ...it, days: Number(newDays) || 1 } : it));
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg">
      <div className="px-4 py-3 border-b border-stone-200">
        <h3 className="text-sm font-semibold tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>Touch frequencies</h3>
        <p className="text-xs text-stone-500 mt-0.5">How often you should touch base with each official. The "days" value drives the Cadence health calculation.</p>
      </div>
      <div className="p-4">
        <div className="space-y-1.5 mb-3">
          {items.map((it, idx) => (
            <div key={it.label} className="flex items-center gap-2">
              <span className="flex-1 text-sm text-stone-800">{it.label}</span>
              <input
                type="number"
                min="1"
                value={it.days}
                onChange={e => updateDays(idx, e.target.value)}
                className="w-20 px-2 py-1 text-sm border border-stone-200 rounded text-right font-mono"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              />
              <span className="text-xs text-stone-500 w-10">days</span>
              <button onClick={() => remove(idx)} className="text-stone-400 hover:text-rose-600 p-1"><X className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-3 border-t border-stone-100">
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (e.g. Fortnightly)" className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:border-stone-400" />
          <input type="number" min="1" value={days} onChange={e => setDays(e.target.value)} className="w-20 px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:border-stone-400 font-mono" style={{ fontFamily: "'IBM Plex Mono', monospace" }} />
          <button onClick={add} className="px-3 py-2 text-sm bg-stone-900 text-white rounded hover:bg-stone-700 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
const inputCls = "w-full px-3 py-2 text-sm border border-stone-200 rounded bg-white focus:outline-none focus:border-stone-500";
const textareaCls = inputCls + " resize-none";

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="hidden md:flex items-end justify-between border-b border-stone-200 pb-4 mb-2">
      <div>
        <h1 className="text-3xl font-bold leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>{title}</h1>
        {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
      </div>
      {action && (
        <button onClick={action.onClick} className="px-4 py-2 bg-stone-900 text-white text-sm rounded hover:bg-stone-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> {action.label}
        </button>
      )}
    </div>
  );
}

function Pill({ options, value, onChange, label }) {
  return (
    <div className="inline-flex items-center bg-white border border-stone-200 rounded">
      <span className="text-[10px] uppercase tracking-wider text-stone-500 px-2.5">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-transparent text-sm py-2 pr-7 pl-1 border-l border-stone-200 focus:outline-none">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// Select that gracefully includes legacy values (values not currently in master list)
function Select({ value, onChange, options, display }) {
  const allOptions = (value !== undefined && value !== null && value !== "" && !options.includes(value))
    ? [value, ...options]
    : options;
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={inputCls + " cursor-pointer"}>
      {allOptions.map(o => <option key={o} value={o}>{display ? display(o) : o}</option>)}
    </select>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

function SectionHead({ children }) {
  return <h4 className="text-xs uppercase tracking-[0.2em] text-stone-500 mt-5 mb-3 pb-1.5 border-b border-stone-200">{children}</h4>;
}

function Modal({ children, onClose, title, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-stone-900/50" onClick={onClose} />
      <div className={`relative bg-white rounded-t-xl md:rounded-lg shadow-xl w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[92vh] overflow-hidden flex flex-col`}>
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Fraunces', serif" }}>{title}</h2>
          <button onClick={onClose} className="p-1 -mr-1 hover:bg-stone-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto p-5 flex-1">{children}</div>
      </div>
    </div>
  );
}

function FormActions({ onSave, onDelete, onClose }) {
  return (
    <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-stone-200 sticky bottom-0 bg-white">
      <div>
        {onDelete && (
          <button onClick={() => { if (confirm("Delete this entry?")) onDelete(); }} className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded">Cancel</button>
        <button onClick={onSave} className="px-4 py-2 text-sm bg-stone-900 text-white rounded hover:bg-stone-700 flex items-center gap-1.5">
          <Save className="w-3.5 h-3.5" /> Save
        </button>
      </div>
    </div>
  );
}
