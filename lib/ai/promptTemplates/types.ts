export interface SubjectPromptTemplate {
  subjectSlug: string;
  /** Subject-specific instructional lens (persona, pedagogy, response shape). */
  basePrompt: string;
  /**
   * Difficulty-calibration and wrong-answer guidance. Kept as a separate block
   * because it goes AFTER the coherence/memory blocks so the model has the
   * data to actually calibrate against.
   */
  pedagogyInstructions: string;
}
