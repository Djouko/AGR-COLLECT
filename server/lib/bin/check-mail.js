// AGR-Collect - SMTP diagnostic run at boot.
//
// Emails are sent in the background (see resources/users.js), so a broken SMTP
// setup is otherwise only visible when a message fails. This connects and
// authenticates with the configured transport and logs an actionable result.
// It never exits non-zero: mail problems must not prevent the service from
// starting.

const config = require('config');
const nodemailer = require('nodemailer');

const { transport, transportOpts } = config.get('default.email');

if (transport !== 'smtp') {
  process.stdout.write(`[mail] transport is '${transport}', skipping SMTP check.\n`);
  process.exit(0);
}

const target = `${transportOpts.host}:${transportOpts.port}`;
nodemailer.createTransport(transportOpts).verify()
  .then(() => {
    process.stdout.write(`[mail] SMTP OK: connected and authenticated to ${target}.\n`);
  })
  .catch((err) => {
    const hints = [];
    if ([25, 465, 587].includes(Number(transportOpts.port)))
      hints.push('DigitalOcean blocks outbound ports 25, 465 and 587 on Droplets: use a provider that accepts port 2525 (e.g. smtp-relay.brevo.com:2525).');
    if (err.code === 'EAUTH')
      hints.push('Check EMAIL_USER / EMAIL_PASSWORD.');
    if (transportOpts.ignoreTLS === true && transportOpts.secure !== true)
      hints.push('EMAIL_IGNORE_TLS=true disables STARTTLS, which most providers require before AUTH.');
    process.stderr.write(`!! [mail] SMTP check FAILED for ${target}: ${err.code || ''} ${err.message}\n`);
    for (const hint of hints) process.stderr.write(`!! [mail] ${hint}\n`);
  })
  .finally(() => process.exit(0));
