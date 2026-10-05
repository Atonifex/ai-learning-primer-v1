# Validation report

Generated: 2026-10-04 (Europe/Berlin). Reference schema keys taken from `grade-02/florida/ela.json`.

## Summary

| Check | Count |
|---|---|
| JSON files examined | 60 |
| Parse PASS | 60 |
| Parse FAIL | 0 |
| Schema PASS (required keys + consistency clean) | 60 |
| Schema WARN (optional/extra/consistency notes) | 0 |
| Schema FAIL (missing required keys) | 0 |
| Staged copies | 60 |

## Required keys (reference)

From G2 Florida ELA:

```
schema_version, doc_id, doc_type, system, grade, subject, status, content_labels, sections, citations, last_updated
```

Also present on reference (checked as optional, reported if absent):

```
programme, grade_label, version_notes
```

IB and crosswalk files use the **same top-level key set** as Florida in these drafts (confirmed). No fields were invented.

## Per-file results

| File | parse | schema | missing_required | notes |
|---|---|---|---|---|
| `grade-02/florida/ela.json` | PASS | PASS | — | — |
| `grade-02/florida/mathematics.json` | PASS | PASS | — | — |
| `grade-02/florida/science.json` | PASS | PASS | — | — |
| `grade-02/florida/social-studies.json` | PASS | PASS | — | — |
| `grade-02/ib/ela.json` | PASS | PASS | — | — |
| `grade-02/ib/mathematics.json` | PASS | PASS | — | — |
| `grade-02/ib/science.json` | PASS | PASS | — | — |
| `grade-02/ib/social-studies.json` | PASS | PASS | — | — |
| `grade-02/crosswalks/ela.json` | PASS | PASS | — | — |
| `grade-02/crosswalks/mathematics.json` | PASS | PASS | — | — |
| `grade-02/crosswalks/science.json` | PASS | PASS | — | — |
| `grade-02/crosswalks/social-studies.json` | PASS | PASS | — | — |
| `grade-05/florida/ela.json` | PASS | PASS | — | — |
| `grade-05/florida/mathematics.json` | PASS | PASS | — | — |
| `grade-05/florida/science.json` | PASS | PASS | — | — |
| `grade-05/florida/social-studies.json` | PASS | PASS | — | — |
| `grade-05/ib/ela.json` | PASS | PASS | — | — |
| `grade-05/ib/mathematics.json` | PASS | PASS | — | — |
| `grade-05/ib/science.json` | PASS | PASS | — | — |
| `grade-05/ib/social-studies.json` | PASS | PASS | — | — |
| `grade-05/crosswalks/ela.json` | PASS | PASS | — | — |
| `grade-05/crosswalks/mathematics.json` | PASS | PASS | — | — |
| `grade-05/crosswalks/science.json` | PASS | PASS | — | — |
| `grade-05/crosswalks/social-studies.json` | PASS | PASS | — | — |
| `grade-06/florida/ela.json` | PASS | PASS | — | — |
| `grade-06/florida/mathematics.json` | PASS | PASS | — | — |
| `grade-06/florida/science.json` | PASS | PASS | — | — |
| `grade-06/florida/social-studies.json` | PASS | PASS | — | — |
| `grade-06/ib/ela.json` | PASS | PASS | — | — |
| `grade-06/ib/mathematics.json` | PASS | PASS | — | — |
| `grade-06/ib/science.json` | PASS | PASS | — | — |
| `grade-06/ib/social-studies.json` | PASS | PASS | — | — |
| `grade-06/crosswalks/ela.json` | PASS | PASS | — | — |
| `grade-06/crosswalks/mathematics.json` | PASS | PASS | — | — |
| `grade-06/crosswalks/science.json` | PASS | PASS | — | — |
| `grade-06/crosswalks/social-studies.json` | PASS | PASS | — | — |
| `grade-07/florida/ela.json` | PASS | PASS | — | — |
| `grade-07/florida/mathematics.json` | PASS | PASS | — | — |
| `grade-07/florida/science.json` | PASS | PASS | — | — |
| `grade-07/florida/social-studies.json` | PASS | PASS | — | — |
| `grade-07/ib/ela.json` | PASS | PASS | — | — |
| `grade-07/ib/mathematics.json` | PASS | PASS | — | — |
| `grade-07/ib/science.json` | PASS | PASS | — | — |
| `grade-07/ib/social-studies.json` | PASS | PASS | — | — |
| `grade-07/crosswalks/ela.json` | PASS | PASS | — | — |
| `grade-07/crosswalks/mathematics.json` | PASS | PASS | — | — |
| `grade-07/crosswalks/science.json` | PASS | PASS | — | — |
| `grade-07/crosswalks/social-studies.json` | PASS | PASS | — | — |
| `grade-08/florida/ela.json` | PASS | PASS | — | — |
| `grade-08/florida/mathematics.json` | PASS | PASS | — | — |
| `grade-08/florida/science.json` | PASS | PASS | — | — |
| `grade-08/florida/social-studies.json` | PASS | PASS | — | — |
| `grade-08/ib/ela.json` | PASS | PASS | — | — |
| `grade-08/ib/mathematics.json` | PASS | PASS | — | — |
| `grade-08/ib/science.json` | PASS | PASS | — | — |
| `grade-08/ib/social-studies.json` | PASS | PASS | — | — |
| `grade-08/crosswalks/ela.json` | PASS | PASS | — | — |
| `grade-08/crosswalks/mathematics.json` | PASS | PASS | — | — |
| `grade-08/crosswalks/science.json` | PASS | PASS | — | — |
| `grade-08/crosswalks/social-studies.json` | PASS | PASS | — | — |

## Issues detail

No parse failures, no missing required keys, no consistency warnings.

## Notes

- No standard text was modified. Staging used byte-identical `copy2` from draft sources.
- Crosswalk destination filenames renamed to match PR #2 (`*-florida-arizona-ib.json`); JSON content unchanged.
- Grades 3–4 are already in PR #2 and were not staged from this disk.
