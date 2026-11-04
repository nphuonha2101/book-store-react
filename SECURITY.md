# Security Policy

## Reporting a vulnerability

Please do **not** open a public GitHub issue for security problems.
Report vulnerabilities privately through the repository's **Security →
Advisories → Report a vulnerability** page, or contact the maintainers
directly.

Include reproduction steps, affected versions and the potential impact. We aim
to acknowledge reports within 5 business days.

## Supported versions

Only the latest commit on the default branch receives security fixes.

## Deployment hardening

- Serve the storefront over HTTPS and keep dependencies updated (Dependabot is
  enabled).
- Set `NEXT_PUBLIC_SITE_URL` and the API origin explicitly at build time.
- Restrict Firebase web API keys by HTTP referrer in Google Cloud Console.
- Keep service-account credentials, JWT secrets and payment keys on the backend
  only — never in `NEXT_PUBLIC_*` variables.
