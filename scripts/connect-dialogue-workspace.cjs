const fs = require('fs');
const path = 'components/play/PlayShell.tsx';
let s = fs.readFileSync(path,'utf8').replaceAll('\r\n','\n');
s = s.replace('useTransition }','useTransition, type CSSProperties, type SetStateAction }');
s = s.replace('import { shouldHideDialogueForOverlay } from "../../lib/play/overlayWorkMode";', 'import { WORKSPACE_PANELS } from "../../lib/play/dialogueLayout";\nimport ContentWorkspace from "./ContentWorkspace";\nimport { useWorkspace } from "./useWorkspace";\nimport { usePlayViewport } from "./usePlayViewport";\nimport "./dialogueDock.css";');
const statesStart = s.indexOf('  const [boardOpen, setBoardOpen]');
const statesEnd = s.indexOf('  const [subjectSlug',statesStart);
const pairs = [['board','Board'],['garden','Garden'],['gardenTeach','GardenTeach'],['focus','Focus'],['math','MathCheck'],['map','Map']];
let states = '  const { panel, setPanel, setOpen } = useWorkspace(props.autoOpenBoard ? "board" : props.autoOpenFocus ? "focus" : props.autoOpenClip ? "clip" : null);\n  const [historyOpen, setHistoryOpen] = useState(false);\n  const [maximized, setMaximized] = useState(false);\n  const viewport = usePlayViewport();\n';
for (const [id,name] of pairs) states += `  const ${name[0].toLowerCase()+name.slice(1)}Open = panel === "${id}";\n  const set${name}Open = useCallback((value: SetStateAction<boolean>) => setOpen("${id}", value), [setOpen]);\n`;
states += '  const [clipOffer, setClipOffer] = useState<LearningClipOffer | null>(() => props.autoOpenClip ? LEARNING_CLIP_FIXTURE : null);\n  const clip = panel === "clip" ? clipOffer : null;\n  const setClip = useCallback((value: LearningClipOffer | null) => { setClipOffer(value); setOpen("clip", Boolean(value)); }, [setOpen]);\n';
s = s.slice(0,statesStart)+states+s.slice(statesEnd);
s = s.replace('  const [mapOpen, setMapOpen] = useState(false);\n','');
const effectStart = s.indexOf('  useEffect(() => {\n    if (\n      shouldHideDialogueForOverlay');
const effectEnd = s.indexOf('  useEffect(() => {',effectStart+20);
if (effectStart < 0 || effectEnd < 0) throw Error('overlay effect anchor');
s = s.slice(0,effectStart)+'  useEffect(() => { setOpen("quiz", learning.showQuiz); }, [learning.showQuiz, setOpen]);\n  useEffect(() => { setOpen("reflection", learning.showReflection); }, [learning.showReflection, setOpen]);\n  useEffect(() => { if (panel) setDialogueOpen(true); setHistoryOpen(false); setMaximized(false); }, [panel]);\n\n'+s.slice(effectEnd);
// Map is content in the shared workspace, rather than an independent top-layer dialog.
const mapStart = s.indexOf('      {mapOpen && <WorldMapPanel');
const mapEnd = s.indexOf('conversationBusy={stream.streaming} />}\n',mapStart)+'conversationBusy={stream.streaming} />}\n'.length;
if (mapStart<0 || mapEnd<mapStart) throw Error('map anchor');
const map = s.slice(mapStart,mapEnd); s=s.slice(0,mapStart)+s.slice(mapEnd);
const dialogueStart = s.indexOf('      {dialogueOpen && (\n        <DialogueCutscene');
const dialogueEnd = s.indexOf('      {mathCheckOpen && (',dialogueStart);
let dialogue=s.slice(dialogueStart,dialogueEnd).replace('      {dialogueOpen && (\n','').replace('      )}\n','');
dialogue=dialogue.replace('        <DialogueCutscene\n','        <DialogueCutscene\n          open={dockVisible} inert={viewport.narrow && Boolean(panel || historyOpen)}\n          workBusy={workBusy} historyOpen={historyOpen} narrow={viewport.narrow} maximized={maximized}\n          onHistory={() => setHistoryOpen((open) => !open)} onCloseHistory={() => setHistoryOpen(false)}\n          onMaximize={() => setMaximized((value) => !value)}\n');
dialogue=dialogue.replace('onClose={() => setDialogueOpen(false)}','onClose={() => { if (!workBusy) { setPanel(null); setHistoryOpen(false); setDialogueOpen(false); } }}');
s=s.slice(0,dialogueStart)+dialogue+'      {panel && <ContentWorkspace title={WORKSPACE_PANELS[panel].title} narrow={viewport.narrow} maximized={maximized}\n        hidden={historyOpen} onMaximize={() => setMaximized((value) => !value)} onClose={canClosePanel ? closePanel : undefined}>\n'+map+s.slice(dialogueEnd);
s=s.replace('{learning.showQuiz && learning.quiz && (','{panel === "quiz" && learning.showQuiz && learning.quiz && (').replace('{learning.showReflection && learning.reflection && (','{panel === "reflection" && learning.showReflection && learning.reflection && (');
const toast = s.indexOf('      {stream.observationToasts.map');
s=s.slice(0,toast)+'      </ContentWorkspace>}\n\n'+s.slice(toast);
// Keep the Pixi instance mounted, resize its available region instead of covering the captain.
s=s.replace('      <OverworldCanvas\n','      <div className="overworld-viewport" inert={viewport.narrow && Boolean(panel || historyOpen)} aria-hidden={maximized || undefined}>\n      <OverworldCanvas\n');
s=s.replace('        onPosition={setPosition}\n      />','        onPosition={setPosition}\n      />\n      </div>');
s=s.replace('          dialogueOpen ||','          dockVisible ||').replace('          Boolean(clip)\n','          Boolean(clip) || gardenOpen || gardenTeachOpen\n');
const layout = `  const dockVisible = dialogueOpen || Boolean(panel) || historyOpen;
  const workBusy = (panel === "quiz" && !learning.quiz?.alreadyCompleted && !learning.quizResult) || panel === "reflection";
  const canClosePanel = !workBusy;
  function closePanel() {
    if (panel === "quiz") learning.setShowQuiz(false);
    if (panel === "clip") setClipOffer(null);
    setPanel(null); setDialogueOpen(true); void missions.refresh(); void worldMap.refresh();
  }
  const effectivePanel = historyOpen ? "history" : panel;
  const workspaceWidth = maximized ? "100%" : effectivePanel && WORKSPACE_PANELS[effectivePanel].wide ? "max(660px, 65%)" : "max(460px, 40%)";
  const layoutStyle = { "--workspace-width": workspaceWidth, ...(viewport.height ? { height: viewport.height } : {}) } as CSSProperties;

`;
const ret=s.indexOf('  return (\n    <div className="play-world');
if(ret<0) throw Error('shell return');
s=s.slice(0,ret)+layout+s.slice(ret);
s=s.replace('data-testid="play-shell" data-ready=', 'style={layoutStyle} data-conversation={dockVisible} data-panel={Boolean(effectivePanel)} data-narrow={viewport.narrow} data-maximized={maximized && Boolean(effectivePanel)} data-testid="play-shell" data-ready=');
s=s.replace('{chrome.radio && (','{chrome.radio && !dockVisible && (');
s=s.replace('{firstRun.coach && !dialogueOpen && !learning.showQuiz && (','{firstRun.coach && !dockVisible && !learning.showQuiz && (');
// Brief confirmation stays inside the dock bounds while a conversation is open.
s=s.replace('className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-4"','className="leave-confirmation absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-4"');
fs.writeFileSync(path,s);
