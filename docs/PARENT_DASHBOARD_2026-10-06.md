# Parent identity, handoff and reporting

Read PROJECT_MEMORY.md before continuing and update it after meaningful discoveries. User authorization: improve parent identity/handoff, then build a dashboard for student usage and standards progress. Weekly email is excluded. Treeline teaching and bottom dialogue belong to separate agents.

## Parent flow

Public first-session preview → labeled parent registration/consent → captain name, login, PIN and grade → ready/handoff → child-scoped learning. Existing captains are selectable. A chosen name is preserved; old nameless profiles use their child login as a display fallback. The parent can return via student Settings → Switch account → parent sign-in, without ending the stored session.

Setup keeps entered fields after failure, validates names before creating a child, distinguishes login from display name, and focuses the ready heading after selection. Child handoff uses fresh-document navigation because it changes the signed-in account. Privacy, household ownership and existing saved learning remain intact.

## Dashboard

Entry: Household → Student usage and progress (`/household/progress`). Parent authentication is required. A selected student must belong to the authenticated parent's household before profile, usage or evidence queries run. Invalid student IDs render notFound; child accounts return to learning. Viewing a report does not switch to the child's account.

- Student switcher and usage periods: last 7 days, last 30 days, all recorded time.
- Recorded session time, sessions started, completed activity attempts and recorded activity time.
- Daily usage table, assigned to Eastern calendar dates.
- Enrolled-subject filters; catalog standards with descriptions, observation counts, practice estimates, last observation and estimate confidence.
- Latest recorded observations, with support/source labels and recorded correctness where available.
- Empty household, no evidence, loading and retryable error states.

## What the numbers mean

Usage filters select sessions **started** and activities **completed** within a rolling period. Only closed records contribute elapsed time; an open session's age is not counted as usage. A saved session can span multiple visits, so session starts are not a daily active-user or visit count. Daily session time belongs to its start date; activity time belongs to its completion date. These are recorded clocks rather than minute-by-minute activity attribution. Breaks and overlap are possible; session and activity time are never added together.

Standards progress remains cumulative when the usage period changes. An unobserved standard is “Not observed,” not a zero score. Existing mastery calculations remain unchanged. Practice estimates and confidence are not school grades or proof of independent mastery; checkpoint labels alone do not establish independence. Coverage disclosure remains: available catalogs and authored checks are different; this beta does not provide full Grade 3–8 curriculum.

No weekly email, third-party tracking, new curriculum, generated reporting claims or paid media were added. Printable exports, valid unit/chapter tests, activity-level evidence drilldown and precise active-time instrumentation remain later work.

## Validation record

Earlier full unit suite: 217 tests across 54 files passed; dashboard TypeScript and targeted lint passed. Four parent end-to-end flows passed: name-save recovery/persistence and correct child handoff; mobile legacy/fused naming; dashboard student/date/subject navigation/reload; foreign-ID and child-role denial.

The broader 48-test browser attempt was stopped after failures including shared-server connection refusal and changing dialogue panels. Later full-parent reruns stalled, including an isolated server's cold compilation. The account-switch control was added afterward; its component browser check and cookie-expiration unit test are tracked separately. Do not claim a complete manual playtest or a green full browser suite. Temporary verification source/environment copies and their dependency/asset junctions were removed without deleting shared dependencies or assets.

Final checks: **229 unit tests/58 files**, TypeScript and targeted lint pass. The real account-switch component passed an isolated Chromium error/retry/navigation test; the actual logout handler passed cookie-expiration regression. Full student → logout → parent sign-in → dashboard integration remains unverified due the later server stalls. Four earlier full parent flows remain passing evidence, not a claim that the changing whole-app suite is green. Temporary verification server stopped; temporary config/source/environment copies cleaned up.
