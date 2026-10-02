#!/usr/bin/env python3
"""build_bundle.py - validate every library document and generate bundle.json.

PURPOSE
    The library stores one JSON file per document (easy to review in git, easy
    to edit one grade at a time). The AI Learning Primer wants ONE file it can
    load. This script walks the library, validates each document against the
    shared envelope, and writes bundle.json containing everything.

USAGE
    python3 tools/build_bundle.py            # validate + write bundle.json
    python3 tools/build_bundle.py --check    # validate only, write nothing
    python3 tools/build_bundle.py --root /path/to/curriculum-standards-library

PARAMETERS
    --root   Library root. Default: the parent folder of this script, so the
             script works no matter where you run it from.
    --check  Validate only. Use in CI or before committing.
    --quiet  Hide warnings; still shows errors and the summary.

EXIT CODE
    0 = no errors (warnings allowed). 1 = at least one error; bundle.json is
    NOT written, so a broken document can never reach the Primer.

DESIGN CHOICES (the reasoning)
    * Standard library only. No pip install, so it runs in any cloud session.
    * Errors vs warnings. Errors break the data contract (missing field, bad
      enum, wrong label). Warnings are drift worth a look (document not in the
      inventory, inventory status out of sync).
    * Deterministic output. bundle.json uses sorted keys and a "generated_from"
      date taken from the newest document last_updated, NOT the wall clock.
      Otherwise every run rewrites the file and git shows noise diffs.
    * Label rules are enforced here (A only in Florida/Arizona docs, B only in
      IB docs) because "never present an IB item as an official grade standard"
      is the project's most important rule, and a machine check beats memory.

PITFALLS
    * Template files contain placeholders, so they are NOT validated as
      documents. They are only checked for having every envelope key, so the
      templates cannot drift away from this script.
    * The citation rule (status above not_started needs a citation) applies to
      content documents only (state_standards, ib_alignment, crosswalk,
      summary). Meta and source_log documents are exempt: a README has nothing
      to cite, and source logs ARE the citations.
    * doc_id is derived from the file path and compared to the id in the file.
      Moving a file without updating its doc_id is an error on purpose.
"""

import argparse
import json
import re
import sys
from pathlib import Path

# --------------------------------------------------------------------------
# Contract: edit these constants and the templates together. Nowhere else.
# --------------------------------------------------------------------------
SCHEMA_VERSION = "0.1.0"

ENVELOPE_FIELDS = [
    "schema_version", "doc_id", "doc_type", "system", "programme", "grade",
    "grade_label", "subject", "status", "content_labels", "sections",
    "citations", "version_notes", "last_updated",
]
DOC_TYPES = {"state_standards", "ib_alignment", "crosswalk", "summary", "source_log", "meta"}
SYSTEMS = {"florida", "arizona", "ib", "crosswalk"}  # null allowed for meta/source_log/summary
PROGRAMMES = {"PYP", "MYP", "DP_CP"}
SUBJECTS = {"ela", "mathematics", "science", "social-studies"}
STATUSES = ["not_started", "in_progress", "drafted", "reviewed", "approved"]
LABELS = {"A", "B", "C"}
TEXT_MODES = {"exact", "paraphrased"}
ALIGNMENT_LEVELS = {
    "Strong alignment", "Partial alignment", "State-specific requirement",
    "IB-framework-only emphasis", "Needs human curriculum review",
}
CITATION_FIELDS = [
    "id", "url", "title", "publisher", "published_or_version_date",
    "page", "access_date", "access_limitation",
]
CONTENT_TYPES = {"state_standards", "ib_alignment", "crosswalk", "summary"}
REQUIRED_SECTIONS = {
    "state_standards": ["grade_and_subject", "domains", "assessment_notes",
                        "key_learning_outcomes", "version_and_update_notes"],
    "ib_alignment": ["applicable_programme", "subject_group_or_structure",
                     "framework_elements", "official_requirements", "typical_fit",
                     "suggested_alignment_to_florida_and_arizona", "access_limitations"],
    "crosswalk": ["rows"],
}
# Which labels each system may carry. Crosswalks cite A and B items but their
# own text is C, so all three are allowed there.
ALLOWED_LABELS = {"florida": {"A", "C"}, "arizona": {"A", "C"}, "ib": {"B", "C"},
                  "crosswalk": {"A", "B", "C"}}

# Folder/file layout -> expected doc_id.
SYSTEM_PREFIX = {"florida": "fl", "arizona": "az"}
CONTENT_DIRS = ["florida", "arizona", "ib", "crosswalks", "summaries"]
META_FILES = ["README.json", "project-status.json", "research-log.json", "inventory.json"]
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def expected_doc_id(rel: Path):
    """Derive the doc_id a file SHOULD have from its path, or None if unknown.

    florida/grade-03/ela.json                    -> fl.grade-03.ela
    ib/pyp/grade-03/ela.json                     -> ib.pyp.grade-03.ela
    ib/dp-cp/grade-11/ela.json                   -> ib.dp-cp.grade-11.ela
    crosswalks/grade-03/ela-florida-arizona-ib.json -> xw.grade-03.ela
    summaries/vertical-progression.json          -> sum.vertical-progression
    """
    p = rel.parts
    stem = rel.stem
    if p[0] in SYSTEM_PREFIX and len(p) == 3:
        return f"{SYSTEM_PREFIX[p[0]]}.{p[1]}.{stem}"
    if p[0] == "ib" and len(p) == 4:
        return f"ib.{p[1]}.{p[2]}.{stem}"
    if p[0] == "crosswalks" and len(p) == 3:
        return f"xw.{p[1]}.{stem.replace('-florida-arizona-ib', '')}"
    if p[0] == "summaries" and len(p) == 2:
        return f"sum.{stem}"
    return None


class Report:
    """Collects errors and warnings so we can show all problems at once."""
    def __init__(self):
        self.errors, self.warnings = [], []

    def err(self, where, msg):
        self.errors.append(f"ERROR   {where}: {msg}")

    def warn(self, where, msg):
        self.warnings.append(f"warning {where}: {msg}")


def validate_envelope(doc, where, rep, is_content_path):
    """Check the shared envelope. Returns True if the doc is structurally usable."""
    if not isinstance(doc, dict):
        rep.err(where, "top level must be a JSON object")
        return False
    missing = [f for f in ENVELOPE_FIELDS if f not in doc]
    if missing:
        rep.err(where, f"missing envelope fields: {missing}")
        return False
    extra = [k for k in doc if k not in ENVELOPE_FIELDS]
    if extra:
        rep.warn(where, f"unknown top-level keys (ignored by the Primer): {extra}")

    if doc["doc_type"] not in DOC_TYPES:
        rep.err(where, f"doc_type {doc['doc_type']!r} not in {sorted(DOC_TYPES)}")
    if doc["status"] not in STATUSES:
        rep.err(where, f"status {doc['status']!r} not in {STATUSES}")
    if doc["system"] is not None and doc["system"] not in SYSTEMS:
        rep.err(where, f"system {doc['system']!r} not in {sorted(SYSTEMS)} or null")
    if doc["subject"] is not None and doc["subject"] not in SUBJECTS:
        rep.err(where, f"subject {doc['subject']!r} not in {sorted(SUBJECTS)} or null")

    # IB alignment docs need a programme. The IB source register (system "ib",
    # doc_type source_log) spans all programmes, so its programme stays null.
    # Non-IB documents must always have programme null.
    if doc["system"] == "ib" and doc["doc_type"] == "ib_alignment":
        if doc["programme"] not in PROGRAMMES:
            rep.err(where, f"IB alignment documents need programme in {sorted(PROGRAMMES)}")
    elif doc["programme"] is not None and doc["system"] != "ib":
        rep.err(where, "programme must be null unless system is 'ib'")

    # Grade: 0 = Kindergarten, 1-12, or null for non-grade documents.
    g = doc["grade"]
    if g is not None and not (isinstance(g, int) and 0 <= g <= 12):
        rep.err(where, "grade must be an integer 0-12 (0 = Kindergarten) or null")
    if is_content_path and doc["doc_type"] != "summary" and g is None:
        rep.err(where, "grade-level documents need a grade")

    # Labels.
    labels = doc["content_labels"]
    if not isinstance(labels, list) or not set(labels) <= LABELS:
        rep.err(where, "content_labels must be a list drawn from A, B, C")
    elif doc["system"] in ALLOWED_LABELS and not set(labels) <= ALLOWED_LABELS[doc["system"]]:
        rep.err(where, f"{doc['system']} documents may only carry labels "
                       f"{sorted(ALLOWED_LABELS[doc['system']])}, found {labels}")

    if not isinstance(doc["sections"], dict):
        rep.err(where, "sections must be an object")
    if not isinstance(doc["version_notes"], list):
        rep.err(where, "version_notes must be a list")
    if not (isinstance(doc["last_updated"], str) and DATE_RE.match(doc["last_updated"])):
        rep.err(where, "last_updated must be YYYY-MM-DD")
    return True


def validate_citations(doc, where, rep):
    """Check citation shape; return the set of citation ids."""
    ids = set()
    cits = doc["citations"]
    if not isinstance(cits, list):
        rep.err(where, "citations must be a list")
        return ids
    for i, c in enumerate(cits):
        if not isinstance(c, dict):
            rep.err(where, f"citations[{i}] must be an object")
            continue
        miss = [f for f in CITATION_FIELDS if f not in c]
        if miss:
            rep.err(where, f"citations[{i}] missing fields {miss}")
        cid = c.get("id")
        if cid in ids:
            rep.err(where, f"duplicate citation id {cid!r}")
        ids.add(cid)
    # Rule: content documents above not_started need at least one citation.
    if (doc["doc_type"] in CONTENT_TYPES and doc["status"] != "not_started"
            and not cits):
        rep.err(where, "status is above not_started but the document has no citations")
    return ids


def check_refs(ids_used, cit_ids, where, rep, what):
    for cid in ids_used or []:
        if cid not in cit_ids:
            rep.err(where, f"{what} references unknown citation id {cid!r}")


def validate_sections(doc, where, rep, cit_ids):
    """Per-doc_type structure checks. Skipped while a document is not_started,
    because empty skeletons are fine at that stage."""
    dt, sec = doc["doc_type"], doc["sections"]
    if doc["status"] == "not_started" or dt not in REQUIRED_SECTIONS:
        return
    missing = [s for s in REQUIRED_SECTIONS[dt] if s not in sec]
    if missing:
        rep.err(where, f"missing sections for {dt}: {missing}")
        return

    if dt == "state_standards":
        for d in sec["domains"]:
            for s in d.get("standards", []):
                sid = s.get("id", "<no id>")
                for f in ("id", "text", "text_mode", "citation_ids", "page", "label"):
                    if f not in s:
                        rep.err(where, f"standard {sid} missing {f}")
                if s.get("text_mode") not in TEXT_MODES:
                    rep.err(where, f"standard {sid}: text_mode must be exact|paraphrased")
                if s.get("label") != "A":
                    rep.err(where, f"standard {sid}: state standards must carry label A")
                check_refs(s.get("citation_ids"), cit_ids, where, rep, f"standard {sid}")

    elif dt == "ib_alignment":
        for r in sec["official_requirements"]:
            if r.get("label") != "B":
                rep.err(where, "official_requirements entries must carry label B")
            if not r.get("citation_ids"):
                rep.err(where, "official_requirements entries need citation_ids")
            check_refs(r.get("citation_ids"), cit_ids, where, rep, "official_requirement")

    elif dt == "crosswalk":
        for i, row in enumerate(sec["rows"]):
            if row.get("alignment_level") not in ALIGNMENT_LEVELS:
                rep.err(where, f"rows[{i}] alignment_level {row.get('alignment_level')!r} "
                               f"is not one of the five allowed values")
            if not row.get("suggested_instructional_bridge"):
                rep.err(where, f"rows[{i}] needs suggested_instructional_bridge (label C)")


def load_json(path: Path, rep, root: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        rep.err(str(path.relative_to(root)), f"cannot parse JSON: {e}")
        return None


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    ap.add_argument("--check", action="store_true", help="validate only")
    ap.add_argument("--quiet", action="store_true", help="hide warnings")
    args = ap.parse_args()
    root: Path = args.root.resolve()
    rep = Report()

    seen_ids = {}                      # doc_id -> relative path
    documents, sources, meta = {}, {}, {}

    # ---- templates: must contain every envelope key + _instructions --------
    for t in sorted((root / "templates").glob("*.json")):
        d = load_json(t, rep, root)
        if isinstance(d, dict):
            miss = [f for f in ENVELOPE_FIELDS + ["_instructions"] if f not in d]
            if miss:
                rep.err(f"templates/{t.name}", f"template out of sync, missing {miss}")

    # ---- gather every document ---------------------------------------------
    jobs = [("meta", root / f) for f in META_FILES]
    jobs += [("source", p) for p in sorted((root / "sources").glob("*.json"))]
    for d in CONTENT_DIRS:
        jobs += [("content", p) for p in sorted((root / d).rglob("*.json"))]

    for kind, path in jobs:
        rel = path.relative_to(root)
        where = str(rel)
        if not path.exists():
            rep.err(where, "required file is missing")
            continue
        doc = load_json(path, rep, root)
        if doc is None or not validate_envelope(doc, where, rep, kind == "content"):
            continue
        cit_ids = validate_citations(doc, where, rep)
        validate_sections(doc, where, rep, cit_ids)

        did = doc["doc_id"]
        if did in seen_ids:
            rep.err(where, f"duplicate doc_id {did!r} (also in {seen_ids[did]})")
        seen_ids[did] = where
        if kind == "content":
            want = expected_doc_id(rel)
            if want is None:
                rep.warn(where, "file is in an unexpected location")
            elif want != did:
                rep.err(where, f"doc_id {did!r} does not match path (expected {want!r})")
            documents[did] = doc
        elif kind == "source":
            sources[did] = doc
        else:
            meta[did] = doc

    # ---- inventory cross-check ---------------------------------------------
    inv_doc = meta.get("meta.inventory")
    entries = (inv_doc or {}).get("sections", {}).get("entries", [])
    inv_ids = {e["doc_id"]: e for e in entries}
    for did, doc in documents.items():
        if did not in inv_ids:
            rep.warn(did, "document exists but is not in inventory.json")
        elif inv_ids[did]["status"] != doc["status"]:
            rep.warn(did, f"inventory status {inv_ids[did]['status']!r} != document "
                          f"status {doc['status']!r}")
    for did, e in inv_ids.items():
        if e["status"] != "not_started" and did not in documents:
            rep.err(did, "inventory says work started but the file does not exist")

    # ---- report ------------------------------------------------------------
    if not args.quiet:
        for w in rep.warnings:
            print(w)
    for e in rep.errors:
        print(e)

    all_docs = list(documents.values()) + list(sources.values()) + list(meta.values())
    by_status = {s: sum(1 for d in documents.values() if d["status"] == s) for s in STATUSES}
    print(f"\nInventory entries: {len(entries)} | grade/summary documents present: "
          f"{len(documents)} | status counts: {by_status}")
    print(f"Errors: {len(rep.errors)} | Warnings: {len(rep.warnings)}")
    if rep.errors:
        print("bundle.json NOT written because of errors.")
        return 1
    if args.check:
        return 0

    newest = max((d["last_updated"] for d in all_docs), default=None)
    bundle = {
        "bundle_metadata": {
            "bundle_schema_version": SCHEMA_VERSION,
            "generated_from": newest,   # newest last_updated, not the wall clock
            "generator": "tools/build_bundle.py",
            "counts": {
                "inventory_entries": len(entries),
                "documents_present": len(documents),
                "by_status": by_status,
            },
        },
        "inventory": entries,
        "sources": sources,
        "meta": meta,
        "documents": documents,
    }
    out = root / "bundle.json"
    out.write_text(json.dumps(bundle, indent=2, sort_keys=True, ensure_ascii=False) + "\n",
                   encoding="utf-8")
    print(f"Wrote {out.relative_to(root.parent)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
