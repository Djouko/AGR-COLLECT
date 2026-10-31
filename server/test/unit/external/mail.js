require('should');
const { createServer } = require('net');
const appRoot = require('app-root-path');
const { mailer } = require(appRoot + '/lib/external/mail');

describe('external/mail smtp transport', () => {
  // A port that was just free, so the connection is refused immediately.
  const closedPort = () => new Promise((resolve) => {
    const server = createServer().listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });

  it('should resolve and log instead of rejecting when SMTP is unreachable', async () => {
    const port = await closedPort();
    const mail = mailer({
      transport: 'smtp',
      serviceAccount: 'no-reply@agr.test',
      transportOpts: { host: '127.0.0.1', port, connectionTimeout: 2000 },
      env: { domain: 'https://agr.test' }
    });

    const written = [];
    const originalWrite = process.stderr.write;
    process.stderr.write = (chunk) => { written.push(String(chunk)); return true; };
    let result;
    try {
      result = await mail('agent@agr.test', 'accountReset', { token: 'abc' });
    } finally {
      process.stderr.write = originalWrite;
    }

    (result === null).should.be.true();
    written.join('').should.match(new RegExp(`mail send failed for accountReset:agent@agr.test via 127.0.0.1:${port}`));
  });
});
