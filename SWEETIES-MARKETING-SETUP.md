# Jahntella Sweeties Marketing

The marketing layer is intentionally separate from the existing Sweetie signup, verification, and private music access system.

## What was added

- `sweeties-marketing.html` — private/no-index campaign composer page.
- `sweeties-marketing.css` — Jahntella-styled marketing UI.
- `sweeties-marketing.js` — uses the existing Supabase Auth session and calls the Edge Function.
- `supabase/functions/send-sweeties-campaign/index.ts` — secure Resend sender, subscriber counting, test email, campaign send, and signed unsubscribe links.

The existing `sweetie-access.js` signup flow is not changed.

## One-time Supabase setup

Run these commands from a local clone of this repository after installing the Supabase CLI and linking the project:

```bash
supabase login
supabase link --project-ref mchyedehbudsqixvfvbm
supabase secrets set RESEND_API_KEY="YOUR_RESEND_API_KEY"
supabase secrets set RESEND_FROM_EMAIL="Jahntella <YOUR_VERIFIED_FROM_ADDRESS>"
supabase secrets set PUBLIC_SITE_URL="https://jahntella.com"
supabase secrets set MARKETING_ADMIN_EMAILS="YOUR_ADMIN_EMAIL@example.com"
supabase secrets set UNSUBSCRIBE_SECRET="GENERATE_A_LONG_RANDOM_SECRET"
supabase functions deploy send-sweeties-campaign --no-verify-jwt
```

`--no-verify-jwt` is intentional: the function has its own authenticated POST check, while the GET endpoint must remain public so unsubscribe links work. The Resend API key and other secrets never belong in this GitHub repository or browser JavaScript.

## Admin access

Open:

`https://jahntella.com/sweeties-marketing.html`

You must already be signed in through the existing Supabase Sweetie account, and that account's email must be included in `MARKETING_ADMIN_EMAILS` (or have `app_metadata.marketing_admin=true` / `app_metadata.role=admin`).

## Sending flow

1. Open the marketing page while signed in.
2. The page counts verified users whose existing `user_metadata.marketing_opt_in` is `true`.
3. Write the subject, preheader, headline, message, optional image, and optional button/link.
4. Preview the email.
5. Send a test to the signed-in admin email.
6. Send the campaign to opted-in, email-confirmed Sweeties.
7. Each recipient gets a signed, unique unsubscribe link.
8. Unsubscribe updates the existing Supabase `marketing_opt_in` value to `false`.

## Personalization

Put `[first_name]` anywhere in the message. The sender replaces it with the Sweetie's existing `first_name` value from the signup metadata.

## Important

The current signup already stores `marketing_opt_in` in Supabase user metadata, so no new signup form or music-access table is required for this marketing layer.
