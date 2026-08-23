# Post–V1 roadmap (story, curriculum, reporting)

This document tracks capabilities that are **planned but not yet implemented**. It complements [product-vision.md](./product-vision.md).

## Standards- and syllabus-backed curriculum

- Today: curriculum graph seeds are created in code / minimal AI-assisted structure; `CurriculumVersion.sourceNotes` is reserved for future references.
- Later: attach official standards lists, district syllabi, or PDFs; version them; pass stable IDs into generation so arcs align with external requirements (including ESA/homeschool reporting).

## Micro-assessments (story-framed)

- Multiple choice (e.g. A–E), fill-in-the-blank, word bank, matching, lightweight mini-games.
- Tie results to concept ledger and future “protagonist rank” / mastery signals without replacing narrative learning.

## Parent / guardian reporting

- After the core learning journey is validated through iteration.
- Focus: **mastery** and **engagement** signals (not raw chat logs).

## Inline implementation note

Curriculum generation entry points should carry a short comment pointing here and to `CurriculumVersion.sourceNotes` for future standards ingestion (see `lib/services/storyCurriculum.ts`).
