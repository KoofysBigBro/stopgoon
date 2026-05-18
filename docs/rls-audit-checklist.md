# RLS Policy Audit Checklist

Use this checklist before each production release that changes auth, chat, billing, exports, or user privacy.

## 1) Inventory and ownership

- [ ] Export current schema and policy set from Supabase (tables, views, functions, policies).
- [ ] Verify every `public.*` table has RLS enabled unless intentionally public.
- [ ] Confirm table owners are expected and no unexpected grants exist to `anon` or `authenticated`.

## 2) High-risk tables in this app

- [ ] `users`: only owner can read/update own row; no policy allows broad profile reads unless intentionally public via RPC.
- [ ] `chat_messages`: insert policy enforces `auth.uid() = user_id`; select policy only exposes intended rooms.
- [ ] `accountability_partners`: users can only read/write partnerships where they are `user1_id` or `user2_id`.
- [ ] `daily_checkins`, `urge_logs`, `journal_entries`, `relapses`: read/write restricted to owner.
- [ ] `lemonsqueezy_webhook_events`: direct client access denied (service-role only).
- [ ] `rate_limits`: confirm direct client writes are disallowed.

## 3) RPC / function safety

- [ ] Enumerate all RPC functions used by app routes/components.
- [ ] For each admin RPC (`admin_*`): verify role checks are enforced inside function body.
- [ ] For user RPCs: verify target IDs cannot escape caller scope.
- [ ] Confirm `SECURITY DEFINER` functions set `search_path` safely and validate caller intent.

## 4) API route + RLS interaction checks

- [ ] Webhook routes use service-role client and are never cookie-session dependent.
- [ ] User APIs use session-bound client and rely on RLS for row access.
- [ ] No API trusts client-provided `user_id`, `role`, or privileged fields.
- [ ] Chat send path validates DM room membership server-side.
- [ ] Export path verifies premium entitlement server-side before data access.

## 5) Abuse and escalation tests

- [ ] Attempt cross-user reads with forged IDs on all data endpoints.
- [ ] Attempt cross-user writes (`user_id` mismatch) on inserts/updates.
- [ ] Attempt direct browser/API access to admin RPCs as normal user.
- [ ] Attempt posting to unauthorized DM rooms.
- [ ] Verify muted/banned users cannot send chat messages through API.

## 6) Billing and webhook correctness

- [ ] Webhook signature validation is required in every environment.
- [ ] Idempotency table is present and duplicate events are ignored safely.
- [ ] Subscription state transitions are deterministic for create/update/cancel/expire events.
- [ ] Replay a prior webhook payload and confirm no duplicate side effects.

## 7) Logging and observability

- [ ] API error logs include route, stage, and safe metadata (no secrets, no raw tokens).
- [ ] Alerts exist for repeated webhook failures and checkout failures.
- [ ] Keep an incident runbook for restoring incorrect subscription states.

## 8) Sign-off

- [ ] Security reviewer sign-off
- [ ] Backend reviewer sign-off
- [ ] Product owner sign-off
