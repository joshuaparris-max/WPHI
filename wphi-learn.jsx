import React, { useState, useEffect, useCallback } from "react";

const COLORS = {
  ink: "#241F19",
  inkSoft: "#4A4038",
  page: "#EDE6D2",
  card: "#FBF8EF",
  border: "#D9CFB2",
  rust: "#A8452F",
  rustDeep: "#7A3120",
  olive: "#4B5D3A",
  oliveDeep: "#33421F",
  gold: "#B9862E",
  goldDeep: "#7A5717",
};

const STAGES = ["Not started", "Lesson viewed", "Quiz passed", "Evidence submitted", "Signed off"];

const UNITS = [
  { code: "AHCWHS302", title: "Contribute to workplace health and safety processes", type: "core", term: 1,
    blurb: "Hazard identification, safe work method statements, PPE selection, and incident reporting for a horticulture worksite.",
    video: "WHS induction walkthrough — Dubbo Training Campus",
    quiz: [
      { q: "Who is responsible for reporting a near miss?", options: ["Only the supervisor", "Any worker who witnesses it", "Only the WHS officer"], answer: 1 },
      { q: "A Safe Work Method Statement is required for:", options: ["Every single task, no exceptions", "High-risk construction work", "Only chemical spraying"], answer: 1 },
    ] },
  { code: "AHCWRK320", title: "Apply environmentally sustainable work practices", type: "core", term: 1,
    blurb: "Water and energy efficiency, waste minimisation, and choosing low-impact horticultural practices.",
    video: "Sustainable practice case studies — regional parks",
    quiz: [
      { q: "Which is a water-efficient irrigation choice?", options: ["Overhead sprinklers at midday", "Drip irrigation with mulch", "Hand watering with a hose"], answer: 1 },
    ] },
  { code: "AHCPCM308", title: "Identify and select plants", type: "core", term: 1,
    blurb: "Botanical naming, plant identification keys, and matching species to site conditions and client briefs.",
    video: "Plant ID field walk — native and exotic species",
    quiz: [
      { q: "In binomial nomenclature, the second word denotes the:", options: ["Genus", "Species", "Family"], answer: 1 },
    ] },
  { code: "AHCSOL304", title: "Implement soil improvements for garden and turf areas", type: "core", term: 1,
    blurb: "Soil texture and structure, pH testing, amendments, and building an improvement plan for a site.",
    video: "Soil pH and EC testing demonstration",
    quiz: [
      { q: "A soil pH of 5.5 is considered:", options: ["Strongly alkaline", "Neutral", "Acidic"], answer: 2 },
    ] },
  { code: "AHCPCM305", title: "Implement a plant nutrition program", type: "elective", term: 1,
    blurb: "Reading deficiency symptoms, fertiliser types and rates, and scheduling a nutrition program.",
    video: "Nutrient deficiency identification guide",
    quiz: [
      { q: "Yellowing between leaf veins on older leaves often signals a deficiency in:", options: ["Nitrogen", "Magnesium", "Potassium"], answer: 1 },
    ] },
  { code: "AHCPGD307", title: "Implement a plant establishment program", type: "elective", term: 2,
    blurb: "Site preparation, planting technique, staking, and the aftercare schedule that gets new plantings through establishment.",
    video: "Planting technique — bare-root vs container stock",
    quiz: [
      { q: "The main purpose of mulch after planting is to:", options: ["Add colour", "Retain moisture and suppress weeds", "Replace fertiliser"], answer: 1 },
    ] },
  { code: "AHCNSY313", title: "Implement a propagation plan", type: "elective", term: 2,
    blurb: "Propagation by seed, cutting and division, including nursery hygiene and the propagation greenhouse routine.",
    video: "Cutting propagation — hormone and media choice",
    quiz: [
      { q: "Semi-hardwood cuttings are typically taken:", options: ["Late autumn to winter", "Summer to early autumn", "Mid-winter only"], answer: 1 },
    ] },
  { code: "AHCPMG301", title: "Control weeds", type: "core", term: 2,
    blurb: "Weed identification, control method selection, and reporting under an integrated weed management plan.",
    video: "Weed ID walkthrough — common regional species",
    quiz: [
      { q: "Which control method has no chemical component?", options: ["Mulching and hand removal", "Foliar herbicide", "Soil-applied residual herbicide"], answer: 0 },
    ] },
  { code: "AHCBIO303", title: "Apply biosecurity measures", type: "elective", term: 2,
    blurb: "Recognising biosecurity risks, decontamination procedures, and reporting obligations for pests and diseases of concern.",
    video: "Come clean, go clean — biosecurity procedure",
    quiz: [
      { q: "Tools should be decontaminated between sites mainly to prevent:", options: ["Rust", "Spread of pests and pathogens", "Warranty voiding"], answer: 1 },
    ] },
  { code: "AHCPMG302", title: "Control plant pests, diseases and disorders", type: "core", term: 3,
    blurb: "Diagnosing pest and disease symptoms, and selecting IPM-based control responses.",
    video: "IPM decision framework for common pests",
    quiz: [
      { q: "IPM stands for:", options: ["Integrated Pest Management", "Instant Pest Mitigation", "Industry Plant Monitoring"], answer: 0 },
    ] },
  { code: "AHCCHM304", title: "Transport and store chemicals", type: "core", term: 3,
    blurb: "Chemical labelling, SDS interpretation, compatible storage, and safe transport requirements.",
    video: "Chemical store walkthrough and SDS lookup",
    quiz: [
      { q: "Before using any chemical you should always check the:", options: ["Product colour", "Safety Data Sheet", "Supplier's website reviews"], answer: 1 },
    ] },
  { code: "AHCCHM307", title: "Prepare and apply chemicals to control pests, weeds and diseases", type: "core", term: 3,
    blurb: "Calculating mix rates, calibrating equipment, and applying chemicals safely and within label directions.",
    video: "Backpack sprayer calibration demonstration",
    quiz: [
      { q: "Label directions on a registered chemical are:", options: ["A suggestion", "Legally binding", "Only for reference"], answer: 1 },
    ] },
  { code: "AHCIRG346", title: "Operate pressurised irrigation systems", type: "core", term: 3,
    blurb: "Irrigation system components, scheduling, and safe start-up and shutdown procedures.",
    video: "Dripline and sprinkler system walkthrough",
    quiz: [
      { q: "A pressure-compensating dripper is designed to:", options: ["Increase flow on slopes", "Deliver even flow despite pressure changes", "Filter sediment"], answer: 1 },
    ] },
  { code: "AHCIRG337", title: "Measure irrigation delivery system performance", type: "elective", term: 3,
    blurb: "Catch-can testing, distribution uniformity, and identifying underperforming zones.",
    video: "Catch-can uniformity test, step by step",
    quiz: [
      { q: "A catch-can test primarily measures:", options: ["Water pH", "Distribution uniformity", "Soil compaction"], answer: 1 },
    ] },
  { code: "AHCMOM304", title: "Operate machinery and equipment", type: "core", term: 4,
    blurb: "Pre-start checks, safe operation, and shutdown procedures for ride-on mowers, brushcutters and small machinery.",
    video: "Ride-on mower pre-start and operation",
    quiz: [
      { q: "A pre-start check should be done:", options: ["Once a week", "Before every use", "Only after servicing"], answer: 1 },
    ] },
  { code: "AHCPGD309", title: "Perform specialist amenity pruning", type: "core", term: 4,
    blurb: "Pruning objectives, cut placement, tool selection, and timing for amenity trees and shrubs.",
    video: "Correct pruning cut placement, demonstrated",
    quiz: [
      { q: "A pruning cut should generally be made:", options: ["Flush with the trunk", "Just outside the branch collar", "As close to the bud as possible, cutting into it"], answer: 1 },
    ] },
  { code: "AHCPGD310", title: "Implement a landscape maintenance program", type: "elective", term: 4,
    blurb: "Scheduling recurring maintenance tasks across a site and adjusting the program seasonally.",
    video: "Seasonal maintenance calendar walkthrough",
    quiz: [
      { q: "A landscape maintenance program should mainly be adjusted for:", options: ["Client mood", "Season and plant growth stage", "Staff availability only"], answer: 1 },
    ] },
];

const TERMS = [1, 2, 3, 4];

function loadAll(setProgress, setEvidence, setFeedback) {
  Promise.all([
    window.storage.get("wphi-progress").catch(() => null),
    window.storage.get("wphi-evidence").catch(() => null),
    window.storage.get("wphi-feedback").catch(() => null),
  ]).then(([p, e, f]) => {
    if (p) try { setProgress(JSON.parse(p.value)); } catch {}
    if (e) try { setEvidence(JSON.parse(e.value)); } catch {}
    if (f) try { setFeedback(JSON.parse(f.value)); } catch {}
  });
}

export default function WPHILearn() {
  const [role, setRole] = useState("student");
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState({});
  const [evidence, setEvidence] = useState({});
  const [feedback, setFeedback] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [evidenceDraft, setEvidenceDraft] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState("");

  useEffect(() => { loadAll(setProgress, setEvidence, setFeedback); }, []);

  const persist = useCallback((key, value) => {
    window.storage.set(key, JSON.stringify(value)).catch(() => {});
  }, []);

  const stageOf = (code) => progress[code] || 0;

  const setStage = (code, stage) => {
    const next = { ...progress, [code]: Math.max(progress[code] || 0, stage) };
    setProgress(next);
    persist("wphi-progress", next);
  };

  const openUnit = (unit) => {
    setSelected(unit);
    setQuizAnswers({});
    setQuizResult(null);
    setEvidenceDraft(evidence[unit.code] || "");
    setFeedbackDraft(feedback[unit.code] || "");
  };

  const submitQuiz = () => {
    const total = selected.quiz.length;
    let correct = 0;
    selected.quiz.forEach((q, i) => { if (quizAnswers[i] === q.answer) correct += 1; });
    setQuizResult({ correct, total });
    if (correct === total) setStage(selected.code, Math.max(2, stageOf(selected.code)));
  };

  const submitEvidence = () => {
    if (!evidenceDraft.trim()) return;
    const next = { ...evidence, [selected.code]: evidenceDraft.trim() };
    setEvidence(next);
    persist("wphi-evidence", next);
    setStage(selected.code, Math.max(3, stageOf(selected.code)));
  };

  const saveFeedback = () => {
    const next = { ...feedback, [selected.code]: feedbackDraft };
    setFeedback(next);
    persist("wphi-feedback", next);
  };

  const signOff = () => setStage(selected.code, 4);

  const overallDone = UNITS.filter((u) => stageOf(u.code) === 4).length;

  return (
    <div style={{ background: COLORS.page, minHeight: "100%", color: COLORS.ink, fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif", padding: "0" }}>
      <style>{`
        .wphi-plate { font-family: ui-monospace, 'SF Mono', Menlo, monospace; letter-spacing: 0.06em; font-weight: 700; font-size: 12px; padding: 3px 8px; border-radius: 3px; display: inline-block; }
        .wphi-h { font-family: Georgia, 'Times New Roman', serif; letter-spacing: 0.02em; }
        .wphi-btn { border: 1.5px solid ${COLORS.ink}; background: transparent; color: ${COLORS.ink}; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; font-family: inherit; }
        .wphi-btn:hover { background: ${COLORS.ink}; color: ${COLORS.card}; }
        .wphi-btn-primary { background: ${COLORS.rust}; border-color: ${COLORS.rust}; color: #fff; }
        .wphi-btn-primary:hover { background: ${COLORS.rustDeep}; color: #fff; }
        .wphi-row:hover { background: rgba(0,0,0,0.03); }
      `}</style>

      <div style={{ borderBottom: `3px solid ${COLORS.ink}`, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div className="wphi-h" style={{ fontSize: "24px", fontWeight: 700 }}>WPHI Learn</div>
          <div style={{ fontSize: "13px", color: COLORS.inkSoft }}>AHC30722 Certificate III in Horticulture — Dubbo Training Campus</div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: COLORS.inkSoft }}>Viewing as</span>
          <button className="wphi-btn" style={role === "student" ? { background: COLORS.ink, color: COLORS.card } : {}} onClick={() => setRole("student")}>Student</button>
          <button className="wphi-btn" style={role === "trainer" ? { background: COLORS.ink, color: COLORS.card } : {}} onClick={() => setRole("trainer")}>Trainer</button>
        </div>
      </div>

      {!selected && (
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", gap: "24px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "6px", padding: "14px 20px" }}>
              <div style={{ fontSize: "12px", color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.05em" }}>Units signed off</div>
              <div className="wphi-h" style={{ fontSize: "28px", fontWeight: 700 }}>{overallDone} / {UNITS.length}</div>
            </div>
          </div>

          {TERMS.map((term) => (
            <div key={term} style={{ marginBottom: "28px" }}>
              <div className="wphi-h" style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "6px" }}>Term {term}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
                {UNITS.filter((u) => u.term === term).map((u) => {
                  const stage = stageOf(u.code);
                  return (
                    <div key={u.code} onClick={() => openUnit(u)} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "6px", padding: "14px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span className="wphi-plate" style={{ background: COLORS.ink, color: COLORS.card }}>{u.code}</span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: u.type === "core" ? COLORS.rustDeep : COLORS.goldDeep, textTransform: "uppercase", letterSpacing: "0.04em" }}>{u.type}</span>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.3 }}>{u.title}</div>
                      <div style={{ display: "flex", gap: "3px", marginTop: "4px" }}>
                        {[1, 2, 3, 4].map((s) => (
                          <div key={s} style={{ flex: 1, height: "6px", borderRadius: "2px", background: stage >= s ? COLORS.olive : COLORS.border }} />
                        ))}
                      </div>
                      <div style={{ fontSize: "11px", color: COLORS.inkSoft }}>{STAGES[stage]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div style={{ padding: "24px 28px", maxWidth: "720px" }}>
          <button className="wphi-btn" style={{ marginBottom: "18px" }} onClick={() => setSelected(null)}>&larr; Back to units</button>

          <span className="wphi-plate" style={{ background: COLORS.ink, color: COLORS.card, marginBottom: "10px" }}>{selected.code}</span>
          <h2 className="wphi-h" style={{ fontSize: "20px", fontWeight: 700, margin: "10px 0 4px" }}>{selected.title}</h2>
          <div style={{ fontSize: "13px", color: COLORS.inkSoft, marginBottom: "18px" }}>Term {selected.term} &middot; {selected.type === "core" ? "Core unit" : "Elective unit"}</div>

          <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: "8px", borderRadius: "2px", background: stageOf(selected.code) >= s ? COLORS.olive : COLORS.border, marginBottom: "4px" }} />
                <div style={{ fontSize: "10px", color: COLORS.inkSoft }}>{STAGES[s]}</div>
              </div>
            ))}
          </div>

          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "6px", padding: "16px", marginBottom: "18px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em", color: COLORS.inkSoft }}>Lesson</div>
            <p style={{ fontSize: "14px", lineHeight: 1.6, margin: "0 0 12px" }}>{selected.blurb}</p>
            <div style={{ fontSize: "13px", color: COLORS.rustDeep }}>&#9654; {selected.video}</div>
            {role === "student" && stageOf(selected.code) < 1 && (
              <button className="wphi-btn wphi-btn-primary" style={{ marginTop: "12px" }} onClick={() => setStage(selected.code, 1)}>Mark lesson viewed</button>
            )}
          </div>

          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "6px", padding: "16px", marginBottom: "18px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.04em", color: COLORS.inkSoft }}>Knowledge check</div>
            {selected.quiz.map((q, i) => (
              <div key={i} style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "14px", marginBottom: "6px" }}>{q.q}</div>
                {q.options.map((opt, j) => (
                  <label key={j} style={{ display: "block", fontSize: "13px", marginBottom: "4px", cursor: "pointer" }}>
                    <input type="radio" name={`q${i}`} checked={quizAnswers[i] === j} onChange={() => setQuizAnswers({ ...quizAnswers, [i]: j })} style={{ marginRight: "8px" }} />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
            <button className="wphi-btn wphi-btn-primary" onClick={submitQuiz}>Submit answers</button>
            {quizResult && (
              <div style={{ marginTop: "10px", fontSize: "13px", fontWeight: 600, color: quizResult.correct === quizResult.total ? COLORS.oliveDeep : COLORS.rustDeep }}>
                {quizResult.correct} / {quizResult.total} correct{quizResult.correct === quizResult.total ? " — passed" : " — try again"}
              </div>
            )}
          </div>

          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "6px", padding: "16px", marginBottom: "18px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.04em", color: COLORS.inkSoft }}>Practical evidence</div>
            <p style={{ fontSize: "13px", color: COLORS.inkSoft, marginBottom: "10px" }}>Describe the task completed and attach photo/video evidence in the real system. This demo accepts a text note.</p>
            <textarea value={evidenceDraft} onChange={(e) => setEvidenceDraft(e.target.value)} placeholder="e.g. Photos of pruning cuts on the demonstration orchard block, supervised by Mark Ellison" style={{ width: "100%", minHeight: "70px", padding: "8px", border: `1px solid ${COLORS.border}`, borderRadius: "4px", fontFamily: "inherit", fontSize: "13px", boxSizing: "border-box" }} />
            <button className="wphi-btn wphi-btn-primary" style={{ marginTop: "10px" }} onClick={submitEvidence}>Submit evidence</button>
            {evidence[selected.code] && <div style={{ fontSize: "12px", color: COLORS.inkSoft, marginTop: "8px" }}>Last submitted: &ldquo;{evidence[selected.code]}&rdquo;</div>}
          </div>

          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "6px", padding: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.04em", color: COLORS.inkSoft }}>Trainer feedback and sign-off</div>
            {role === "trainer" ? (
              <>
                <textarea value={feedbackDraft} onChange={(e) => setFeedbackDraft(e.target.value)} placeholder="Feedback for the student" style={{ width: "100%", minHeight: "60px", padding: "8px", border: `1px solid ${COLORS.border}`, borderRadius: "4px", fontFamily: "inherit", fontSize: "13px", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <button className="wphi-btn" onClick={saveFeedback}>Save feedback</button>
                  <button className="wphi-btn wphi-btn-primary" onClick={signOff} disabled={stageOf(selected.code) < 3}>Sign off as competent</button>
                </div>
              </>
            ) : (
              <p style={{ fontSize: "13px", color: COLORS.inkSoft, margin: 0 }}>{feedback[selected.code] || "No feedback yet."}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
