# Phase 1 local status (updated 2026-10-05)

Florida + IB + FL↔IB crosswalks, four subjects each. Arizona is empty in the crosswalks. No cloud-agent run was used for the local drafts below.

## Complete on this computer

| Grade | Programme | Where | Notes |
|---|---|---|---|
| 2 | PYP | `/workspace/curriculum-drafts/grade-02/` | Florida, IB, crosswalks, SOURCES, IB notes |
| 5 | PYP | `/workspace/curriculum-drafts/grade-05/` | Florida, IB, crosswalks, SOURCES, IB notes |
| 6 | MYP | `/workspace/curriculum-drafts/grade-06/` | Florida, IB, crosswalks. SS.68 band omitted on purpose |
| 7 | MYP | `/workspace/curriculum-drafts/grade-07/` | Florida, IB, crosswalks. **Single home for SS.68.*** (15 codes) |
| 8 | MYP | `/workspace/curriculum-drafts/grade-08/` | Florida, IB, crosswalks. **SS.8 only. SS.68 is not copied** |

Grade 8 Florida counts: ELA 24, mathematics 40, science 40, social studies 126.

## Grades 3–4: copied from GitHub PR #2 (2026-10-05)

Grades **3 and 4** (Florida + IB PYP + crosswalks, 24 JSON) were authored in [PR #2](https://github.com/Atonifex/ai-learning-primer-v1/pull/2) and are now **also included in the staging mirror**, copied verbatim from branch `cursor/phase1-fl-ib-pilot-cfae` (commit `985d4cfceec612a98858f9240f4cb58996a039fd`). They were not regenerated and not rebuilt from legacy `curriculum_resources`.

- Paths: `florida/grade-0{3,4}/`, `ib/pyp/grade-0{3,4}/`, `crosswalks/grade-0{3,4}/` (4 subjects each)
- Integrity: all 24 files match the PR branch git blob SHAs byte-for-byte (LF line endings); all 24 parse as JSON
- These already exist in PR #2. When pushing, they should show **no diff** for G3–4; only G2 and G5–8 are new.

## Staging (push-ready mirror)

Validated and staged on 2026-10-04 (Europe/Berlin). No CloudAgent.

- Mirror: `/workspace/curriculum-drafts/staging/curriculum-standards-library/`
- Map: `/workspace/curriculum-drafts/staging/STAGING-MAP.md`
- Validation: `/workspace/curriculum-drafts/staging/VALIDATION-REPORT.md`
- Staged files: **84** total
  - **60** local drafts (grades 2, 5–8 × florida + ib + crosswalks × 4 subjects). Parse: 60 PASS / 0 FAIL; Schema: 60 PASS / 0 WARN / 0 FAIL (2026-10-04 report)
  - **24** copied from PR #2 (grades 3–4). Parse: 24 PASS; SHA match to PR branch: 24/24

Grades 2–8 now complete in one tree (84/84 active FL+IB docs; Arizona deferred). Ready to land into PR #2 (cloud agent or a local git push from the laptop clone). Do not invent standards text on push.

## Push

Landing any of the local grades (2, 5, 6, 7, 8) in the repo still needs a Cursor cloud agent. Included cloud-agent usage was blocking launches as of 2026-10-03. On-demand spend was not turned on. Drafts stay local until that usage is available again.
