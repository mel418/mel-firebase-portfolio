// One-off local utility: exchanges a fresh Spotify OAuth authorization
// code for a refresh token. Run this whenever SPOTIFY_REFRESH_TOKEN needs
// to be regenerated (e.g. after the app's client secret was reset, or the
// token was revoked). Not part of the site build — dev-only, run manually.
//
// Before running:
//   1. Open https://developer.spotify.com/dashboard, open the app whose
//      Client ID/Secret are in .env, go to Settings → Redirect URIs, and
//      add exactly:  http://127.0.0.1:8888/callback
//      (Spotify requires an exact match — "localhost" is not the same as
//      "127.0.0.1" as far as their redirect_uri check is concerned.)
//   2. Make sure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env are
//      the current values from that same dashboard page.
//
// Run:  node scripts/get-spotify-refresh-token.mjs
//   - Prints a Spotify login/authorize URL. Open it and log in yourself —
//     this script never sees your Spotify password.
//   - After you approve, Spotify redirects your browser to
//     127.0.0.1:8888/callback?code=..., which this script is listening
//     on. It exchanges that code for a refresh token and prints it.
//   - Copy the printed value into SPOTIFY_REFRESH_TOKEN in .env (and into
//     the deployed environment's secret, if this is going to production).

import http from 'node:http';
import fs from 'node:fs';
import querystring from 'node:querystring';

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPE = 'user-read-currently-playing';

function readEnv(key) {
  const text = fs.readFileSync('.env', 'utf8');
  const match = text.match(new RegExp(`^${key}=(.*)$`, 'm'));
  if (!match) throw new Error(`${key} not found in .env`);
  return match[1].trim();
}

const client_id = readEnv('SPOTIFY_CLIENT_ID');
const client_secret = readEnv('SPOTIFY_CLIENT_SECRET');

const authorizeUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
  response_type: 'code',
  client_id,
  scope: SCOPE,
  redirect_uri: REDIRECT_URI,
})}`;

console.log('\nOpen this URL in your browser and log in with the Spotify account you want the widget to track:\n');
console.log(authorizeUrl);
console.log(`\nWaiting for the redirect back to ${REDIRECT_URI} ...\n`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== '/callback') {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(`<p>Spotify returned an error: ${error}. You can close this tab.</p>`);
    console.error('Authorization denied or failed:', error);
    server.close();
    process.exit(1);
  }

  try {
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      res.writeHead(200, { 'Content-Type': 'text/html' }).end('<p>Token exchange failed — check the terminal. You can close this tab.</p>');
      console.error('Token exchange failed:', data);
      server.close();
      process.exit(1);
    }

    res.writeHead(200, { 'Content-Type': 'text/html' }).end('<p>Success — you can close this tab and go back to the terminal.</p>');

    console.log('Granted scope:', data.scope);
    console.log('\nSPOTIFY_REFRESH_TOKEN=' + data.refresh_token);
    console.log('\nPaste that into .env (replacing the old value), then re-run `npm run dev` to pick it up.');

    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error during token exchange:', err);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT);
