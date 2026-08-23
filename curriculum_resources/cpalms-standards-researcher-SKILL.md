---
name: cpalms-standards-researcher
description: Research and document Florida B.E.S.T. standards from CPALMS into the Primer project's .md and .ts formats. Use this skill whenever the user asks to research CPALMS standards, add new grade/subject standards to the project, scrape CPALMS pages, or document Florida ELA/Math/Science standards for the AI Learning Primer. Triggers include "research the standards for grade X", "add Grade 4 ELA standards", "scrape CPALMS for [subject]", "document the next set of standards", or any mention of CPALMS, B.E.S.T. standards, or Florida education standards.
---

# CPALMS Standards Researcher

This skill encodes the full workflow for finding, scraping, and documenting Florida B.E.S.T. standards from CPALMS into the AI Learning Primer project. It captures lessons learned from the Grade 3 ELA session so future sessions don't have to rediscover them.

## Output Files

Every standards research session produces two files in `curriculum_resources/`:

1. **`[grade]_[subject]_standards.md`** — Full human-readable reference (e.g., `grade3_ela_standards.md`)
2. **`standards_[subject]_[grade].ts`** — TypeScript SubjectSeed data file (e.g., `standards_ela_grade3.ts`)

Optionally, if supplementary PDFs are found: **`cpalms_supplementary_resources.md`** (or append to existing file).

Always read the existing files before starting to understand the schema and continue from where the last session left off.

---

## Phase 1: Understand What Exists

Before doing anything, read the existing files so you know the exact schema to follow.

```
Read curriculum_resources/[grade]_[subject]_standards.md  (or similar)
Read curriculum_resources/standards_[subject]_[grade].ts
```

Key things to confirm:
- What standard groups already exist (e.g., R.1, R.2 already done; R.3, C, V, F still needed)
- The TypeScript type structure (`SubjectSeed`, `strands > groups > standards`)
- The `.md` benchmark entry schema (code, strand, description, clarifications, purpose, misconceptions, glossary, vertical alignment, related courses/access points, verification status, primer incorporation notes)
- The current catalog version so you can bump it after adding new content

---

## Phase 2: Find CPALMS Standard IDs

CPALMS is a JavaScript-rendered site. **WebFetch returns a blank shell.** Always use Claude in Chrome browser tools.

### Finding the IDs

**Method 1 — Sequential scan (most reliable for complete grade sets):**
CPALMS assigns sequential integer IDs to standards within a grade/subject block. For Grade 3 ELA, the main block ran from ID 15207–15230. Start by searching for one known standard, then scan adjacent IDs.

```
Navigate to: https://www.cpalms.org/PreviewStandard/PrintStandard/[ID]
```

Check the page: if it's the right grade/subject, grab the benchmark code and description. If it jumped to a different grade/subject, the block has ended.

**Method 2 — WebSearch (use when you don't have a starting ID):**
Search for the benchmark code directly: `"ELA.3.F.1.3 CPALMS"` or `"ELA.4.R.1.1 CPALMS"`. The search result typically includes the CPALMS URL with the ID.

**Method 3 — Browser search page:**
```
Navigate to: https://www.cpalms.org/public/search/Standard
```
Use get_page_text after navigation to see the search interface. Filter by grade and subject.

### Critical ID Gaps to Know

- **Foundational Skills (F strand) IDs are NOT adjacent to the main block.** Grade 3 F strand was at IDs 15002–15003, far from the main R/C/V block at 15207–15230. Always search explicitly for F strand benchmarks.
- **Some benchmarks don't exist at certain grades.** Grade 3 has no F.1.1 or F.1.2 (those are K–2 only in B.E.S.T.). Verify existence before assuming sequential completeness.
- **IDs can be non-sequential within a group.** C.1 benchmarks had codes C.1.1 at 15220, C.1.2 at 15218, C.1.3 at 15219. Track benchmark codes explicitly, not ID order.

---

## Phase 3: Scrape CPALMS Pages

### Efficient Batch Scraping

Use `browser_batch` to scrape multiple pages in one call. This is much faster than scraping one page at a time.

```
browser_batch with actions:
  navigate → https://www.cpalms.org/PreviewStandard/PrintStandard/[ID_1]
  get_page_text → save as benchmark_[CODE]
  navigate → https://www.cpalms.org/PreviewStandard/PrintStandard/[ID_2]
  get_page_text → save as benchmark_[CODE]
  ... (up to ~10 pages per batch to avoid timeouts)
```

The output is large — save it to a file in the outputs directory and read it with the Read tool.

### What to Extract from Each Page

For each benchmark page, extract:
- **Official benchmark code and description** (exactly as written)
- **Clarifications** (numbered list, usually Clarification 1, 2, 3)
- **Related courses** (course names and codes, usually in a "Related Courses" section)
- **Access points** (the AP variant of the benchmark, e.g., ELA.3.R.1.AP.1)
- **Supplementary links** (any PDF links, appendix references, "See X" text — see Phase 5)
- **CPALMS page URL** for `sourceUrl` field in the .ts file

**Fields often NOT on CPALMS page** (mark as "Not explicitly stated"):
- Official examples (infer from clarifications or context)
- Purpose and instructional strategies (infer; note as inferred)
- Common misconceptions (infer from clarifications or grade-level knowledge)
- Glossary terms (cross-reference Appendix E glossary)
- Vertical alignment (sometimes present, often not)

### PrintStandard vs. Preview URLs

- `PrintStandard/[ID]` — cleaner format, usually better for scraping; use by default
- `Preview/[ID]` — sometimes has additional metadata; use as fallback or for verification
- Some IDs only work with one of the two URL patterns. Try both if one returns nothing.

---

## Phase 4: Write the Output Files

### .md File Schema

Each benchmark entry follows this exact structure:

```markdown
### Benchmark: ELA.X.X.X.X

- **Code:** ELA.X.X.X.X
- **Strand:** [Strand name]
- **Standard grouping:** ELA.X.X.X — [Group display name]
- **Grade:** X
- **Official description:** [Exact CPALMS text]
- **Official examples:** [Exact CPALMS text, or "None explicitly stated."]
- **Clarifications:**
  - Clarification 1: [text]
  - Clarification 2: [text, if present]
- **Purpose and instructional strategies:** [CPALMS text or "(Inferred)" note]
- **Common misconceptions or errors:** [CPALMS text or "(Inferred)" note]
- **Glossary terms:** [from CPALMS page or "Not explicitly stated."]
- **Vertical alignment:** [from CPALMS page or "Not explicitly stated."]
- **Related courses or access points:**
  - [Course Name] ([course code])
  - **Access Point:** [AP code] — [AP description]
- **Verification status:** [Fully verified / Partially verified] ([URL])
- **Primer incorporation notes:**
  - Skill observed: [Can the learner...]
  - Misconception to detect: [...]
  - Narrative/problem contexts: [...]
  - Learner evidence: [...]
```

**Verification status definitions:**
- **Fully verified** = description retrieved from PrintStandard page and confirmed accurate
- **Partially verified** = description confirmed from another source (search result, access point description) but full PrintStandard page metadata was sparse or redirected

### .ts File Schema

Follow the `SubjectSeed` type structure:

```typescript
export const standards[Subject][Grade]: SubjectSeed = {
  slug: "[subject]_g[grade]",
  domain: "[SUBJECT]",         // "ELA", "MATH", etc.
  gradeBand: "[grade]",        // "3", "4", etc.
  framework: "FL_BEST",
  displayName: "Grade [X] [Subject]",
  catalog: {
    version: "v2",             // bump version when adding new strands
    label: "Florida Grade [X] [Subject] — All Standards",
    framework: "FL_BEST",
    strands: [
      {
        code: "[STRAND_CODE]", // "R", "C", "V", "F" for ELA
        displayName: "[Strand Name]",
        groups: [
          {
            code: "ELA.[G].[STRAND].[N]",
            displayName: "[Group Display Name]",
            standards: [
              {
                code: "ELA.[G].[STRAND].[N].[M]",
                description: "[exact CPALMS description]",
                clarifications: ["Clarification 1 text", "Clarification 2 text"],
                accessPoints: ["AP.1 — description", "AP.2 — description"],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/[ID]",
              },
            ],
          },
        ],
      },
    ],
  },
};
```

---

## Phase 5: Capture Supplementary Resources

When scraping CPALMS pages, always watch for:

- **"See [Document Name]"** in clarifications (e.g., "See Appendix B", "See Writing Types")
- **PDF links** in the page body (e.g., `appendixb.pdf`, `appendixe.pdf`)
- **Links to appendices or reference documents** in headers or footers

### Known Supplementary Document Locations

CPALMS hosts B.E.S.T. appendices at:
```
https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/la/[filename].pdf
```

Known files (paste these URLs into chat to fetch content):
- `appendixa.pdf` — Writing Types (narrative, opinion, expository definitions + grade progressions)
- `appendixb.pdf` — Reading (text complexity framework, Lexile bands, poem form examples)
- `appendixc.pdf` — Elaborative Techniques
- `appendixd.pdf` — Elementary Figurative Language
- `appendixe.pdf` — Reading Foundations (Dolch/Fry lists, fluency norms, oral reading rubrics, full ELA glossary)

**Important:** `web_fetch` only works for URLs that appeared in a prior user message or fetch result. To fetch a new appendix PDF, paste its URL in the chat first, then ask for a fetch.

### Documenting Supplementary Resources

Append newly found resources to `curriculum_resources/cpalms_supplementary_resources.md` following this format:

```markdown
## Resource N: [Document Name]

- **Referenced by:** [benchmark code(s)]
- **Source URL:** [URL or "URL unknown — see CPALMS page for [code]"]
- **Fetch status:** ✅ Full / ⚠️ Not yet fetched
- **Contents:** [description of what's inside, organized by section]
- **Primer relevance:** [how this resource informs content design]
```

---

## Phase 6: Primer Incorporation Notes

For each benchmark's "Primer incorporation notes" section, answer four questions:

1. **Skill observed:** What specific thing can a learner do to demonstrate this benchmark? Frame as "Can the learner..." — concrete and observable.

2. **Misconception to detect:** What is the most common error at this grade level for this benchmark? Use the clarification notes as a guide; many clarifications exist precisely because of known student confusions.

3. **Narrative/problem contexts:** What kind of Primer story arc or scene would naturally surface this skill? Think about embedded informational passages, character dialogue, poetic text in the story world, etc. Prefer contexts that feel like part of the story rather than a test.

4. **Learner evidence:** What would the learner actually produce or say that would show mastery? Be specific about quantity and quality (e.g., "names 2 character traits and cites a text event for each").

---

## Common Pitfalls

- **CPALMS is JS-rendered.** WebFetch always returns a shell. Always use Chrome browser tools.
- **Batch output is large.** Save browser_batch results to a file; don't try to hold them all in context.
- **F strand IDs are in a separate range** from the main grade block. Search for them explicitly.
- **Some benchmarks have PreviewStandard URLs, not PrintStandard.** Both formats work; PrintStandard is usually cleaner.
- **Benchmark code order ≠ CPALMS ID order.** C.1.1 was at a higher ID than C.1.2 in Grade 3. Always track by benchmark code, not by ID sequence.
- **Check for missing benchmarks.** Some benchmark numbers don't exist at certain grades (F.1.1 and F.1.2 don't exist at Grade 3). Verify existence before assuming a complete set.
- **Bump the catalog version** in the .ts file when adding new strands (v1 → v2 when adding strands beyond the initial two groups).
- **Don't repeat work.** Always check what's already in the .md and .ts files before scraping — many benchmarks may already be documented.

---

## Checklist for a Complete Standards Session

- [ ] Read existing .md and .ts files to understand current state
- [ ] Identify which standards are missing
- [ ] Find CPALMS IDs for missing standards (main block + F strand if applicable)
- [ ] Scrape pages using browser_batch
- [ ] Extract all fields for each benchmark
- [ ] Note all "See X" references and PDF links
- [ ] Write complete benchmark entries to .md file
- [ ] Write standard objects to .ts file
- [ ] Verify TypeScript structure compiles (check types align with SubjectSeed)
- [ ] Document any new supplementary resources found
- [ ] Update verification status table in .md file
