"use client";

import type { DialogueSpeaker } from "../../lib/play/dialogueLayout";
import SafeStill from "./SafeStill";

export default function SpeakerPresence(props: {
  speaker: DialogueSpeaker; playing?: boolean; loading?: boolean; blocked?: boolean;
  onHear?: () => void;
}) {
  const { speaker } = props;
  return <aside className="speaker-presence" aria-label={`${speaker.name}, ${speaker.role}`} data-testid="speaker-presence">
    <div className="speaker-nameplate" data-testid="speaker-nameplate"><strong>{speaker.name}</strong><span>{speaker.role}</span></div>
    <div className="speaker-picture">
      <SafeStill key={speaker.portrait} still={speaker.portrait} alt={`${speaker.name}, ${speaker.role}`} imgClassName="object-contain object-bottom" />
      {props.onHear && <button type="button" className="speaker-hear" onClick={props.onHear}
        aria-label={props.blocked ? `Tap to hear ${speaker.name}` : props.playing ? `Stop ${speaker.name}'s voice` : `Hear ${speaker.name} again`} />}
      {props.playing && <span className="speaker-playing" aria-hidden />}
    </div>
    {(props.blocked || props.loading) && <p className="speaker-status" role="status">{props.loading ? `${speaker.name} is getting ready…` : `Tap ${speaker.name} to hear`}</p>}
  </aside>;
}
