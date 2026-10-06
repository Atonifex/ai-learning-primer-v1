"use client";

import { useEffect, useState } from "react";
import { filterWorldNodes, type MapTask, type WorldNode, type WorldSnapshot } from "../../lib/play/worldMap";
import IslandChart, { PLACE_SYMBOLS } from "./IslandChart";

export default function WorldMapPanel(props: {
  world: WorldSnapshot | null; selectedId: string | null; position: { x: number; y: number };
  onSelect: (id: string) => void; onClose: () => void; onWalk: (node: WorldNode) => void;
  onAsk: (node: WorldNode) => void; onMission: (id: string) => void; onActivity: (task: MapTask) => void;
  onFocus: () => void; onSaveNote: (id: string, note: string) => Promise<void>;
  error: string | null; refreshing: boolean; onRefresh: () => void; busy: boolean; conversationBusy: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const [overview, setOverview] = useState(false);
  const selected = props.world?.nodes.find((n) => n.id === props.selectedId) ?? props.world?.nodes[0];
  const nodes = filterWorldNodes(props.world?.nodes ?? [], filter);
  return <section className="world-atlas" aria-labelledby="atlas-title" data-testid="world-map">
    <header className="atlas-header"><div><h2 id="atlas-title">Our island</h2><p>{props.world?.chapterTitle ?? "Unfolding your map…"}</p>
      {props.world && <p data-testid="atlas-camp">{props.world.camp.stageLabel} · rations {props.world.camp.rations} · crew {props.world.camp.crewFound} of {props.world.camp.crewTotal}</p>}</div>
      <button type="button" onClick={props.onClose} autoFocus className="map-button">Close map <span aria-hidden>×</span></button></header>
    <div className="atlas-objective"><span aria-hidden>⚑</span><p>{props.world?.objective ?? "Finding your expedition…"}</p><button className="map-link" onClick={props.onFocus}>Choose a subject</button></div>
    {props.error && <div role="alert" className="map-error">{props.error} <button onClick={props.onRefresh}>Try again</button></div>}
    <div className="atlas-body">
      <nav className="atlas-places" aria-label="Map locations"><div className="atlas-filters" aria-label="Filter locations">{[["all", "All"], ["work", "To do"], ["completed", "Done"]].map(([id, label]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
        {nodes.map((node) => <button key={node.id} className="atlas-place" aria-pressed={selected?.id === node.id} onClick={() => props.onSelect(node.id)}><span className="place-symbol" aria-hidden>{PLACE_SYMBOLS[node.kind]}</span><span><strong>{node.title}</strong><small>{node.status === "locked" ? "Not open yet" : node.tasks.some((t) => !t.completed) ? `${node.tasks.filter((t) => !t.completed).length} ready to try` : node.status === "completed" ? "Explored · work saved" : "Ready to explore"}</small></span></button>)}
        {nodes.length === 0 && props.world && <p className="atlas-empty">No places in this view yet. Choose All to explore.</p>}
        <p className="atlas-sync" role="status">{props.refreshing ? "Updating your chart…" : "Your story and map travel together."}</p>
      </nav>
      <div className="atlas-chart"><div className="chart-heading"><span>{overview ? "The wider island" : "Our expedition"}</span><button onClick={() => setOverview(!overview)} aria-pressed={overview}>{overview ? "Zoom to our shore" : "Whole island"}</button></div>{props.world && <IslandChart world={props.world} selectedId={selected?.id} onSelect={props.onSelect} position={props.position} overview={overview} />}</div>
      {selected && <LocationDetail key={selected.id} {...props} node={selected} />}
    </div>
    <footer className="atlas-footer"><span>● You are here</span><span>✓ Work saved</span><span>· Not open yet</span><span>New shores appear as your story grows.</span></footer>
  </section>;
}

function LocationDetail(props: Parameters<typeof WorldMapPanel>[0] & { node: WorldNode }) {
  const { node } = props;
  const [note, setNote] = useState(node.note ?? "");
  const [saving, setSaving] = useState(false), [status, setStatus] = useState("");
  useEffect(() => { setNote(node.note ?? ""); }, [node.note]);
  return <section className="atlas-detail" aria-label={`${node.title} details`}>
    <div className={`landmark-sketch sketch-${node.kind}`} aria-hidden><span>{PLACE_SYMBOLS[node.kind]}</span></div>
    <h3>{node.title}</h3><p>{node.description}</p>
    {node.kind === "camp" && node.campStage && <p data-testid="camp-place-stage">This camp is a {node.campStage === "clearing" ? "bare clearing" : node.campStage === "crates" ? "crate pile" : node.campStage}.</p>}
    {node.status === "locked" ? <p className="map-lock">{node.lockReason ?? "Keep exploring with Rho to open this place."}</p> : <div className="atlas-actions"><button className="map-button primary" onClick={() => props.onWalk(node)}>Walk here</button><button className="map-button" disabled={props.conversationBusy} onClick={() => props.onAsk(node)}>{props.conversationBusy ? "Rho is finishing…" : "Ask Rho about this"}</button></div>}
    <h4>At this place</h4>
    {node.missionId && <button className="map-task" disabled={props.busy || node.status !== "available"} onClick={() => props.onMission(node.missionId!)}><span>{node.status === "completed" ? "✓" : "◇"}</span><span>{node.status === "completed" ? "Shore job complete" : "Open shore job"}<small>{node.status === "locked" ? "Not open yet" : "A job from our first expedition"}</small></span></button>}
    {node.tasks.map((task) => <button key={task.id} className="map-task" disabled={props.busy || task.completed || node.status === "locked"} onClick={() => props.onActivity(task)}><span>{task.completed ? "✓" : "✧"}</span><span>{task.title}<small>{task.completed ? "Work saved" : "Created with Rho · ready to try"}</small></span></button>)}
    {!node.missionId && !node.tasks.length && <p className="atlas-empty">A place for the chapter ahead. Ask Rho to plan your next step.</p>}
    {node.status !== "locked" && <form className="map-note" onSubmit={async (e) => { e.preventDefault(); setSaving(true); setStatus(""); try { await props.onSaveNote(node.id, note); setStatus("Note saved on your map."); } catch (error) { setStatus(error instanceof Error ? error.message : "Could not save."); } finally { setSaving(false); } }}>
      <label htmlFor="captain-map-note">Captain’s note</label><textarea id="captain-map-note" maxLength={240} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What should we remember about this place?" rows={3} />
      <button className="map-link" disabled={saving || !note.trim() || note.trim() === node.note}>{saving ? "Saving…" : "Save note"}</button><p role="status">{status}</p>
    </form>}
  </section>;
}
