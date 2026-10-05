/** Quiz and crew-log overlays are full-screen work — dialogue must not sit on top. */
export function shouldHideDialogueForOverlay(opts: {
  showQuiz: boolean;
  showReflection: boolean;
}): boolean {
  return opts.showQuiz || opts.showReflection;
}
