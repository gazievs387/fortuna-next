# Yandex Cloud Function (Node.js)

Entry point: `index.handler`. Install dependencies from this directory before
uploading the function package (`npm install --omit=dev`).

Configure these variables on the function:

- `SMTP_HOST` — defaults to `smtp.mail.selcloud.ru`
- `SMTP_PORT` — defaults to `1127`
- `SMTP_USE_SSL` — defaults to `true` for implicit TLS; set to `false` only for STARTTLS
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM` — sender address, for example `\"Fortuna\" <app@example.com>`
- `BOOKING_TO` — recipient address or comma-separated addresses
- `ALLOWED_ORIGIN` — deployed static site's origin

Set credentials in Yandex Cloud Function settings, not in this repository.
