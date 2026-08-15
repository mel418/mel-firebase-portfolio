'use server';

import querystring from 'querystring';

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

interface AccessTokenResponse {
  access_token: string;
}

async function getAccessToken(): Promise<string> {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = (await response.json()) as AccessTokenResponse;
  return data.access_token;
}

interface NowPlayingResponse {
  is_playing: boolean;
  progress_ms: number | null;
  item?: {
    name: string;
    duration_ms: number;
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string }[];
    };
    external_urls: {
      spotify: string;
    };
  };
}

export async function getNowPlaying() {
  const access_token = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache',
  });

  if (response.status === 204 || response.status > 400) {
    return { isPlaying: false };
  }

  const song = (await response.json()) as NowPlayingResponse;

  if (!song.item) {
    return { isPlaying: false };
  }
  
  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist) => _artist.name).join(', ');
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0]?.url;
  const songUrl = song.item.external_urls.spotify;
  const progressMs = song.progress_ms ?? undefined;
  const durationMs = song.item.duration_ms;

  return {
    isPlaying,
    title,
    artist,
    album,
    albumImageUrl,
    songUrl,
    progressMs,
    durationMs,
  };
}
