# Kling MCP — production credit budget

Latest actual production, 2026-10-05: Premier; V03's19 completed jobs cost1,504 credits, leaving6,096 checked credits. Five new ChatGPT reference images used no Kling credits. Previous pilot40 and V1360 remain archived/library history. OAuth official CLI works; native MCP tools remain absent. See `public/cinematics/prologue-v3/README.md` for exact completed assets and costs; public rate estimates below are historical planning, not a fresh checkout quote. Read `PROJECT_MEMORY.md` before production and update meaningful discoveries; never retain credentials.

## How the connection works

Codex sends a tool request (prompt, selected model, duration, output settings, approved references) to the hosted Kling MCP using the saved OAuth authorization. Kling generates on its servers and returns a task ID. We query that ID for status/results and save the completed footage. MCP provides generation/account tools, not the final editing timeline or editable captions. Codex usage and Kling credit charges are separate. Registration/OAuth succeeded earlier; this chat still has no exposed Kling tools, so reconnect/refresh before account/capability checks.

Official guide: https://kling.ai/app/mcp/guide . Read its rendered public FAQ in the in-app browser; web text extraction returned an empty shell. Verified FAQ:
- Same generation prices as official Kling platforms; no off-peak free generation through AI assistants.
- Paid credits in Personal workspace only; Team benefits unavailable; bonus credits cannot be spent through MCP/CLI.
- Non-subscribers get one concurrent video task. Published rate cap 5 requests/s; subscriber task limits differ.
- Tasks cannot be canceled after submission. Result URLs valid 24h; save promptly.

Public Credits Policy: https://kling.ai/docs/point-policy . Generation credits deducted immediately; technical generation failure refunds credits. A successfully generated take that we dislike should be budgeted as spent. Subscription credits valid one month after distribution; purchased top-up credits valid two years. Public standard top-up conversion is USD 1 = 66 credits; discounts/checkout may differ. Credits are not a substitute for membership entitlements.

## VIDEO 3.0 public reference rates

Source: https://kling.ai/quickstart/klingai-video-3-model-user-guide . These rates do not establish available models/params for this account or alternate-model/reference workflow prices.

| Mode | Credits/s 720p | Credits/s 1080p | 5s at 1080p |
|---|---:|---:|---:|
| No native audio | 6 | 8 | 40 |
| Native audio | 9 | 12 | 60 |
| Optional voice control surcharge | +2 | +2 | +10 |

VIDEO 3.0 supports 3–15s generations per guide. Plan short shots, then edit the clips together. More/longer takes cost more; a 90s finished edit is not necessarily 90s of charged source footage. Native 4K is substantially costlier; prefer 1080p for website delivery unless a test identifies a reason otherwise.

## Budget estimate — our three-part opening

Scope: 30s mission prologue + 30s crash + proposed 30s leadership objective. Tutorials excluded. Editing/captions do not spend Kling video-generation credits unless we regenerate footage; other audio/tools may have separate costs.

Minimum arithmetic, assuming every generated second is used and no retries/references: 90 × 8 = **720 credits** silent 1080p, or 90 × 12 = **1,080 credits** all native audio. This is not a realistic final-production budget.

Planning scenario (assumptions, not a performance guarantee): around 110–130s source footage for a 90s edit, about three takes per source shot, mostly silent 1080p with separate narration, some native dialogue/lip-sync tests. Silent base: 110–130 × 3 × 8 = **2,640–3,120 credits**. Add reference images/character preparation and some higher-priced dialogue attempts; round to **3,000–5,000 credits**. Image/Element costs require actual tool/account quotes. Native mixed audio is not assumed to arrive as editable stems; preserve a separate dialogue master and clean picture where possible.

If most scenes need repeated regeneration or we use premium reference/4K workflows, **6,000–8,000+** is possible. Treat that as a scope/cost review point, not permission to spend. No unlimited retries.

Recommended initial test cap for approval: **300–500 credits** for references and a small representative set (Rho direct address, ship action). Quote precise jobs first. Review style, continuity, speech, and actual charges before authorizing the larger batch.

## Subscription choice

Official plan page https://kling.ai/app/membership/membership-plan was read in the browser on 2026-10-05 and confirmed the figures below. Published guide corroborates them: https://kling.ai/blog/kling-video-3-0-credit-cost-guide?tab=all (July 28, 2026). Public offer/renewal figures are not a personalized checkout quote; actual account, tax, first-purchase eligibility, renewal and upgrade rules need checking. No purchase clicked; signed-out plan view, not account-specific access.

| Plan | Monthly credits | Published first-subscription offer | Published next monthly renewal |
|---|---:|---:|---:|
| Standard | 660 | USD 6.99 | USD 8.80 |
| Pro | 3,000 | USD 25.99 | USD 32.56 |
| Premier | 8,000 | USD 64.99 | USD 80.96 |

Paid plans publicly list commercial use, watermark removal, and 1080p access; Basic lists no commercial use. Verify terms for the selected account/model and exported assets before publishing.

Upgrade clarification (official membership FAQ Q9, checked 2026-10-05): only one subscription is active at a time; multiple purchased subscriptions apply in priority order, with Premier ahead of Pro. The public page limits the first-purchase offer to one use. Do not budget a second introductory discount when moving from Pro to Premier, or assume payment is only the price difference. Public FAQ does not establish a personalized upgrade charge, proration, or immediate incremental credit allocation; inspect the signed-in checkout before paying.

Recommendation: **Pro monthly** for a staged first run; 3,000 credits covers testing and a lean attempt, but may need a top-up/upgrade for the entire polished 90s. **Premier monthly** is the comfortable choice if Ivan wants a single larger allowance for many iterations this month. Avoid an annual commitment until we validate the generation workflow. Standard is adequate for small tests but too small for this full production estimate. Subscription is recommended for production rights/features/value, not claimed to be mandatory for every MCP generation; guide allows non-subscribers with eligible paid credits.

## Before first charge

Refresh MCP availability; inspect identity/model specs and usable Personal credits. Verify current per-job prices and commercial/export options. Obtain a concrete test budget and accepted shots, then generate a small batch, save outputs within link validity, record actual credits, and reassess the rest. Being “ready soon” is not approval for a paid job or recurring purchase. Keep captions external and editable; no tutorial production.
